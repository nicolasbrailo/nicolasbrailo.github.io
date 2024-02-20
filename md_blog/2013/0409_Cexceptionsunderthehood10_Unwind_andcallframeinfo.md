# C++ exceptions under the hood 10: Unwind and call frame info

@meta publishDatetime 2013-04-09T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/04/c-exceptions-under-hood-10-unwind-and.html

We left our mini-ABI project ([link](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v03)) capable of throwing exceptions, and we are now working on catching them; we implemented a personality function last time which was capable of detecting and handling exceptions but it was still a bit incomplete: even though it can properly notify the stack unwinder when it should stop but our version of \_\_gxx\_personality\_v0 can't run the code inside a catch block. It's better than a coredump one might argue, but still a long way from a useful exception handling ABI. Can we improve it?

How can we tell \_Unwind\_ where is our landing pad, so we can execute the code inside the catch statement? If we go back to the [ABI specification](md_blog/youfoundadeadlink.md), there are a few context management functions which might help us:

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
function pointer to try_but_dont_catch = 0x8048612 <:try_but_dont_catch()>

(gdb) disassemble /m try_but_dont_catch
Dump of assembler code for function try_but_dont_catch():
10	void try_but_dont_catch() {
        [...]
11	    try {
12	        raise();
   0x08048619 <:+7>:	call   0x80485e8 <:raise()>

13	    } catch(Fake_Exception&) {
   0x08048651 <:+63>:	call   0x804874a <:__cxa_begin_catch()>
   0x08048665 <:+83>:	call   0x804875e <:__cxa_end_catch()>
   0x0804866a <:+88>:	jmp    0x804861e <:try_but_dont_catch()+12>

14	        printf("Caught a Fake_Exception!\n");
   0x08048659 <:+71>:	movl   $0x8048971,(%esp)
   0x08048660 <:+78>:	call   0x80484c0 <:puts@plt>

15	    }
16
17	    printf("try_but_dont_catch handled the exception\n");
   0x0804861e <:+12>:	movl   $0x8048948,(%esp)
   0x08048625 <:+19>:	call   0x80484c0 <:puts@plt>

18	}
   0x0804862a <:+24>:	add    $0x24,%esp
```

With the help of \_Unwind\_ we are now able to get enough information about the current stack frame to decide whether we can or not handle an exception, an also how should we handle it. One more step is needed before we can detect the landing pad we want: we will need to interpret the CFI (call frame information) at the end of the function. This is part of the DWARF spec, the same gdb uses for debugging purposes, and it's not an easy spec to implement. Like we are doing with our ABI, we'll keep this to the bare minimum.

