# C++ exceptions under the hood 6: gcc_except_table and the personality function

@meta publishDatetime 2013-03-12T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/03/c-exceptions-under-hood-6.html

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

