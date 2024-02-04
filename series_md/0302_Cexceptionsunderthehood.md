# C++ exceptions under the hood

@meta publishDatetime 2021-03-02T15:43:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl http://monkeywritescode.blogspot.com/p/c-exceptions-under-hood.html

### Index

1. [A tiny ABI](#chapter_n_2)
2. [An ABI to appease the linker](#chapter_n_3)
3. [Catching what you throw](#chapter_n_4)
4. [Magic around \_\_cxa\_begin\_catch and \_\_cxa\_end\_catch](#chapter_n_5)
5. [Gcc\_except\_table and the personality function](#chapter_n_6)
6. [A nice personality](#chapter_n_7)
7. [Two-phase handling](#chapter_n_8)
8. [Catching our first exception](#chapter_n_9)
9. [\_Unwind\_ and call frame info](#chapter_n_10)
10. [Reading a CFI table](#chapter_n_11)
11. [And suddenly, reflexion in C++](#chapter_n_12)
12. [Setting the context for a landing pad](#chapter_n_13)
13. [Multiple landing pads & the teachings of the guru](#chapter_n_14)
14. [Finding the right landing pad](#chapter_n_15)
15. [Finding the right catch in a landing pad](#chapter_n_16)
16. [Reflecting on an exception type and reading .gcc\_except\_table](#chapter_n_17)
17. [Getting the right stack frame](#chapter_n_18)
18. [Getting the right catch in a landing pad](#chapter_n_19)
19. [Running destructors while unwinding](#chapter_n_20)
20. [A summary and some final thoughts](#chapter_n_21)
21. [The true cost of an exception](#chapter_n_I)
22. [Metaclasses and RTTI on C++](#chapter_n_II)

Everyone knows that good exception handling is hard. Reasons for this abound, in every single layer of an exception "lifetime": it's hard to write exception safe code, an exception might be thrown from unexpected places (pun intended!), it's can be complicated to understand badly designed exception hierarchies, it's slow because a lot of voodoo is happening under the hood, it's dangerous because improperly throwing an exception might call the unforgiving std::terminate. And although anyone who might have had to battle an "exceptional" program might know this, the reasons for this mess are not widespread knowledge.

The first question we need to ask ourselves is then, how does it all work. This is the first article on a long series, in which I'll be writing about how exceptions are implemented under the hood in c++ (actually, c++ compiled with gcc on x86 platforms but this might apply to other platforms too). On these articles the process of throwing and catching an exception will be explained with quite a lot of detail, but for the impatient people here is a small brief of all the articles that will follow: how is an exception thrown in gcc/x86:
1. When we write a throw statement, the compiler will translate it into a pair of calls into libstdc++ functions that allocate the exception and then start the stack unwinding process by calling libstdc.
2. For each catch statement, the compiler will write some special information after the method's body, a table of exceptions this method can catch and a cleanup table (more on the cleanup table later).
3. As the unwinder goes through the stack it will call a special function provided by libstdc++ (called personality routine) that checks for each function in the stack which exceptions can be caught.
4. If no matching catch is found for the exception, std::terminate is called.
5. If a matching catch is found, the unwinder now starts again on the top of the stack.
6. As the unwinder goes through the stack a second time it will ask the personality routine to perform a cleanup for this method.
7. The personality routine will check the cleanup table on the current method. If there are any cleanup actions to be run, it will "jump" into the current stack frame and run the cleanup code. This will run the destructor for each object allocated at the current scope.
8. Once the unwinder reaches the frame in the stack that can handle the exception it will jump into the proper catch statement.
9. Upon finishing the execution of the catch statement, a cleanup function will be called to release the memory held for the exception.

This already looks quite complicated and we haven't even started; that was but a short and inaccurate description of all the complexities needed to handle an exception.

To learn about all the details that happen under the hood on the next article we will start to implement our own mini libstdlibc++. Not all of it though, only the part that handles exceptions. Actually not even all of that, only the bare minimum we need to make a simple throw/catch statement work. Some assembly will be needed, but nothing too fancy. A lot of patience will be required, I'm afraid.

If you are too curious and want to start reading about exception handling implementation then you can start [here](/blog_md/youfoundadeadlink.md), for a full specification of what we are going to implement on the next few articles. I'll try to make these articles a bit more didactic and easier to follow though, so see you next time to start our ABI!

###### \*\* Disclaimer note: I'm in no way versed on the magic going on when an exception is thrown. These series will be about trying to demystify the stuff going on under the hood and learning something in the process, and while I hope some of it will be correct I have no doubts there will be a lot of subtleties not quite right. Let me know if you think I should correct something \*\*

---

C++ exceptions under the hood 2: a tiny ABI
-------------------------------------------

If we are going to try and understand why exceptions are complex and how do they work, we can either read a lot of manuals or we can try to write something to handle the exceptions ourselves. Actually, I was surprised by the lack of good information on this topic: pretty much everything I found is either incredibly detailed or very basic, with one exception or two. Of course there are some specifications to implement (most notably the [ABI for c++](/blog_md/youfoundadeadlink.md) but we also have [CFI](http://www.logix.cz/michal/devel/gas-cfi/), [DWARF](http://www.logix.cz/michal/devel/gas-cfi/dwarf-2.0.0.pdf) and libstdc) but reading the specification alone is not enough to really learn what's going on under the hood.

Let's start with the obvious then: wheel reinvention! We know for a fact that plain C doesn't handle exceptions, so let's try to link a throwing C++ program with a plain C linker and see what happens. I came up with something simple like this:

```c++
#include "throw.h"
extern "C" {
    void seppuku() {
        throw Exception();
    }
}
```

Don't forget the extern stuff, otherwise g++ will helpfully mangle our little function's name and we won't be able to link it with our plain C program. Of course, we need a header file to "link" (no pun intended) the C++ world with the C world:

```c++
struct Exception {};

#ifdef __cplusplus
extern "C" {
#endif

    void seppuku();

#ifdef __cplusplus
}
#endif
```

And a very simple main:

```c++
#include "throw.h"

int main()
{
    seppuku();
    return 0;
}
```

What happens now if we try to compile and link together this frankencode?

```c++
&gt; g++ -c -o throw.o -O0 -ggdb throw.cpp
&gt; gcc -c -o main.o -O0 -ggdb main.c
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v01).

So far so good. Both g++ and gcc are happy in their little world. Chaos will ensue once we try to link them, though:

```c++
&gt; gcc main.o throw.o -o app
throw.o: In function `foo()&#x27;:
throw.cpp:4: undefined reference to `__cxa_allocate_exception&#x27;
throw.cpp:4: undefined reference to `__cxa_throw&#x27;
throw.o:(.rodata._ZTI9Exception[typeinfo for Exception]+0x0): undefined reference to `vtable for __cxxabiv1::__class_type_info&#x27;
collect2: ld returned 1 exit status
```

And sure enough, gcc complains about missing C++ symbols. Those are very special C++ symbols, though. Check the last error line: a vtable for cxxabiv1 is missing. cxxabi, defined in libstdc++, refers to the application binary interface for C++. So now we have learned that the exception handling is done with some help of the standard C++ library with an interface defined by C++'s ABI.

The C++ ABI defines a standard binary format so we can link objects together in a single program; if we compile a .o file with two different compilers, and those compilers use a different ABI, we won't be able to link the .o objects into an application. The ABI will also define some other formats, like for example the interface to perform stack unwinding or the throwing of an exception. In this case, the ABI defines an interface (not necessarily a binary format, just an interface) between C++ and some other library in our program which will handle the stack unwinding, ie the ABI defines C++ specific stuff so it can talk to non-C++ libraries: this is what would enable exceptions thrown from other languages to be caught in C++, amongst other things.

In any case, the linker errors are pointing us to the first layer into exception handling under the hood: an interface we'll have to implement ourselves, the cxxabi. For the next article we'll be starting our own mini ABI, as defined in the [C++ ABI](/blog_md/youfoundadeadlink.md).

---

C++ exceptions under the hood 3: an ABI to appease the linker
-------------------------------------------------------------

On our journey to understand exceptions we discovered that the heavy-lifting is done in libstdc++ as specified by the C++ ABI. Reading some linker errors we deduced last time that for handling exceptions we need help from the C++ ABI; we created a throwing C++ program, linked it together with a plain C program and found that the compiler somehow translated our throw instruction into something that is now calling a few libstd++ functions to actually throw an exception. Lost already? You can check the sourcode for this project so far [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v01).

Anyway, we want to understand exactly how an exception is thrown, so we will try to implement our own mini-ABI, capable of throwing an exception. To do this, a lot of [RTFM](/blog_md/youfoundadeadlink.md) is needed, but a full ABI interface can be found [here, for LLVM](http://libcxxabi.llvm.org/spec.html). Let's start by remembering what those missing functions are:

```c++
&gt; gcc main.o throw.o -o app
throw.o: In function `foo()&#x27;:
throw.cpp:4: undefined reference to `__cxa_allocate_exception&#x27;
throw.cpp:4: undefined reference to `__cxa_throw&#x27;
throw.o:(.rodata._ZTI9Exception[typeinfo for Exception]+0x0): undefined reference to `vtable for __cxxabiv1::__class_type_info&#x27;
collect2: ld returned 1 exit status
```

### \_\_cxa\_allocate\_exception

The name is quite self explanatory, I guess. **\_\_cxa\_allocate\_exception** receives a size\_t and allocates enough memory to hold the exception being thrown. There is more to this that what you would expect: when an exception is being thrown some magic will be happening with the stack, so allocating stuff here is not a good idea. Allocating memory on the heap might also not be a good idea, though, because we might have to throw if we're out of memory. A static allocation is also not a good idea, since we need this to be thread safe (otherwise two throwing threads at the same time would equal disaster). Given these constraints, most implementations seem to allocate memory on a local thread storage (heap) but resort to an emergency storage (presumably static) if out of memory. We, of course, don't want to worry about the ugly details so we can just have a static buffer if we want to.

### \_\_cxa\_throw

The function doing all the throw-magic! According to the ABI reference, once the exception has been created **\_\_cxa\_throw** will be called. This function will be responsible of starting the stack unwinding. An important effect of this: **\_\_cxa\_throw** is never supposed to return. It either delegates execution to the correct catch block to handle the exception or calls (by default) **std::terminate**, but it never ever returns.

### vtable for \_\_cxxabiv1::\_\_class\_type\_info

A weird one... \_\_class\_type\_info is clearly some sort of RTTI, but what exactly? It's not easy to answer this one now and it's not terribly important for our mini ABI; we'll leave it to an appendix for after we are done analyzing the process of throwing exceptions, for now let's just say this is the entry point the ABI defines to know (in runtime) whether two types are the same or not. This is the function that gets called to determine whether a catch(Parent) can handle a throw Child. For now we'll focus on the basics: we need to give it an address for the linker (ie defining it won't be enough, we need to instantiate it) and it has to have a vtable (that is, it must have a virtual method).

Lot's of stuff happen on these functions, but let's try to implement the simplest exception thrower possible: one that will call exit when an exception is thrown. Our application was almost OK but missing some ABI-stuff, so let's create a mycppabi.cpp. Reading [our ABI specification](/blog_md/youfoundadeadlink.md) we can figure out the signatures for **\_\_cxa\_allocate\_exception** and **\_\_cxa\_throw**:

```c++
#include &lt;unistd.h&gt;
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

namespace __cxxabiv1 {
    struct __class_type_info {
        virtual void foo() {}
    } ti;
}

#define EXCEPTION_BUFF_SIZE 255
char exception_buff[EXCEPTION_BUFF_SIZE];

extern "C" {

void* __cxa_allocate_exception(size_t thrown_size)
{
    printf("alloc ex %i\n", thrown_size);
    if (thrown_size &gt; EXCEPTION_BUFF_SIZE) printf("Exception too big");
    return &amp;exception_buff;
}

void __cxa_free_exception(void *thrown_exception);

#include &lt;unwind.h&gt;
void __cxa_throw(
          void* thrown_exception,
          struct type_info *tinfo,
          void (*dest)(void*))
{
    printf("throw\n");
    // __cxa_throw never returns
    exit(0);
}

} // extern "C"
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v01).

If we now compile mycppabi.cpp and link it with the other two .o files, we'll get a working binary which should print "alloc ex 1\nthrow" and then exit. Pretty simple, but an amazing feat nonetheless: we've managed to throw an exception without calling libc++. We've written a (very small) part of a C++ ABI!

Another important bit of wisdom we gained by creating our own mini ABI: the throw keyword is compiled into two function calls to libstdc++. No voodoo there, it's actually a pretty simple transformation. We can even disassemble our throwing function to verify it. Let's run this command "g++ -S throw.cpp".

```c++
seppuku:
.LFB3:
    [...]
	call	__cxa_allocate_exception
	movl	$0, 8(%esp)
	movl	$_ZTI9Exception, 4(%esp)
	movl	%eax, (%esp)
	call	__cxa_throw
    [...]
```

Even more magic happening: when the throw keyword gets translated into these two calls, the compiler doesn't even know how the exception is going to be handled. Since libstdc++ is the one defining \_\_cxa\_throw and friends, and libstdc++ is dynamically linked on runtime, the exception handling method could be chosen when we first run our executable.

We are now seeing some progress but we still have a long way to go. Our ABI can only throw exceptions right now. Can we extend it to handle a catch as well? We'll see how next time.

---

C++ exceptions under the hood 4: catching what you throw
--------------------------------------------------------

In this series about exception handling, we have discovered quite a bit about exception throwing by looking at compiler and linker errors but we have so far not learned anything yet about exception catching. Let's sum up the few things we learned about exception throwing:

* A throw statement will be translated by the compiler into two calls, **\_\_cxa\_allocate\_exception** and **\_\_cxa\_throw**.
* **\_\_cxa\_allocate\_exception** and **\_\_cxa\_throw** "live" on libstdc++
* **\_\_cxa\_allocate\_exception** will allocate memory for the new exception.
* **\_\_cxa\_throw** will prepare a bunch of stuff and forward this exception to **\_Unwind\_**, a set of functions that live in libstdc and perform the real stack unwinding ([the ABI](/blog_md/youfoundadeadlink.md) defines the interface for these functions).

Quite simple so far, but exception catching is a bit more complicated, specially because it requires certain degree of reflexion (that is, the ability of a program to analyze its own source code). Let's keep on trying our same old method, let's add some catch statements throughout our code, compile it and see what happens:

```c++
#include "throw.h"
#include &lt;stdio.h&gt;

// Notice we&#x27;re adding a second exception type
struct Fake_Exception {};

void raise() {
    throw Exception();
}

// We will analyze what happens if a try block doesn&#x27;t catch an exception
void try_but_dont_catch() {
    try {
        raise();
    } catch(Fake_Exception&amp;) {
        printf("Running try_but_dont_catch::catch(Fake_Exception)\n");
    }

    printf("try_but_dont_catch handled an exception and resumed execution");
}

// And also what happens when it does
void catchit() {
    try {
        try_but_dont_catch();
    } catch(Exception&amp;) {
        printf("Running try_but_dont_catch::catch(Exception)\n");
    } catch(Fake_Exception&amp;) {
        printf("Running try_but_dont_catch::catch(Fake_Exception)\n");
    }

    printf("catchit handled an exception and resumed execution");
}

extern "C" {
    void seppuku() {
        catchit();
    }
}
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v02).

Just like before, we have our seppuku function linking the C world with the C++ world, only this time we have added some more function calls to make our stack more interesting, plus we have added a bunch of try/catch blocks so we can analyze how does libstdc++ handles them.

And just like before, we get some linker errors about missing ABI functions:

```c++
&gt; g++ -c -o throw.o -O0 -ggdb throw.cpp
&gt; gcc main.o throw.o mycppabi.o -O0 -ggdb -o app
throw.o: In function `try_but_dont_catch()&#x27;:
throw.cpp:12: undefined reference to `__cxa_begin_catch&#x27;
throw.cpp:12: undefined reference to `__cxa_end_catch&#x27;

throw.o: In function `catchit()&#x27;:
throw.cpp:20: undefined reference to `__cxa_begin_catch&#x27;
throw.cpp:20: undefined reference to `__cxa_end_catch&#x27;

throw.o:(.eh_frame+0x47): undefined reference to `__gxx_personality_v0&#x27;

collect2: ld returned 1 exit status
```

Again we see a lot of interesting stuff going on here. The calls to **\_\_cxa\_begin\_catch** and **\_\_cxa\_end\_catch** are probably something we could have expected: we don't know what they are yet, but we can presume they are the equivalent of the **throw/\_\_cxa\_allocate/throw** conversions (you do remember that our throw keyword got translated to a pair of **\_\_cxa\_allocate\_exception** and **\_\_cxa\_throw functions**, right?). The **\_\_gxx\_personality\_v0** thing is new, though, and the central piece of the next few articles.

What does the personality function do? We already said something about it on the introduction to this series but we will be looking into it with some more detail next time, together with our new two friends, **\_\_cxa\_begin\_catch** and **\_\_cxa\_end\_catch**.

---

C++ exceptions under the hood 5: magic around \_\_cxa\_begin\_catch and \_\_cxa\_end\_catch
-------------------------------------------------------------------------------------------

After learning how exceptions are thrown we are now on our way to learn how they are caught. Last time we added to our example application a bunch of try/catch statements to see what they did, and sure enough we got a bunch of linker errors, just like we did when we were trying to find out what does the throw statement do. This is what the linker says when trying to process throw.o:

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v02).

```c++
&gt; g++ -c -o throw.o -O0 -ggdb throw.cpp
&gt; gcc main.o throw.o mycppabi.o -O0 -ggdb -o app
throw.o: In function `try_but_dont_catch()&#x27;:
throw.cpp:12: undefined reference to `__cxa_begin_catch&#x27;
throw.cpp:12: undefined reference to `__cxa_end_catch&#x27;

throw.o: In function `catchit()&#x27;:
throw.cpp:20: undefined reference to `__cxa_begin_catch&#x27;
throw.cpp:20: undefined reference to `__cxa_end_catch&#x27;

throw.o:(.eh_frame+0x47): undefined reference to `__gxx_personality_v0&#x27;

collect2: ld returned 1 exit status
```

And our theory, of course, is that a catch statement is translated by the compiler into a pair of **\_\_cxa\_begin\_catch/end\_catch** calls into libstdc++, plus something new called **the personality function** of which we know nothing yet.

Let's begin by checking if our theory about **\_\_cxa\_begin\_catch** and **\_\_cxa\_end\_catch holds**. Let's compile throw.cpp with -S and analyze the assembly. There is a lot to see but if I strip it to the bare minimum this is what I get:

```c++
_Z5raisev:
	call	__cxa_allocate_exception
	call	__cxa_throw
```

So far so good: the same old definition we got for raise(), just throw an exception.

```c++
_Z18try_but_dont_catchv:
	.cfi_startproc
	.cfi_personality 0,__gxx_personality_v0
	.cfi_lsda 0,.LLSDA1
```

The definition for try\_but\_dont\_catch(), mangled by the compiler. There is something new, though: a reference to **\_\_gxx\_personality\_v0** and to something else called **LSDA**. These are seemingly innocent declarations but they are actually quite important:

* The linker will use these according to a CFI specification; CFI stands for call frame information, and [here](http://www.logix.cz/michal/devel/gas-cfi/) there is a full spec for it. It will be used, mostly, to unwind the stack.
* **LSDA** on the other hand means language specific data area, and it will be used by the personality function to know which exceptions can be handled by this function

We'll be talking a lot more about CFI and LSDA in the next articles; don't forget about them, but for now let's move on:

```c++
    [...]
	call	_Z5raisev
	jmp	.L8
```

Another easy one: just call "raise", and then jump to L8; L8 will return normally from this function. If raise didn't execute properly then the execution (somehow, we don't know how yet!) shouldn't resume in the next instruction but in the exception handlers (which in ABI-speak are called landing pads. More on that later).

```c++
	cmpl	$1, %edx
	je	.L5

.LEHB1:
	call	_Unwind_Resume
.LEHE1:

.L5:
	call	__cxa_begin_catch
	call	__cxa_end_catch
```

This is quite difficult to follow but it's actually quite straight forward. Here most of the magic will happen: first we check if this is an exception we can handle, if we can't then we say so by calling \_Unwind\_Resume, if it is then we call \_\_cxa\_begin\_catch and \_\_cxa\_end\_catch; after calling these functions the execution should resume normally and thus L8 will be executed (that is, L8 is right below our catch block):

```c++
.L8:
	leave
	.cfi_restore 5
	.cfi_def_cfa 4, 4
	ret
	.cfi_endproc
```

Just a normal return from our function... with some CFI stuff on it.

So this is it for exception catching, although we don't know yet how **\_\_cxa\_begin/end\_catch** work, we have an idea that these pair forms what's called a landing pad, a place in the function to handle the raised exception. What we don't know yet is how the landing pads are found. \_Unwind\_ must somehow go through all the calls in the stack, check if any call (stack frame, to be precise) has a valid try block with a landing pad that can catch the exception, and then resume the execution there.

This is no small feat, and we'll see how that works next time.

---

C++ exceptions under the hood 6: gcc\_except\_table and the personality function
--------------------------------------------------------------------------------

We learned last time that, just as a throw statement is translated into a pair of **\_\_cxa\_allocate\_exception/throw** calls, a catch block is translated into a pair of **\_\_cxa\_begin/end\_catch** calls, plus something called CFI (call frame information) to find the landing pads, the points on a function where an exception can be handled.

What we don't yet know is how does \_Unwind\_\* know where the landing pads are. When an exception is thrown there are a bunch of functions in the stack; all the CFI stuff will let Unwind know which functions these are but it's also necessary to know which landing pads each function provides so we can call each one and check if it wants to handle the exception (and we're ignoring functions with multiple try/catch blocks!).

To know where the landing pads are, something called gcc\_except\_table is used. This can be found (with a bunch of CFI stuff) after the function's end:

```c++
.LFE1:
	.globl	__gxx_personality_v0
	.section	.gcc_except_table,"a",@progbits
    [...]
.LLSDACSE1:
	.long	_ZTI14Fake_Exception
```

The section .gcc\_except\_table is where all information to locate a landing pad is stored, and we'll see more about it once we get to analyzing the personality function; for now, we'll just say that LSDA means language specific data area and it's the place where the personality function will check if there are any landing pads for a function (it is also used to run the destructors when unwinding the stack).

To wrap it up: for every function where at least a catch is found, the compiler will translate this statement into a pair of **\_\_cxa\_begin\_catch/\_\_cxa\_end\_catch** calls and then the personality function, which will be called by **\_\_cxa\_throw**, will read the gcc\_except\_table for every method in the stack, to find something call LSDA. The personality function will then check in the LSDA whether a catch can handle an exception and if there is any cleanup code to run (this is what triggers the destructors when needed).

We can also draw an interesting conclusion here: if we use the nothrow specifier (or the empty throw specifier) then the compiler can omit the gcc\_except\_table for this method. The way gcc implements exceptions, that won't have a great impact on performance but it will indeed reduce code size. What's the catch? If an exception is thrown when nothrow was specified the LSDA won't be there and the personality function won't know what to do. When the personality function doesn't know what to do it will invoke the default exception handler, meaning that in most cases throwing from a nothrow method will end up calling std::terminate.

Now that we have an idea of what the personality function does, can we implement one? We'll see how next time.

---

C++ exceptions under the hood 7: a nice personality
---------------------------------------------------

On our journey to learn about exceptions we have learned so far how a throw is done, that something called "call frame information" helps a library called Unwind to do the stack unwinding, and that the compiler writes something called LSDA, language specific data area, to know which exceptions can a method handle. And we know by now that a lot of magic is done on the personality function; we've never seen it in action though. Let's recap in a bit more of detail about how an exception will be thrown and caught (or, more precisely, how we know so far it will be thrown caught):

* The compiler will translate our throw statement into a pair of **\_\_cxa\_allocate\_exception/\_\_cxa\_throw**
* **\_\_cxa\_allocate\_exception** will create the exception in memory
* **\_\_cxa\_throw** will initialize a bunch of stuff and forward this exception to a lower-level unwind library by calling **\_Unwind\_RaiseException**
* Unwind will use CFI to know which functions are on the stack (ie to know how to start the stack unwinding)
* Each function will have an LSDA (language specific data area) part, added into something called **".gcc\_except\_table"**
* Unwind will invoke the personality function with the current stack frame and the LSDA; this function should reply to unwind whether this stack can handle the exception or not

Knowing this, it's about time we implement our own personality function. Our ABI used to print this when an exception was thrown:

```c++
alloc ex 1
__cxa_throw called
no one handled __cxa_throw, terminate!
```

Let's go back to our mycppabi and let's add something like this (link to full mycppabi.cpp file):

```c++
void __gxx_personality_v0()
{
    printf("Personality function FTW\n");
}
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v02).

And sure enough, when we run it we should see our personality function being called. We know we're on the right track and now we have an idea of what we want for our personality function; let's start using the proper definition for this function:

```c++
_Unwind_Reason_Code __gxx_personality_v0 (
                     int version, _Unwind_Action actions, uint64_t exceptionClass,
                     _Unwind_Exception* unwind_exception, _Unwind_Context* context);
```

If we put that into our mycppabi.cpp file we get:

```c++
#include &lt;unistd.h&gt;
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;stdint.h&gt;

namespace __cxxabiv1 {
    struct __class_type_info {
        virtual void foo() {}
    } ti;
}

#define EXCEPTION_BUFF_SIZE 255
char exception_buff[EXCEPTION_BUFF_SIZE];

extern "C" {

void* __cxa_allocate_exception(size_t thrown_size)
{
    printf("alloc ex %i\n", thrown_size);
    if (thrown_size &gt; EXCEPTION_BUFF_SIZE) printf("Exception too big");
    return &amp;exception_buff;
}

void __cxa_free_exception(void *thrown_exception);

#include &lt;unwind.h&gt;

typedef void (*unexpected_handler)(void);
typedef void (*terminate_handler)(void);

struct __cxa_exception {
	std::type_info *	exceptionType;
	void (*exceptionDestructor) (void *);
	unexpected_handler	unexpectedHandler;
	terminate_handler	terminateHandler;
	__cxa_exception *	nextException;

	int			handlerCount;
	int			handlerSwitchValue;
	const char *		actionRecord;
	const char *		languageSpecificData;
	void *			catchTemp;
	void *			adjustedPtr;

	_Unwind_Exception	unwindHeader;
};

void __cxa_throw(void* thrown_exception, struct type_info *tinfo, void (*dest)(void*))
{
    printf("__cxa_throw called\n");

    __cxa_exception *header = ((__cxa_exception *) thrown_exception - 1);
    _Unwind_RaiseException(&amp;header-&gt;unwindHeader);

    // __cxa_throw never returns
    printf("no one handled __cxa_throw, terminate!\n");
    exit(0);
}

void __cxa_begin_catch()
{
    printf("begin FTW\n");
}

void __cxa_end_catch()
{
    printf("end FTW\n");
}

_Unwind_Reason_Code __gxx_personality_v0 (
                     int version, _Unwind_Action actions, uint64_t exceptionClass,
                     _Unwind_Exception* unwind_exception, _Unwind_Context* context)
{
    printf("Personality function FTW!\n");
}

}
```

Code @ [my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v02).

Let's compile and link everything, then run it and start by analyzing each param to this function with some help of gdb:

```c++
Breakpoint 1, __gxx_personality_v0 (version=1, actions=1, exceptionClass=134514792, unwind_exception=0x804a060, context=0xbffff0f0)
```

* The version and the exceptionClass are related to language/ABI/compiler toolchain/native or non-native exception, etc. We don't need to worry about it for our mini ABI, we'll just handle all the exceptions.
* Actions: this is what \_Unwind\_ uses to tell the personality function what it should do (more on that later)
* unwind\_exception: the exception allocated by \_\_cxa\_allocate\_exception (kind of... there's a lot of pointer arithmetic going on but that pointer can be used to access our original exception anyway)
* context: this holds all the information regarding the current stack frame, for example the language specific data area (LSDA). This is what we will be using to detect whether this stack can handle the thrown exception (and also to detect whether we need to run any destructors)

So there we have it, a working (well, linkeable) personality function. Doesn't do much, though, so next time we'll start adding some real behavior and try to make it handle an exception.

---

C++ exceptions under the hood 8: two-phase handling
---------------------------------------------------

We finished last chapter on the series about C++ exceptions by adding a personality function that \_Unwind\_ was able to call. It didn't do much but there it was. The ABI we have been implementing can now throw exceptions and the catch is already halfway implemented, but the personality function needed to properly choose the catch block (landing pad) is bit dumb so far. Let's start this new chapter by trying to understand what are the parameters that the personality function receives and next time we'll begin adding some real behavior to \_\_gxx\_personality\_v0: when \_\_gxx\_personality\_v0 is called we should say "yes, this stack frame can indeed handle this exception".

We already said we won't care for the version or the exceptionClass for our mini ABI. Let's ignore the context too, for now: we'll just handle every exception with the first stack frame above the function throwing; note this implies there must be a try/catch block on the function immediately above the throwing function, otherwise everything will break. This also implies the catch will ignore its exception specification, effectively turning it into a catch(...). How do we let \_Unwind\_ know we want to handle the current exception?

\_Unwind\_Reason\_Code is the return value from the personality functions; this tells \_Unwind\_ whether we found a landing pad to handle the exception or not. Let's implement our personality function to return \_URC\_HANDLER\_FOUND then, and see what happens:

```c++
alloc ex 1
__cxa_throw called
Personality function FTW
Personality function FTW
no one handled __cxa_throw, terminate!
```

See that? We told \_Unwind\_ we found a handler, and it called the personality function yet again! What is going on there?

Remember the action parameter? That's how \_Unwind\_ tells us what he is expecting, and that is because the exception catching is handled in two phases: lookup and cleanup (or \_UA\_SEARCH\_PHASE and \_UA\_CLEANUP\_PHASE). Let's go again over our exception throwing and catching recipe:

* \_\_cxa\_throw/\_\_cxa\_allocate\_exception will create an exception and forward it to a lower-level unwind library by calling \_Unwind\_RaiseException
* Unwind will use CFI to know which functions are on the stack (ie to know how to start the stack unwinding)
* Each function has have an LSDA (language specific data area) part, added into something called ".gcc\_except\_table"
* Unwind will try to locate a landing pad for the exception:
	+ Unwind will call the personality function with the action \_UA\_SEARCH\_PHASE and a context pointing to the current stack frame.
	+ The personality function will check if the current stack frame can handle the exception being thrown by analyzing the LSDA.
	+ If the exception can be handled it will return \_URC\_HANDLER\_FOUND.
	+ If the exception can not be handled it will return \_URC\_CONTINUE\_UNWIND and Unwind will then try the next stack frame.
* If no landing pad was found, the default exception handler will be called (normally std::terminate).
* If a landing pad was found:
	+ Unwind will iterate the stack again, calling the personality function with the action \_UA\_CLEANUP\_PHASE.
	+ The personality function will check if it can handle the current exception again:
	+ If this frame can't handle the exception it will then run a cleanup function described by the LSDA and tell Unwind to continue with the next frame (this is actually a very important step: the cleanup function will run the destructor of all the objects allocated in this stack frame!)
	+ If this frame can handle the exception, don't run any cleanup code: tell Unwind we want to resume execution on this landing pad.

There are two important bits of information to note here:
1. Running a two-phase exception handling procedure means that in case no handler was found then the default exception handler can get the original exception's stack trace (if we were to unwind the stack as we go it would get no stack trace, or we would need to keep a copy of it somehow!).
2. Running a \_UA\_CLEANUP\_PHASE and calling a second time each frame, even though we already know the frame that will handle the exception, is also really important: the personality function will take this chance to run all the destructors for objects built on this scope. It is what makes RAII an exception safe idiom!

Now that we understand how the catch lookup phase works we can continue our personality function implementation. The next time.

---

C++ exceptions under the hood 9: catching our first exception
-------------------------------------------------------------

We finished last chapter on the series about C++ exceptions by adding a personality function that \_Unwind\_ was able to call and then analyzing the parameters that the personality function receives. Now it's time to begin adding some real behavior to \_\_gxx\_personality\_v0: when \_\_gxx\_personality\_v0 is called we should say "yes, this stack frame can indeed handle this exception".

We have been building up to this point quite a bit: the time where we can implement for the first time a personality function capable of detecting when an exception is thrown, and then saying "yes, I will handle this exception". For that we had to learn how the two-phase lookup work, so we can now reimplement our personality function and our throw test file:

```c++
#include &lt;stdio.h&gt;
#include "throw.h"

struct Fake_Exception {};

void raise() {
    throw Exception();
}

void try_but_dont_catch() {
    try {
        raise();
    } catch(Fake_Exception&amp;) {
        printf("Caught a Fake_Exception!\n");
    }

    printf("try_but_dont_catch handled the exception\n");
}

void catchit() {
    try {
        try_but_dont_catch();
    } catch(Exception&amp;) {
        printf("Caught an Exception!\n");
    }

    printf("catchit handled the exception\n");
}

extern "C" {
    void seppuku() {
        catchit();
    }
}
```

And our personality function:

```c++
_Unwind_Reason_Code __gxx_personality_v0 (
                     int version, _Unwind_Action actions, uint64_t exceptionClass,
                     _Unwind_Exception* unwind_exception, _Unwind_Context* context)
{
    if (actions &amp; _UA_SEARCH_PHASE)
    {
        printf("Personality function, lookup phase\n");
        return _URC_HANDLER_FOUND;
    } else if (actions &amp; _UA_CLEANUP_PHASE) {
        printf("Personality function, cleanup\n");
        return _URC_INSTALL_CONTEXT;
    } else {
        printf("Personality function, error\n");
        return _URC_FATAL_PHASE1_ERROR;
    }
}
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v03).

Let's run it, see what happens:

```c++
alloc ex 1
__cxa_throw called
Personality function, lookup phase
Personality function, cleanup
try_but_dont_catch handled the exception
catchit handled the exception
```

It works, but something is missing: the catch inside the catch/try block is not being executed! This is happening because the personality function tells Unwind to "install a context" (ie to resume execution) but it never says which context. In this case it's probably resuming executing from after the landing pad, but I'd bet this is actually undefined behavior. We'll see next time how we can specify we want to resume executing from a specific landing pad using the information available on .gcc\_except\_table (our old friend, the LSDA).

---

C++ exceptions under the hood 10: \_Unwind\_ and call frame info
----------------------------------------------------------------

We left our mini-ABI project ([link](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v03)) capable of throwing exceptions, and we are now working on catching them; we implemented a personality function last time which was capable of detecting and handling exceptions but it was still a bit incomplete: even though it can properly notify the stack unwinder when it should stop but our version of \_\_gxx\_personality\_v0 can't run the code inside a catch block. It's better than a coredump one might argue, but still a long way from a useful exception handling ABI. Can we improve it?

How can we tell \_Unwind\_ where is our landing pad, so we can execute the code inside the catch statement? If we go back to the [ABI specification](/blog_md/youfoundadeadlink.md#base-om), there are a few context management functions which might help us:

* \_Unwind\_GetLanguageSpecificData, to get the LSDA for this stack frame. We should be able to find the landing pads and the destructors to run using it.
* \_Unwind\_GetRegionStart, to get the instruction pointer for the beginning of the function for stack frame currently under analysis by the personality function (that is, the function pointer for the current stack frame).
* \_Unwind\_GetIP, to get the instruction pointer inside the current stack frame (a pointer to the place where the function call to the next stack frame was done. It should be clearer with the example below).

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v04).

Let's check these functions with gdb. On my machine:

```c++
Breakpoint 1, __gxx_personality_v0 (version=1, actions=6, exceptionClass=134515400, unwind_exception=0x804a060, context=0xbffff0f0)
    at mycppabi.cpp:77

84	        const uint8_t* lsda = (const uint8_t*)_Unwind_GetLanguageSpecificData(context);
85	        uintptr_t ip = _Unwind_GetIP(context) - 1;
86	        uintptr_t funcStart = _Unwind_GetRegionStart(context);
87	        uintptr_t ipOffset = ip - funcStart;
```

If we inspect those variables we can see that indeed \_Unwind\_GetRegionStart points to the current stack frame (try\_but\_dont\_catch) and that \_Unwind\_GetIP is the IP for the position where the call to the next stack frame was done. The \_Unwind\_GetRegionStart is pointing us to the place where the exception was first thrown; it's a bit complicated to explain and we'll use that later, not now. Also, we don't see the LSDA here, but we can deduce it's after the function's code since \_Unwind\_GetLanguageSpecificData points directly after the function's end:

```c++
_Unwind_GetIP = (void *) 0x804861d
_Unwind_GetRegionStart = (void *) 0x8048612
_Unwind_GetLanguageSpecificData = (void *) 0x8048e3c
function pointer to try_but_dont_catch = 0x8048612 &lt;try_but_dont_catch()&gt;

(gdb) disassemble /m try_but_dont_catch
Dump of assembler code for function try_but_dont_catch():
10	void try_but_dont_catch() {
        [...]
11	    try {
12	        raise();
   0x08048619 &lt;+7&gt;:	call   0x80485e8 &lt;raise()&gt;

13	    } catch(Fake_Exception&amp;) {
   0x08048651 &lt;+63&gt;:	call   0x804874a &lt;__cxa_begin_catch()&gt;
   0x08048665 &lt;+83&gt;:	call   0x804875e &lt;__cxa_end_catch()&gt;
   0x0804866a &lt;+88&gt;:	jmp    0x804861e &lt;try_but_dont_catch()+12&gt;

14	        printf("Caught a Fake_Exception!\n");
   0x08048659 &lt;+71&gt;:	movl   $0x8048971,(%esp)
   0x08048660 &lt;+78&gt;:	call   0x80484c0 &lt;puts@plt&gt;

15	    }
16
17	    printf("try_but_dont_catch handled the exception\n");
   0x0804861e &lt;+12&gt;:	movl   $0x8048948,(%esp)
   0x08048625 &lt;+19&gt;:	call   0x80484c0 &lt;puts@plt&gt;

18	}
   0x0804862a &lt;+24&gt;:	add    $0x24,%esp
```

With the help of \_Unwind\_ we are now able to get enough information about the current stack frame to decide whether we can or not handle an exception, an also how should we handle it. One more step is needed before we can detect the landing pad we want: we will need to interpret the CFI (call frame information) at the end of the function. This is part of the DWARF spec, the same gdb uses for debugging purposes, and it's not an easy spec to implement. Like we are doing with our ABI, we'll keep this to the bare minimum.

---

C++ exceptions under the hood 11: reading a CFI table
-----------------------------------------------------

To properly handle exceptions from within the personality function we've been implementing for our ABI, we need to read the LSDA (language specific data area) to know which call frame (ie which function) can handle which exception, and to know where a landing pad (catch block) can be found). The LSDA table is in CFI format, and we'll see in this chapter how to read it.

Reading the CFI data can be rather straight forward, but there are a few pitfalls we need to consider first. Two, actually:
1. There is very little documentation about the .gcc\_except\_table format (actually, I only found some mails about it) so we'll need to read a lot of source code and disassembles to understand it.
2. Although the format itself is not terribly complicated, it uses a LEB encoding that makes reading this table not quite straightforward.

As far as I know most DWARF data is encoded like this, using a [LEB format](http://en.wikipedia.org/wiki/LEB128), which seems to be great for confusing programmers and to save code space while encoding arbitrary length ints. Luckily, we can cheat a bit in here: most of the time the LEB encoded numbers will readble with a plain uint8\_t, because we won't be dealing with large exception tables or anything like that.

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v04).

Let's start by analyzing the CFI data directly from the disassembly, we'll then see if we can build something to read it on our personality function. I'll rename the labels to make them a bit more human-friendly. The LSDA will have three sections, try to spot them below:

```c++
.local_frame_entry:
	.globl	__gxx_personality_v0
	.section	.gcc_except_table,"a",@progbits
	.align 4
```

This one is very easy: it's just a header to declare we're going to use \_\_gxx\_personality\_v0 as a global and to let the linker know we're going to be declaring stuff for the .gcc\_except\_table section. Moving on:

```c++
.local_lsda_1:
    # This declares the encoding type. We don&#x27;t care.
	.byte	0xff

    # This specifies the landing pads start; if zero, the func&#x27;s ptr is
    # assumed (_Unwind_GetRegionStart)
	.byte	0

    # Length of the LSDA area: check that LLSDATT1 and LLSDATTD1 point to the
    # end and the beginning of the LSDA, respectively
	.uleb128 .local_lsda_end - .local_lsda_call_site_table_header
```

This now has some more info. Those labels are quite obscure but they do follow a pattern. LSDA means language specific data area, the L in front means local, so this is the local (to the translation unit, the .o file) language specific data area number one. Other labels follow similar patterns but I haven't taken the job of figuring them out. We don't really need to, anyway.

```c++
.local_lsda_call_site_table_header:
    # Encoding of items in the landing pad table. Again, we don&#x27;t care.
	.byte	0x1.

    # The length of the call site table (ie the landing pads)
	.uleb128 .local_lsda_call_site_table_end - .local_lsda_call_site_table

```

Another boring header. Moving on:

```c++
.local_lsda_call_site_table:
	.uleb128 .LEHB0-.LFB1
	.uleb128 .LEHE0-.LEHB0
	.uleb128 .L8-.LFB1
	.uleb128 0x1

	.uleb128 .LEHB1-.LFB1
	.uleb128 .LEHE1-.LEHB1
	.uleb128 0
	.uleb128 0

    .uleb128 .LEHB2-.LFB1
	.uleb128 .LEHE2-.LEHB2
	.uleb128 .L9-.LFB1
	.uleb128 0
.local_lsda_call_site_table_end:
```

This is much more interesting, now we're seeing the call site table itself. Somehow, in all these entries, we should be able to find our landing pad. According to some random internet page, the format for each call site entry should be:

```c++
struct lsda_call_site_entry {
    // Start of the IP range
    size_t cs_start;

    // Length of the IP range
    size_t cs_len;

    // Landing pad address
    size_t cs_lp;

    // Offset into action table
    size_t cs_action;
};
```

So we seem to be on the right track, though we don't know yet why there are 3 call site entries when we only defined a single landing pad. In any case, we can cheat a little: by looking at the disassembly we can deduce that all the values on the CFI will be less than 128 and this means that in LEB encoding they can be read as plain uchars. This makes our CFI reading code so much easier, and we will see how to use it in our personality function next time.

---

C++ exceptions under the hood 12: and suddenly, reflexion in C++
----------------------------------------------------------------

We left our mini-ABI project ([link](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v03)) capable of throwing exceptions, and we are now working on catching them; we implemented a personality function last time which was capable of detecting and handling exceptions but it was still a bit incomplete: even though it can properly notify the stack unwinder when it should stop but our version of \_\_gxx\_personality\_v0 can't run the code inside a catch block. We learned last time how to read the LSDA, so now it's only a problem of putting all the pieces together to read the .gcc\_except\_table from within our personality function.

Let's recap a bit: we figured out last time that our LSDA for the function which has the catch we want to run has the following call site table (that is, the following landing pads [that is, the following catch blocks]):

```c++
.local_lsda_call_site_table:
	.uleb128 .LEHB0-.LFB1
	.uleb128 .LEHE0-.LEHB0
	.uleb128 .L8-.LFB1
	.uleb128 0x1

	.uleb128 .LEHB1-.LFB1
	.uleb128 .LEHE1-.LEHB1
	.uleb128 0
	.uleb128 0

    .uleb128 .LEHB2-.LFB1
	.uleb128 .LEHE2-.LEHB2
	.uleb128 .L9-.LFB1
	.uleb128 0
.local_lsda_call_site_table_end:
```

All those labels can be mapped to different places in the assembly of our function, but it's a bit too messy for a blog post (I do recommend you to disassemble the function yourself and try to match each label, a lot can be learned from doing it). Also, thanks to some random Internet page, we learned the format for this table.

Let's do something like this to see if we're on the right track (beware of read-alignment issues and keep in mind that defining CFI structures like this will only work for uint8's and is probably not portable):

```c++
struct LSDA_Header {
    uint8_t lsda_start_encoding;
    uint8_t lsda_type_encoding;
    uint8_t lsda_call_site_table_length;
};

struct LSDA_Call_Site_Header {
    uint8_t encoding;
    uint8_t length;
};

struct LSDA_Call_Site {
    LSDA_Call_Site(const uint8_t *ptr) {
        cs_start = ptr[0];
        cs_len = ptr[1];
        cs_lp = ptr[2];
        cs_action = ptr[3];
    }

    uint8_t cs_start;
    uint8_t cs_len;
    uint8_t cs_lp;
    uint8_t cs_action;
};

_Unwind_Reason_Code __gxx_personality_v0 (
                     int version, _Unwind_Action actions, uint64_t exceptionClass,
                     _Unwind_Exception* unwind_exception, _Unwind_Context* context)
{
    if (actions &amp; _UA_SEARCH_PHASE)
    {
        printf("Personality function, lookup phase\n");
        return _URC_HANDLER_FOUND;
    } else if (actions &amp; _UA_CLEANUP_PHASE) {
        printf("Personality function, cleanup\n");

        const uint8_t* lsda = (const uint8_t*)
                                    _Unwind_GetLanguageSpecificData(context);

        LSDA_Header *header = (LSDA_Header*)(lsda);
        LSDA_Call_Site_Header *cs_header = (LSDA_Call_Site_Header*)
                                                (lsda + sizeof(LSDA_Header));

        size_t cs_in_table = cs_header-&gt;length / sizeof(LSDA_Call_Site);

        // We must declare cs_table_base as uint8, otherwise we risk an
        // unaligned access
        const uint8_t *cs_table_base = lsda + sizeof(LSDA_Header)
                                            + sizeof(LSDA_Call_Site_Header);

        // Go through every entry on the call site table
        for (size_t i=0; i &lt; cs_in_table; ++i)
        {
            const uint8_t *offset = &amp;cs_table_base[i * sizeof(LSDA_Call_Site)];
            LSDA_Call_Site cs(offset);
            printf("Found a CS:\n");
            printf("\tcs_start: %i\n", cs.cs_start);
            printf("\tcs_len: %i\n", cs.cs_len);
            printf("\tcs_lp: %i\n", cs.cs_lp);
            printf("\tcs_action: %i\n", cs.cs_action);
        }

        uintptr_t ip = _Unwind_GetIP(context);
        uintptr_t funcStart = _Unwind_GetRegionStart(context);
        uintptr_t ipOffset = ip - funcStart;

        return _URC_INSTALL_CONTEXT;
    } else {
        printf("Personality function, error\n");
        return _URC_FATAL_PHASE1_ERROR;
    }
}
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v05).

As you can see if you run this code, all entries in the call site table are relative. Relative to what? To the start of function. That means that if we want to get the EIP for a specific landing pad all we have to do is \_Unwind\_GetRegionStart + LSDA\_Call\_Site.cs\_lp!

We should now be able to solve our exceptional problem: let's try to modify our personality function to run the correct landing pad. We'll now need to use another \_Unwind\_ function to specify where we want to resume execution: \_Unwind\_SetIP. Let's change the personality function again to run the first landing pad available, which by inspecting the assembly we already know is the one we want:

```c++
        ...
        const uint8_t *cs_table_base = lsda + sizeof(LSDA_Header)
                                            + sizeof(LSDA_Call_Site_Header);
        for (size_t i=0; i &lt; cs_in_table; ++i)
        {
            const uint8_t *offset = &amp;cs_table_base[i * sizeof(LSDA_Call_Site)];
            LSDA_Call_Site cs(offset);

            if (cs.cs_lp)
            {
                uintptr_t func_start = _Unwind_GetRegionStart(context);
                _Unwind_SetIP(context, func_start + cs.cs_lp);
                break;
            }
        }

        return _URC_INSTALL_CONTEXT;
```

Try to run it, and watch a beautiful infinite loop. Can you guess what went wrong? The answer on the next article.

---

C++ exceptions under the hood 13: setting the context for a landing pad
-----------------------------------------------------------------------

Last time we finally wrote an almost working personality function. We can detect for each stack frame which landing pads are available and then tell \_Unwind\_ we want to run a specific landing pad. We hit a small issue, though: although we set the context for \_Unwind\_ to continue executing on the correct landing pad we didn't set the current exception on the register. This, in turn, means that the landing pad won't know which exception should be handling, so it will say "I can't handle this". \_Unwind\_ will then say "please try the next landing pad" but our ABI is so simple that it has no idea how it should find another landing pad and just tries the same. Over and over again. We have probably invented the most contrived example for a while(true)!

Let's set the correct context for the landing pad and clean up a bit our ABI:

```c++
#include &lt;unistd.h&gt;
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;stdint.h&gt;

namespace __cxxabiv1 {
    struct __class_type_info {
        virtual void foo() {}
    } ti;
}

#define EXCEPTION_BUFF_SIZE 255
char exception_buff[EXCEPTION_BUFF_SIZE];

extern "C" {

void* __cxa_allocate_exception(size_t thrown_size)
{
    printf("alloc ex %i\n", thrown_size);
    if (thrown_size &gt; EXCEPTION_BUFF_SIZE) printf("Exception too big");
    return &amp;exception_buff;
}

void __cxa_free_exception(void *thrown_exception);

#include &lt;unwind.h&gt;

typedef void (*unexpected_handler)(void);
typedef void (*terminate_handler)(void);

struct __cxa_exception {
	std::type_info *	exceptionType;
	void (*exceptionDestructor) (void *);
	unexpected_handler	unexpectedHandler;
	terminate_handler	terminateHandler;
	__cxa_exception *	nextException;

	int			handlerCount;
	int			handlerSwitchValue;
	const char *		actionRecord;
	const char *		languageSpecificData;
	void *			catchTemp;
	void *			adjustedPtr;

	_Unwind_Exception	unwindHeader;
};

void __cxa_throw(void* thrown_exception,
                 struct type_info *tinfo,
                 void (*dest)(void*))
{
    printf("__cxa_throw called\n");

    __cxa_exception *header = ((__cxa_exception *) thrown_exception - 1);
    _Unwind_RaiseException(&amp;header-&gt;unwindHeader);

    // __cxa_throw never returns
    printf("no one handled __cxa_throw, terminate!\n");
    exit(0);
}

void __cxa_begin_catch()
{
    printf("begin FTW\n");
}

void __cxa_end_catch()
{
    printf("end FTW\n");
}

/***********************************************************************/

/**
 * The LSDA is a read only place in memory; we&#x27;ll create a typedef for
 * this to avoid a const mess later on; LSDA_ptr refers to readonly and
 * &amp;LSDA_ptr will be a non-const pointer to a const place in memory
 */
typedef const uint8_t* LSDA_ptr;

struct LSDA_Header {
    /**
     * Read the LSDA table into a struct; advances the lsda pointer
     * as many bytes as read
     */
    LSDA_Header(LSDA_ptr *lsda) {
        LSDA_ptr read_ptr = *lsda;

        // Copy the LSDA fields
        start_encoding = read_ptr[0];
        type_encoding = read_ptr[1];
        ttype = read_ptr[2];

        // Advance the lsda pointer
        *lsda = read_ptr + sizeof(LSDA_Header);
    }

    uint8_t start_encoding;
    uint8_t type_encoding;
    uint8_t ttype;
};

struct LSDA_CS_Header {
    // Same as other LSDA constructors
    LSDA_CS_Header(LSDA_ptr *lsda) {
        LSDA_ptr read_ptr = *lsda;
        encoding = read_ptr[0];
        length = read_ptr[1];
        *lsda = read_ptr + sizeof(LSDA_CS_Header);
    }

    uint8_t encoding;
    uint8_t length;
};

struct LSDA_CS {
    // Same as other LSDA constructors
    LSDA_CS(LSDA_ptr *lsda) {
        LSDA_ptr read_ptr = *lsda;
        start = read_ptr[0];
        len = read_ptr[1];
        lp = read_ptr[2];
        action = read_ptr[3];
        *lsda = read_ptr + sizeof(LSDA_CS);
    }

    // Note start, len and lp would be void*&#x27;s, but they are actually relative
    // addresses: start and lp are relative to the start of the function, len
    // is relative to start

    // Offset into function from which we could handle a throw
    uint8_t start;
    // Length of the block that might throw
    uint8_t len;
    // Landing pad
    uint8_t lp;
    // Offset into action table + 1 (0 means no action)
    // Used to run destructors
    uint8_t action;
};

/*********************************************************************/

_Unwind_Reason_Code __gxx_personality_v0 (
                             int version,
                             _Unwind_Action actions,
                             uint64_t exceptionClass,
                             _Unwind_Exception* unwind_exception,
                             _Unwind_Context* context)
{
    if (actions &amp; _UA_SEARCH_PHASE)
    {
        printf("Personality function, lookup phase\n");
        return _URC_HANDLER_FOUND;
    } else if (actions &amp; _UA_CLEANUP_PHASE) {
        printf("Personality function, cleanup\n");

        // Pointer to the beginning of the raw LSDA
        LSDA_ptr lsda = (uint8_t*)_Unwind_GetLanguageSpecificData(context);

        // Read LSDA headerfor the LSDA
        LSDA_Header header(&amp;lsda);

        // Read the LSDA CS header
        LSDA_CS_Header cs_header(&amp;lsda);

        // Calculate where the end of the LSDA CS table is
        const LSDA_ptr lsda_cs_table_end = lsda + cs_header.length;

        // Loop through each entry in the CS table
        while (lsda &lt; lsda_cs_table_end)
        {
            LSDA_CS cs(&amp;lsda);

            if (cs.lp)
            {
                int r0 = __builtin_eh_return_data_regno(0);
                int r1 = __builtin_eh_return_data_regno(1);

                _Unwind_SetGR(context, r0, (uintptr_t)(unwind_exception));
                // Note the following code hardcodes the exception type;
                // we&#x27;ll fix that later on
                _Unwind_SetGR(context, r1, (uintptr_t)(1));

                uintptr_t func_start = _Unwind_GetRegionStart(context);
                _Unwind_SetIP(context, func_start + cs.lp);
                break;
            }
        }

        return _URC_INSTALL_CONTEXT;
    } else {
        printf("Personality function, error\n");
        return _URC_FATAL_PHASE1_ERROR;
    }
}

}
```

Note: For a more detailed description of the LSDA tables check [here](/blog_md/youfoundadeadlink.mdexceptions.pdf) and for the full source code [check my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v06).

Finally, it worked. You should see something like this if you run it:

```c++
./app
alloc ex 1
__cxa_throw called
Personality function, lookup phase
Personality function, cleanup
begin FTW
Caught a Fake_Exception!
end FTW
try_but_dont_catch handled the exception
catchit handled the exception
```

Of course we are lying a bit to \_Unwind\_: we are saying here that we will handle every exception, no mater what. This turns our catch(Exception&) into a catch(...), and all hell will break loose if the first function up in the call frame doesn't have a catch statement. But still, we reached the first milestone for a very simple ABI.

Can we now improve it and make it handle the correct exception on the correct frame? May be next time.

---

C++ exceptions under the hood 14: multiple landing pads & the teachings of the guru
-----------------------------------------------------------------------------------

After a lot of hard work, last time we finally got a working personality function capable of handling exceptions without help of libstdc++. It will indiscriminately handle all exceptions, but it does work. There is a big question we haven't answered yet: if we go back to the LSDA (language specific data area) we'll see something like this:

```c++
.local_lsda_call_site_table:
	.uleb128 .LEHB0-.LFB1
	.uleb128 .LEHE0-.LEHB0
	.uleb128 .L8-.LFB1
	.uleb128 0x1

	.uleb128 .LEHB1-.LFB1
	.uleb128 .LEHE1-.LEHB1
	.uleb128 0
	.uleb128 0

  .uleb128 .LEHB2-.LFB1
	.uleb128 .LEHE2-.LEHB2
	.uleb128 .L9-.LFB1
	.uleb128 0
.local_lsda_call_site_table_end:
```

There are 3 landing pads defined there, even though we wrote a single try/catch statement. What is going on there?

If you read carefully the last entry on this topic maybe you noticed I added some comments to the definition of struct LSDA\_CS:

```c++
struct LSDA_CS {
    // Note start, len and lp would be void*&#x27;s, but they are actually relative
    // addresses: start and lp are relative to the start of the function, len
    // is relative to start

    // Offset into function from which we could handle a throw
    uint8_t start;
    // Length of the block that might throw
    uint8_t len;
    // Landing pad
    uint8_t lp;
    // Offset into action table + 1 (0 means no action)
    // Used to run destructors
    uint8_t action;
};
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v06).

Something very interesting is going on here, but lets first analyze this struct field by field with the following example:

```c++
void foo() {
    L0:
        try {
            do_something();
    L1:
        } catch (const Exception1&amp; ex) {
            ...
        } catch (const Exception2&amp; ex) {
            ...
        } catch (const ExceptionN&amp; ex) {
            ...
        } catch (...) {
        }
    L2:
}
```

* lp: the offset from the start of the function where the landing pad starts. The value of lp for the following example would be L1 - addr\_of(foo)
* action: an offset into an action table. This is used to run the cleanup actions while unwinding the stack. We haven't reached this point yet, we can ignore it for now.
* start: the offset from the start of the function where the try block begins: in the example this would be L0 - addr\_of(foo)
* len: the length of the try block. On the example this would be L1 - L0

The interesting fields now are start and len: in a function with multiple try/catch blocks we can know whether we should handle an exception by checking if the instruction pointer for the current frame is between start and start + len.

That solves the mystery of how a function with multiple try/catch blocks can handle an exception but we still have another question: why are there three call sites when we only specified a single landing pad? The other three are places where an exception might be thrown so they get added as a possible place for cleanup actions or landing pads. If we learned anything from GOTW it should be that exceptions can be thrown in the places we least expect. There is an entry in the call site table for our throw because it's a block that might throw; the compiler also detected another three.

Now that we know what the start and len fields do, let's change our personality function so the correct landing pad can handle the exception being thrown. Go ahead. My implementation for the next time.

---

C++ exceptions under the hood 15: finding the right landing pad
---------------------------------------------------------------

This is now the 15th installment in what's becoming the longest series I've written for this blog; we have so far learned how exceptions are thrown and we have written a personality function capable of, with some sort of reflexion, detecting where the catch-blocks are (landing pads, in exception speak). In the last article we wrote a personality function that can handle exceptions, but it does so only with the first landing pad of the first call frame in the stack. Let's improve that a little bit, let's make our personality function capable of choosing the right landing pad in a function with multiple landing pads.

In a TDD fashion we can first build a test for our ABI. Let's modify our test program, throw.cpp, to have two try/catch blocks:

```c++
#include &lt;stdio.h&gt;
#include "throw.h"

struct Fake_Exception {};

void raise() {
    throw Exception();
}

void try_but_dont_catch() {
    try {
        printf("Running a try which will never throw.\n");
    } catch(Fake_Exception&amp;) {
        printf("Exception caught... with the wrong catch!\n");
    }

    try {
        raise();
    } catch(Fake_Exception&amp;) {
        printf("Caught a Fake_Exception!\n");
    }

    printf("try_but_dont_catch handled the exception\n");
}

void catchit() {
    try {
        try_but_dont_catch();
    } catch(Fake_Exception&amp;) {
        printf("Caught a Fake_Exception!\n");
    } catch(Exception&amp;) {
        printf("Caught an Exception!\n");
    }

    printf("catchit handled the exception\n");
}

extern "C" {
    void seppuku() {
        catchit();
    }
}
```

Before you test it, try to think about what will happen upon running this test. Focus on the try\_but\_dont\_catch function: the first try/catch block will not throw, then the second block will throw. Since our ABI is quite dumb the first block will handle the second block's exception. What will happen after the first block has finished handling the exception? The execution will resume from where the catch/try ends, thus entering again on the second try/catch block. Infinite loop! We have reinvented yet again a very complicated while(true).

Let's use our knowledge of the start/length fields in the call site table (LSDA) to properly choose our landing pad. For this we will need to know what the instruction pointer was when the exception was thrown, and we can do this with an \_Unwind\_ function we already know: \_Unwind\_GetIP. To understand what \_Unwind\_GetIP will return let's see an example:

```c++
void f1() {}
void f2() { throw 1; }
void f3() {}

void foo() {
L1:
    try{ f1(); } catch(...) {}
L2:
    try{ f2(); } catch(...) {}
L3:
    try{ f3(); } catch(...) {}
}
```

In this case our personality function would be called for the catch block for f2 and the stack would be like this:

```
+------------------------------+
|   IP: f2  stack frame: f2    |
+------------------------------+
|   IP: L3  stack frame: foo   |
+------------------------------+
```

Note that IP will be at L3 but the exception will be thrown in L2; this is because the IP will point to the next instruction to execute. This also means we need to substract one if we need to find the IP where an exception was thrown, otherwise the result from \_Unwind\_GetIP would not be in the range of our landing pad. Back to our personality function:

```c++
_Unwind_Reason_Code __gxx_personality_v0 (
                             int version,
                             _Unwind_Action actions,
                             uint64_t exceptionClass,
                             _Unwind_Exception* unwind_exception,
                             _Unwind_Context* context)
{
    if (actions &amp; _UA_SEARCH_PHASE)
    {
        printf("Personality function, lookup phase\n");
        return _URC_HANDLER_FOUND;
    } else if (actions &amp; _UA_CLEANUP_PHASE) {
        printf("Personality function, cleanup\n");

        // Calculate what the instruction pointer was just before the
        // exception was thrown for this stack frame
        uintptr_t throw_ip = _Unwind_GetIP(context) - 1;

        // Pointer to the beginning of the raw LSDA
        LSDA_ptr lsda = (uint8_t*)_Unwind_GetLanguageSpecificData(context);

        // Read LSDA headerfor the LSDA
        LSDA_Header header(&amp;lsda);

        // Read the LSDA CS header
        LSDA_CS_Header cs_header(&amp;lsda);

        // Calculate where the end of the LSDA CS table is
        const LSDA_ptr lsda_cs_table_end = lsda + cs_header.length;

        // Loop through each entry in the CS table
        while (lsda &lt; lsda_cs_table_end)
        {
            LSDA_CS cs(&amp;lsda);

            // If there&#x27;s no LP we can&#x27;t handle this exception; move on
            if (not cs.lp) continue;

            uintptr_t func_start = _Unwind_GetRegionStart(context);

            // Calculate the range of the instruction pointer valid for this
            // landing pad; if this LP can handle the current exception then
            // the IP for this stack frame must be in this range
            uintptr_t try_start = func_start + cs.start;
            uintptr_t try_end = func_start + cs.start + cs.len;

            // Check if this is the correct LP for the current try block
            if (throw_ip &lt; try_start) continue;
            if (throw_ip &gt; try_end) continue;

            // We found a landing pad for this exception; resume execution
            int r0 = __builtin_eh_return_data_regno(0);
            int r1 = __builtin_eh_return_data_regno(1);

            _Unwind_SetGR(context, r0, (uintptr_t)(unwind_exception));
            // Note the following code hardcodes the exception type;
            // we&#x27;ll fix that later on
            _Unwind_SetGR(context, r1, (uintptr_t)(1));

            _Unwind_SetIP(context, func_start + cs.lp);
            break;
        }

        return _URC_INSTALL_CONTEXT;
    } else {
        printf("Personality function, error\n");
        return _URC_FATAL_PHASE1_ERROR;
    }
}
```

As usual: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v07).

Try the example again and voila, no more infinite loop! That was a simple change and we can now choose the correct landing pad. Next time we'll try to make our personality function also pick the correct stack frame instead of choosing the first one.

---

C++ exceptions under the hood 16: finding the right catch in a landing pad
--------------------------------------------------------------------------

16th chapter on our quest to implement a mini-ABI capable of handling exceptions; last time we implemented our personality function so it would be able to handle functions with more than one landing pad. We are now trying to make it recognize whether a certain landing pad can handle a specific exception, so we can use the exception specification on the catch statement.

Of course, to know whether a landing pad can handle a throw is a difficult task. Would you expect anything else? The biggest problems to overcome right now will be:

* First and foremost: how can we find the accepted types for a catch block?
* Assuming we can find the types for a catch, how can we handle a catch(...)?
* For a landing pad with multiple catch statements, how can we know all possibly catch types?
* Take the following example. Not only we'll have to check whether the landing pad accepts the current exception, we'll have to check if it accepts any of the current exception's parents!

```c++

struct Base {};
struct Child : public Base {};
void foo() { throw Child; }

void bar()
{
    try { foo(); }
    catch(const Base&amp;){ ... }
}
```

To make our work a bit easier let's say for now we work only with landing pads that have a single catch and no inheritance exists on our program. Still, how do we find out the accepted types for a landing pad?

Turns there is a place in .gcc\_except\_table we haven't analyzed yet: the action table. Let's dissasemble our throw.cpp object and see what's in there, right after the call site table is finished, for our "try but don't catch" function:

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v07).

```
.LLSDACSE1:
	.byte	0x1
	.byte	0
	.align 4
	.long	_ZTI14Fake_Exception
.LLSDATT1:
```

Doesn't look like much, but there's a promising pointer (both a proverbial and a real pointer) to something that has our exception's name. Let's go to the definition of \_ZTI14Fake\_Exception:

```
_ZTI14Fake_Exception:
	.long	_ZTVN10__cxxabiv117__class_type_infoE+8
	.long	_ZTS14Fake_Exception
	.weak	_ZTS9Exception
	.section	.rodata._ZTS9Exception,"aG",@progbits,_ZTS9Exception,comdat
	.type	_ZTS9Exception, @object
	.size	_ZTS9Exception, 11
```

And we reached something very interesting. Can you recognize it? This is the std::type\_info for struct Fake\_Exception!

Now we know there is indeed a way to get a pointer to some kind of reflexion information for our exception. Can we programmatically find it? We'll see next time.

---

C++ exceptions under the hood 17: reflecting on an exception type and reading .gcc\_except\_table
-------------------------------------------------------------------------------------------------

By now we know that when an exception is thrown we can get a lot of reflexion information by reading the local data storage area AKA .gcc\_except\_table; reading this table we have been able to implement a personality function capable of deciding which landing pad to run when an exception is thrown. We also know how to read the action table part of the LSDA, so we should be able to modify our personality function to pick the correct catch statement inside a landing pad with multiple catches.

We left our ABI implementation last time, and dedicated some time to analyze the assembly for .gcc\_except\_table to discover how can we find the types a catch can handle. We found that indeed there is a part of this table that holds a list of types where this information can be found. Let's try to read it on the cleanup phase, but first let's remember the definition for our LSDA header:

```c++
struct LSDA_Header {
    uint8_t start_encoding;
    uint8_t type_encoding;

    // This is the offset, from the end of the header, to the types table
    uint8_t type_table_offset;
};
```

That last field is new (for us): it's giving us an offset into table of types. Let's also remember the definition of each call site:

```c++
struct LSDA_CS {
    // Offset into function from which we could handle a throw
    uint8_t start;
    // Length of the block that might throw
    uint8_t len;
    // Landing pad
    uint8_t lp;
    // Offset into action table + 1 (0 means no action)
    uint8_t action;
};
```

Check that last field, "action". That gives us an offset into the action table. That means we can find the action for a specific CS. The trick here is that for landing pads where a catch exists, the action will hold an offset for the types table; we can then use the offset into the types table pointer, which we can get from the header. Quite a mouthful: let's better talk code:

```c++
// Pointer to the beginning of the raw LSDA
LSDA_ptr lsda = (uint8_t*)_Unwind_GetLanguageSpecificData(context);

// Read LSDA headerfor the LSDA
LSDA_Header header(&amp;lsda);

const LSDA_ptr types_table_start = lsda + header.type_table_offset;

// Read the LSDA CS header
LSDA_CS_Header cs_header(&amp;lsda);

// Calculate where the end of the LSDA CS table is
const LSDA_ptr lsda_cs_table_end = lsda + cs_header.length;

// Get the start of action tables
const LSDA_ptr action_tbl_start = lsda_cs_table_end;

// Get the first call site
LSDA_CS cs(&amp;lsda);

// cs.action is the offset + 1; that way cs.action == 0
// means there is no associated entry in the action table
const size_t action_offset = cs.action - 1;
const LSDA_ptr action = action_tbl_start + action_offset;

// For a landing pad with a catch the action table will
// hold an index to a list of types
int type_index = action[0];

// types_table_start actually points to the end of the table, so
// we need to invert the type_index. There we&#x27;ll find a ptr to
// the std::type_info for the specification in our catch
const void* catch_type_info = types_table_start[ -1 * type_index ];
const std::type_info *catch_ti = (const std::type_info *) catch_type_info;

// If everything went OK, this should print something like Fake_Exception
printf("%s\n", catch_ti-&gt;name());
```

The code looks complicated because there are several layers of indirection before actually reaching the struct type\_info, but it's not really doing anything complicated: it only reads the .gcc\_except\_table we found on the disassembly.

Printing the name of the type is already a big step in the right direction. Also, our personality function is getting a bit messy. Most of the complexity of reading the LSDA can be hidden under the rug for almost no cost at all. You can check my [implementation here](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v08)
Next time we'll see if we can match our newly found type to our original exception.

---

C++ exceptions under the hood 18: getting the right stack frame
---------------------------------------------------------------

Our latest personality function knows whether it can handle an exception or not (assuming there is only one catch statement per try block and assuming no inheritance is used) but to make this knowledge useful, we have first to check if the exception we can handle matches the exception being thrown. Let's try to do this.

Of course, we need first to know the exception type. To do this we need to save the exception type when **\_\_cxa\_throw** is called (this is the chance the ABI gives us to set all our custom data):

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v09).

```c++
void __cxa_throw(void* thrown_exception,
                 std::type_info *tinfo,
                 void (*dest)(void*))
{
    __cxa_exception *header = ((__cxa_exception *) thrown_exception - 1);

    // We need to save the type info in the exception header _Unwind_ will
    // receive, otherwise we won&#x27;t be able to know it when unwinding
    header-&gt;exceptionType = tinfo;

    _Unwind_RaiseException(&amp;header-&gt;unwindHeader);
}
```

And now we can read the exception type in our personality function and easily check if the exception types match (the exception names are C++ strings, so doing a == is enough to check this:

```c++
// Get the type of the exception we can handle
const void* catch_type_info = lsda.types_table_start[ -1 * type_index ];
const std::type_info *catch_ti = (const std::type_info *) catch_type_info;

// Get the type of the original exception being thrown
__cxa_exception* exception_header = (__cxa_exception*)(unwind_exception+1) - 1;
std::type_info *org_ex_type = exception_header-&gt;exceptionType;

printf("%s thrown, catch handles %s\n",
            org_ex_type-&gt;name(),
            catch_ti-&gt;name());

// Check if the exception being thrown is of the same type
// than the exception we can handle
if (org_ex_type-&gt;name() != catch_ti-&gt;name())
    continue;
```

Check [here](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v09) for the full source with the new changes.

Of course there would be a problem if we add that (can you see it?). If the exception is thrown in two phases and we said in the first one we would handle it, then we can't say on the second one we don't want it anymore. I don't know if \_Unwind\_ handles this case according to any documentation but this is most likely calling upon undefined behavior, so just saying we'll handle everything is no longer enough.

Since we gave our personality function the ability to know if the landing pad can handle the exception being thrown we have been lying to \_Unwind\_ about which exceptions we can handle; even though we said we handle all of them on [our ABI 9](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v09), the truth is that we didn't know whether we would be able to handle it. That's easy to change, we can do something like this:

```c++
_Unwind_Reason_Code __gxx_personality_v0 (...)
{
    printf("Personality function, searching for handler\n");

    // ...

    foreach (call site entry in lsda)
    {
        if (call site entry.not_good()) continue;

        // We found a landing pad for this exception; resume execution

        // If we are on search phase, tell _Unwind_ we can handle this one
        if (actions &amp; _UA_SEARCH_PHASE) return _URC_HANDLER_FOUND;

        // If we are not on search phase then we are on _UA_CLEANUP_PHASE
        /* set everything so the landing pad can run */

        return _URC_INSTALL_CONTEXT;
    }

    return _URC_CONTINUE_UNWIND;
}
```

As usual, check the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v10).

So, what would we get if we run the personality function with this change? Fail, that's what we'd get! Remember our throwing functions? This one should catch our exception:

```c++
void catchit() {
    try {
        try_but_dont_catch();
    } catch(Fake_Exception&amp;) {
        printf("Caught a Fake_Exception!\n");
    } catch(Exception&amp;) {
        printf("Caught an Exception!\n");
    }

    printf("catchit handled the exception\n");
}
```

Unfortunately, our personality function only checks for the first type the landing pad can handle. If we delete the Fake\_Exception catch block and try it again, though, we'd get a different story: finally, success! Our personality function can now select the correct catch in the correct frame, provided there's no try block with multiple catches.

Next time we'll be further improving this.

---

C++ exceptions under the hood 19: getting the right catch in a landing pad
--------------------------------------------------------------------------

19th entry about C++ exception handling: we have written a personality function that can so far, by reading the LSDA, choose the right landing pad on the right stack frame to handle a thrown exception, but it was having some difficulties finding the right catch inside a landing pad. To finally get a decently working personality function we'll need to check all the types an exception can handle by going through all the actions table in the .gcc\_except\_table.

Remember the action table? Let's check it again but this time for a try with multiple catch blocks.

```
# Call site table
.LLSDACSB2:
    # Call site 1
	.uleb128 ip_range_start
	.uleb128 ip_range_len
	.uleb128 landing_pad_ip
	.uleb128 (action_offset+1) => 0x3

    # Rest of call site table

# Action table start
.LLSDACSE2:
    # Action 1
	.byte	0x2
	.byte	0

    # Action 2
	.byte	0x1
	.byte	0x7d

	.align 4
	.long	_ZTI9Exception
	.long	_ZTI14Fake_Exception
.LLSDATT2:
# Types table start
```

If we intend to read the exceptions supported by the landing pad 1 in the example above (that LSDA is for the catchit function, by the way) we need to do something like this:

* Get the action offset from the call site table, 2: remember you'll actually read the offset plus 1, so 0 means no action.
* Go to action offset 2, get type index 1. The types table is indexed in reverse order (ie we have a pointer to its end and we need to access each element by using -1 \* index).
* Go to types\_table[-1]; you'll get a pointer to the type\_info for Fake\_Exception
* Fake\_Exception is not the current exception being thrown; get the next action offset for our current action (0x7d)
* Reading 0x7d in uleb128 will actually yield -3; from the position where we read the offset move back 3 bytes to find the next action
* Read type index 2
* Get the type\_info for Exception this time; it matches the current exception being thrown, so we can install the landing pad!

It sounds complicated because there's, again, a lot of indirection for each step but you can check the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v11).

In the link above you will also see a bonus: a change to the personality function to correctly detect and use catch(...) blocks. That's an easy change once the personality functions knows how to read the types table: a type with a null pointer (ie a position in the table that instead of a valid pointer to an std::type\_info holds null) represents a catch all block. This has an interesting side effect: a catch(T) will be able to handle only native (ie coming from C++) exceptions, whereas a catch(...) would catch also exceptions not thrown from within C++.

We finally know how exceptions are thrown, how the stack is unwinded, how a personality function selects the correct stack frame to handle an exception and how the right catch inside a landing pad is selected, but we still have on more problem to solve: running destructors. We'll change our personality function to support RAII objects next time.

---

C++ exceptions under the hood 20: running destructors while unwinding
---------------------------------------------------------------------

The [mini ABI version 11](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v11) we have written last time was able to handle pretty much all the basics to handle an exception: we have an (almost working) ABI capable of throwing and catching exceptions, but it is still unable to properly run destructors. That's quite important if we want to write exception safe code. With what we know about .gcc\_except\_table running destructors is a piece of cake, we only need to see a bit of assembly:

```
# Call site table
.LLSDACSB2:
    # Call site 1
	.uleb128 ip_range_start
	.uleb128 ip_range_len
	.uleb128 landing_pad_ip
	.uleb128 (action_offset+1) => 0x3

    # Rest of call site table

# Action table start
.LLSDACSE2:
    # Action 1
	.byte	0
	.byte	0

    # Action 2
	.byte	0x1
	.byte	0x7d

	.align 4
	.long	_ZTI14Fake_Exception
.LLSDATT2:
# Types table start
```

On a regular landing pad, when an action has a type index greater than 0 it means we're seeing an index to a type tables, and we can use that to know which types the catch can handle; for a type index with a value of 0 it means we are instead seeing a cleanup block and we should run it anyway. Although the landing pad can't handle the exception it will still be able to perform the cleanup that's supposed to happen while unwinding. Of course the landing pad will call \_Unwind\_Resume when the cleanup is done and that will continue the regular stack unwinding process.

I've uploaded this [latest and last version to my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v12), but there are some bad news: remember how we cheated by saying that a uleb128 == char? As soon as we start adding blocks to run destructors the .gcc\_except\_table starts to get quite big (where "big" means we have offsets over 127 bytes long) and that assumption no longer holds.

For the next version of this ABI we would have to rewrite our LSDA reading functions to read proper uleb128 code. Not a major change, but at this point we wouldn't gain much, we have already achieved our goal: a working minimal ABI capable of handling exceptions without the help of libcxxabi.

There are parts we haven't covered, like handling non-native exceptions, catching derived types or interoperability between compilers and linkers. Maybe some other time, in this rather long series of articles we already learned quite a bit about low level exception handling in C++.

---

C++ exceptions under the hood 21: a summary and some final thoughts
-------------------------------------------------------------------

After writing twenty some articles about C++ low level exception handling, it's time for a recap and some final thoughts. What did we learn, how is an exception thrown and how is it caught?

Leaving aside the ugly details of reading the .gcc\_except\_table, which were probably the biggest part of these articles, we could summarize the whole process like this:

1. The C++ compiler actually does rather little to handle an exception, most of the magic actually happens in libstdc++.
2. There are a few things the compiler does, though. Namely:
	* It creates the CFI information to unwind the stack.
	* It creates something called .gcc\_except\_table with information about landing pads (try/catch blocks). Kind of like reflexion info.
	* When we write a throw statement, the compiler will translate it into a pair of calls into libstdc++ functions that allocate the exception and then start the stack unwinding process by calling libstdc.
3. When an exception is thrown at runtime \_\_cxa\_throw will be called, which will delegate the stack unwinding to libstdc.
4. As the unwinder goes through the stack it will call a special function provided by libstdc++ (called personality routine) that checks for each function in the stack which exceptions can be caught.
5. If no matching catch is found for the exception, std::terminate is called.
6. If a matching catch is found, the unwinder now starts again on the top of the stack.
7. As the unwinder goes through the stack a second time it will ask the personality routine to perform a cleanup for this method.
8. The personality routine will check the .gcc\_except\_table for the current method. If there are any cleanup actions to be run, it will "jump" into the current stack frame and run the cleanup code. This will run the destructor for each object allocated at the current scope.
9. Once the unwinder reaches the frame in the stack that can handle the exception it will jump into the proper catch statement.
10. Upon finishing the execution of the catch statement, a cleanup function will be called to release the memory held for the exception.

Having learned how exceptions work we are now in a position to better answer why it's hard to write exception safe code.

Exceptions, while conceptually clean, are pretty much "spooky action at a distance". Throwing and catching an exception involves a certain degree of reflexion (in the sense that a program must analyze itself) which is not common for C++ applications.

Even if we talk about higher level languages, throwing an exception means we cannot rely on our understanding of how a normal program execution flow should work anymore: we are used to a pretty much linear execution flow with some conditional operators branching or calling other functions. With an exception, this no longer holds true: an entity which is not the code of our application is in control of the execution, and it goes around the program executing certain blocks of code here and there without following any of the normal rules. The instruction pointer gets changed by each landing pad, the stack is unwinded in ways we can't control and, ultimately, a lot of magic happens under the hood.

To summarize it even more: exceptions are hard simply because they break the natural flow of a program as we understand it. This does not mean they are intrinsically bad as properly used exceptions can surely lead to cleaner code, but they should always be used with care.

---

C++ exceptions under the hood appendix I: the true cost of an exception
-----------------------------------------------------------------------

Remember a long way back, when the series on exception handling was just started, that I mentioned these articles would only apply for gcc/x86? There is a reason for that since not all compilers implement exception handling the same way. In particular, there are two major ways of doing it:

* With a lookup table and some metadata, like the Itanium ABI specifies; this is what we talked about.
* Sj/Lj (ARM): Registering exception handling information upon entering or exiting a method.

The way gcc (and many other compilers) implement this ABI on x86 is by using metadata (the .gcc\_except\_table and the CFI). Although it's rather difficult to parse, and it might take a long time to parse this on runtime when an exception is thrown, it has a great upside: if no exceptions are thrown then there's no setup cost to be paid. This is called "Zero-cost exception handling" because a normal execution, where no exceptions are thrown, no penalty is payed. The performance is exactly the same we would have as if we had specified nothrow. That's right, leaving code locality & caching issues aside, using exceptions or not has no performance penalty unless an exception is actually thrown. This is a great advantage and it goes in line with C++ philosophy of having no-cost for non used features.

When using the noexcept specification while declaring a method (or an empty throw specifier, pre C++11) in the setup used for these articles the compiler would omit the creation of the .gcc\_except\_table. This will make the code more compact and it will improve the cache usage, but it's very unlikely that will have a noticeable impact on the performance of the application.

If we talk about ARM, Sj/Lj seems to be the default option (I'm sure there's a good reason for that but I don't have enough experience with ARM to know it). This exception handling method is based on registering exception handling information upon entering or exiting a method which either uses exceptions or requires a cleanup if an exception is thrown. This will result in a quicker exception handling, but the setup cost is payed whether an exception is thrown or not.

If you're interested on reading more about sjlj and zero cost exception handling [LLVM has great documentation](http://llvm.org/docs/ExceptionHandling.html).

---

C++ exceptions under the hood appendix II: metaclasses and RTTI on C++
----------------------------------------------------------------------

A long time ago, when we where just starting to write our mini ABI to handle exceptions without libstdc++'s help, we had to add an empty class to appease the linker:

```c++
namespace __cxxabiv1 {
    struct __class_type_info {
        virtual void foo() {}
    } ti;
}
```

I mentioned this class is used to check whether a catch can handle a subtype of the exception thrown, but what does that exactly mean? Let's change a bit our throwing functions to see what happens when we start dealing with inheritance. You may want to check [the source code for these examples.](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v12)

```c++
struct Derived_Exception : public Exception {};

void raise() {
    throw Derived_Exception();
}

void catchit() {
    try {
        raise();
    } catch(Exception&amp;) {
        printf("Caught an Exception!\n");
    } catch(Derived_Exception&amp;) {
        printf("Caught a Derived_Exception!\n");
    }

    printf("catchit handled the exception\n");
}
```

What should happen in this example is crystal clear: it should print "Caught an Exception", because that catch block should be able to handle both types, Exception and Derived\_Exception. Not only that, if we compile throw.cpp we'll get a warning to let us know that the second catch is dead code:

```c++
throw.cpp: In function void catchit():
throw.cpp:15:7: warning: exception of type Derived_Exception will be caught [enabled by default]
throw.cpp:13:7: warning:    by earlier handler for Exception [enabled by default]
```

Luckily a warning won't stop compilation; we can continue and try to link the resulting .o; we'll find a linker error:

```c++
throw.o:(.rodata._ZTI17Derived_Exception[typeinfo for Derived_Exception]+0x0): undefined reference to `vtable for __cxxabiv1::__si_class_type_info&#x27;
```

And again we start seeing \_\_type\_info errors. If we create a fake \_\_si\_class\_type\_info to workaround this problem we we'll finally see our ABI breaks down when dealing with inheritance, in a rather funny way: the compiler will warn us about dead code and then we see that same code being executed by our ABI!

```c++
g++ -c -o throw.o -O0 -ggdb throw.cpp
throw.cpp: In function void catchit():
throw.cpp:15:7: warning: exception of type Derived_Exception will be caught [enabled by default]
throw.cpp:13:7: warning:    by earlier handler for Exception [enabled by default]
gcc main.o throw.o mycppabi.o -O0 -ggdb -o app
./app
begin FTW
Caught a Derived_Exception!
end FTW
catchit handled the exception
```

Clearly there's something wrong with our ABI, and it's very easy to trace this problem back to the definition of "can\_handle", the part of the code that checks whether an exception can by caught by a catch block:

```c++
bool can_handle(const std::type_info *thrown_exception,
                const std::type_info *catch_type)
{
    // If the catch has no type specifier we&#x27;re dealing with a catch(...)
    // and we can handle this exception regardless of what it is
    if (not catch_type) return true;

    // Naive type comparisson: only check if the type name is the same
    // This won&#x27;t work with any kind of inheritance
    if (thrown_exception-&gt;name() == catch_type-&gt;name())
        return true;

    // If types don&#x27;t match just don&#x27;t handle the exception
    return false;
}
```

Our ABI gets the std::type\_info for the exception being thrown and for the type which can be handled, and then compares if the names for these types is the same. This is fine as long as no inheritance is involved, but in the example above we already found a case where an exception should be handled even though a name is not shared.

The same problem will arise when trying to catch a pointer to an exception: the names won't match. Even more interesting, if you try and link throw.cpp but change the catch to receive a pointer instead, you'll get a new linker error. If you fix it you should end up with something like this:

```c++
namespace __cxxabiv1 {
    struct __class_type_info    { virtual void foo() {} } ti;
    struct __si_class_type_info { virtual void foo() {} } si;
    struct __pointer_type_info  { virtual void foo() {} } ptr;
}
```

A very interesting pattern is starting to emerge: there is a different \*\_type\_info for each possible catch type used. In fact the compiler will generate a different structure for each throw style. For example, for these throws:

```c++
throw new Exception;
throw Exception;
```

the compiler would generate something like:

```c++
__cxa_throw(_Struct_Type_Info__Ptr__Exception);
__cxa_throw(_Struct_Type_Info__Class__Exception);
```

In fact, even for this simple example, the inheritance web (not tree, web) is quite complex (note that I'm kind of inventing the mangling here, it's not what gcc uses):

![](/blog_img/type_info_inheritance.png)
All these classes are generated by the compiler to specify precisely which type is being thrown, and how. For example, if an exception of type "Ptr\_\_Type\_Info\_\_Derived\_Exception" is thrown then a catch can handle it if:

The catch type equals the thrown type exactly (this is the only check our ABI does).If the catch type is a pointer (ie inherits from cxxabi::ponter\_type\_info), and said pointer can be casted to the exception type.If the thrown type is a derived type, then we need to check if the catch type is a parent type

And this list is still missing lots of possibilities, but for the full list is better to check a real C++ ABI. [LLVM](http://libcxxabi.llvm.org/) has very clear and easy to understand ABI, you can check these details in the file "private\_typeinfo.cpp". If you check LLVM's implementation of run time type information, you'll soon realize why we didn't implement this on our ABI: the amount of rules to determine whether two types are the same or not is incredibly complex.

---

### C++ exceptions under the hood appendix III: RTTI and exceptions orthogonality

Exception handling on C++ requires a lot of reflexion. I don't mean the programmer should be reflecting on exception handling (though that's probably not a bad idea), I mean that a piece of C++ code should be able to understand things about itself. This looks a lot like run-time type information, RTTI. Are they the same? If they are, does exception handling work without RTTI?

We might be able to get a clue about the difference between RTTI and exception handling by using -fno-rtti on gcc when compiling our ABI project. Let's use the [throw.cpp](https://github.com/nicolasbrailo/cpp_exception_handling_abi/blob/master/abi_v12/throw.cpp) file:

```c++
g++ -fno-rtti -S throw.cpp -o throw.nortti.s
g++ -S throw.cpp -o throw.s
diff throw.s throw.nortti.s
```

If you try that yourself you should see there's no difference between the RTTI and the No-RTTI version. Can we conclude then that gcc's exception handling is done with a mechanism different to RTTI? Not yet, let's see what happens if we try to use RTTI ourselves:

```c++
void raise() {
    Exception ex;
    typeid(ex);
    throw Exception();
}
```

If you try and compile that, gcc will complain: you can't use typeid with -fno-rtti specified. Which makes sense. Let's see what typeid does with a simple test:

```c++
#include &lt;typeinfo&gt;

class Bar {};
const std::type_info&amp; foo()
{
        Bar bar;
            return typeid(bar);
}
```

If we compile this with "g++ -O0 -S", you will see foo compiled into something like this:

```
_Z3foov:
.LFB19:
    # Prologue stuff...

    subl    $16, %esp
    # Bar bar

    movl    $_ZTI3Bar, %eax
    # typeid(bar)

    leave
    # Epilogue stuff...

_ZTS3Bar:
    # Definition for _ZTS3Bar...

_ZTI3Bar:
    .long   _ZTVN10__cxxabiv117__class_type_infoE+8
    .long   _ZTS3Bar
    .ident  "GCC: (Ubuntu/Linaro 4.6.3-1ubuntu5) 4.6.3"
    .section    .note.GNU-stack,"",@progbits
```

Does that look familiar? If it doesn't, then try changing the sample code to this one:

```c++
class Bar {};
void foo() { throw Bar(); }
```

Compile it like "g++ -O0 -fno-rtti -S test.cpp" and see the resulting file. You should see something like this now:

```
_Z3foov:
    # Prologue stuff...

    # Initialize exception
    subl    $24, %esp
    movl    $1, (%esp)
    call    __cxa_allocate_exception
    movl    $0, 8(%esp)

    # Specify Bar as exception thrown
    movl    $_ZTI3Bar, 4(%esp)
    movl    %eax, (%esp)

    # Handle exception
    call    __cxa_throw

    # Epilogue stuff...

_ZTS3Bar:
    # Definition for _ZTS3Bar...

_ZTI3Bar:
    .long   _ZTVN10__cxxabiv117__class_type_infoE+8
    .long   _ZTS3Bar
    .ident  "GCC: (Ubuntu/Linaro 4.6.3-1ubuntu5) 4.6.3"
    .section    .note.GNU-stack,"",@progbits
```

That should indeed look familiar: the class being thrown is exactly the same as the class that was used for typeid!

We can now conclude what's going on: **the implementation for exception throwing type information, which needs reflexion and relies on RTTI info for it, is exactly the same as the underlying implementation for typeid and other RTTI friends**. Specifying -fno-rtti on g++ only disables the "frontend" functions for RTTI: that means you won't be able to use typeid, and no RTTI classes will be generated... unless an exception is thrown, in which case the needed RTTI classes will be generated regardless of -fno-rtti being present (you still won't be able to access the RTTI information of this class via typeid, though).

