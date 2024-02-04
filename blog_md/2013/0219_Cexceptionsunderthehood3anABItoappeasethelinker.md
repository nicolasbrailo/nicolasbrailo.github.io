# C++ exceptions under the hood 3: an ABI to appease the linker

@meta publishDatetime 2013-02-19T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/02/c-exceptions-under-hood-3-abi-to.html

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

