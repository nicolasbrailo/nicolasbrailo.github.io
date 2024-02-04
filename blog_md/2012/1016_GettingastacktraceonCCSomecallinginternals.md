# Getting a stacktrace on C/C++: Some calling internals

@meta publishDatetime 2012-10-16T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/10/getting-stacktrace-on-cc-some-calling.html

High level languages tend to have a lot of features for introspection and metaprogramming. One of those useful features is the possibility to get a stacktrace of the current function. At first C++ would seem to lack that ability but once you think about it, high level languages internal workings are in the very basics not that different from lower level languages: they tend to be a virtual representation of the physical hardware. A function call, in the end, will most likely be implemented the same on both C++ and Ruby. So, although it may not be as straight forward as it is with a dynamic language, we should be able to get a stacktrace just fine. Also, there's a big clue for us: gdb can get stacktraces just fine, so why wouldn't we?

Let's start by trying to figure out how we can get a stacktrace by ourselves, with no help of any other tools. Sounds like a daunting task? It isn't really. Let's write a simple program to figure out how gcc performs function calls:

```c++
int foo() {
    return 42;
}

void bar() {
    foo();
}

int main() {
    bar();
    return 0;
}
```

If we compile this with gcc -S we'll get a .s file with the disassembly. Of course this depends a lot on the compiler, architecture, OS, etc, etc. For the moment we'll just assume x86 gcc Linux with no optimizations. A lot of the code from the disassembly will be part of the compiler's preamble and postamble. Cleaning things up a bit we should see something like this:

```c++
_Z3barv:
.LFB1:
	pushl	%ebp
	movl	%esp, %ebp
	call	_Z3foov
	popl	%ebp
	ret
```

Doesn't look so hard: it just pushes the current stack base pointer to the stack, sets a new stack pointer and calls the function (you might want to play around with c++filt if name mangling confuses you). Once it returns it just reads back the original stack base pointer and continues. Knowing that return addresses are in the stack makes it easy for us to retrieve this information, we just need a way to get the current stack pointer. Some assembler in C++ will be needed:

```c++
    void *sp;
    asm("movl %%esp,%0"; : "=r"(sp));
    std::cout &lt;&lt; sp &lt;&lt; std::endl;
```

That should print the current function's start address. But from our disassembly we can also see that the current function's return address, ie its caller, would be stored in the first word of the current function's stack. Likewise, our caller's return address will be on its first stack word. Let's check if this holds up in the code:

```c++
    void *sp;
    asm("movl %%esp,%0"; : "=r"(sp));
    void *caller_addr = *(void**)sp;
    void *caller_addr2 = *(void**)caller_addr;
    void *caller_addr3 = *(void**)caller_addr2;

    cout &lt;&lt; sp &lt;&lt; endl;
    cout &lt;&lt; caller_addr &lt;&lt; endl;
    cout &lt;&lt; caller_addr2 &lt;&lt; endl;
    cout &lt;&lt; caller_addr3 &lt;&lt; endl;
```

Looks ugly, but remember we are fighting the type system here: we need to tell the compiler that the void\* we're trying to access is actually a void\*\*. We'll clean that up later, for the moment if we run that on our sample we should see all the stack addresses that for our stack trace, ending with a null pointer for the main function. Pretty neat, huh? So far we only have function addresses, but we'll get some pretty names later. Let's make it a bit more generic before moving on.

```c++
    struct Caller {
            Caller *addr;
    };

    // Get the stack base ptr from a register
    void *sp;
    asm("movl %%ebp,%0" : "=r"(sp));

    // Loop through every caller
    Caller *caller = (Caller*)sp;
    while (caller) {
        cout &lt;&lt; caller-&gt;addr &lt;&lt; endl;
        caller = caller-&gt;addr;
    }
```

Of course this is very naive, as it will only work on a 32 bit platform, and it will break as soon as we change calling conventions, but it's still useful to draw some conclusions:

* Getting a stacktrace in C++ is indeed possible
* Now we know why inlined functions and optimizations make debugging more difficult (hint: how can you get a stack frame for a function that doesn't really exist?)

Next time we'll see how we can get a function name from it's pointer.

