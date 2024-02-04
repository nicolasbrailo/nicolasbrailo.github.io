# C++ exceptions under the hood 5: magic around __cxa_begin_catch and
__cxa_end_catch

@meta publishDatetime 2013-03-05T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/03/c-exceptions-under-hood-5-magic-around.html

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

