# Getting a stacktrace on C/C++: Mapping function pointers to function names on runtime

@meta publishDatetime 2012-10-23T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/10/getting-stacktrace-on-cc-mapping_23.html

[Last time](/md_blog/2012/1018_GettingastacktraceonCCMappingfunctionpointerstofunctionnamesinobjfiles.md) we talked about mapping function addresses to names (albeit mangled) in object files; we can also get this information during runtime:

### Glibc to the aid

Let's go one step back: how to get the current stacktrace. Turns out glibc already has a nice feature to get the current stacktrace. Going back to our original program, with some minor changes:

```c++
struct Caller { Caller *addr; };
void bt_by_hand() {
    // Get the stack base ptr from a register
    void *sp;
    asm("movl %%ebp,%0" : "=r"(sp));

    // Loop through every caller
    cout << "Hand made stack walker" << endl;
    Caller *caller = (Caller*)sp;
    while (caller) {
        cout << (((void**)caller)[1]) << endl;
        caller = caller->addr;
    }
}

#include <execinfo.h>
void bt_glibc() {
    void* buffer[10];
    int frames = backtrace(buffer, sizeof buffer);

    cout << "glibc stack walker" << endl;
    for (int i=0; i < frames; ++i) cout << buffer[i] << endl;
}

void bar(int, float) {
    bt_by_hand();
    bt_glibc();
}
```

Clearly using glibc's version is much cleaner, but will they yield the same results? Turns out not:

```c++
Hand made stack walker
0x80487b0
0x80487d5
0xb7659113
glibc stack walker
0x804873b
0x80487b5
0x80487d5
0xb7659113
0x8048611
```

Similar, but not quite.
* The first address in the glibc's stack walker correspond to the bt\_glibc, and more importantly since the real glibc backtrace is a function call itself it's easy to get that function into the stack. We don't even consider that case on our hand made stack walker. First difference explained.
* The second address should correspond to bar, but one is 0x80487b0 and the other is 0x80487b5. Again, it makes sense: since the void\* is actually the return address for EIP if we check the dissasembly we'll find that the 5 bytes difference correspond to the next instruction to be executed.
* 0x80487d5 is the return address for main, which is the same for both.
* The rest of the stack is easy: we stop at main, glibc keeps walking the stack inside glibc itself. Not so important for us, anyway.

### Name translations

We have a bunch of pointers. How can we get real function names now? Well, the easiest way is to use glibc's backtrace\_symbols\_fd, like this:

```c++
    int frames = backtrace(buffer, sizeof buffer);
    backtrace_symbols_fd(buffer, frames, 1);
```

On my machine, when running "g++ -rdynamic foo.cpp &&./a.out | c++filt", I get something like this:

```c++
./a.out(bt_glibc()+0x19)[0x8048976]
./a.out(bar(int, float)+0x10)[0x8048a0a]
./a.out(main+0x1e)[0x8048a2a]
/lib/i386-linux-gnu/libc.so.6(__libc_start_main+0xf3)[0xb759f113]
./a.out[0x8048851]
```

Note that without -rdynamic the function name symbols won't be available. Anyway, what we get is much more interesting than raw pointers. And exactly what we were looking for. It's also very boring, unless we learn what's going on inside backtrace\_symbols\_fd. If we go and check what backtrace\_symbols\_fd is doing (sysdeps/generic/elf/backtracesyms.c in glibc) we'll see that all the heavy work is done by libdl. A quick check with 'man dladdr' will show that we are on the right path. Let's add this to our program:

```c++
#include <dlfcn.h>
int get_sym_name(void *addr) {
    Dl_info info;
    int res = dladdr(addr, &info);
    cout << info.dli_fname << ": " << info.dli_sname << endl;
}
```

Behold, we now have a nice backtrace in C++, not so different than the bt you'd get in any dynamic language:

```c++
./a.out: _Z3barif
0x8048af9
./a.out: main
0x8048b19
/lib/i386-linux-gnu/libc.so.6: __libc_start_main
0xb7612113
```

### Turtles all the way down

Getting the function name using libdl feels a bit like cheating, after we manually walked the call stack. They are not in the same level of abstraction. Can we check what lurks inside libdl's dladdr? It's absolutely possible. In theory. Now we are dealing not only with a specific architecture (x86) we are also dealing with a binary format (more specifically, elf). To understand what goes on inside libdl's we need to know about the runtime linking process and elf internals. Feel free to peek at glibc/dlfcn/dlinfo.c, but beware that's a daunting task, way beyond the original scope of this article.

### Epilogue / Disclaimer

The whole series on getting a stacktrace on C++ is merely "educational", as in "never-ever do this on your program". As stated on the first part of the series it's not portable, and it's also extremely frail. If you want something production ready use glibc's backtrace features. And if you want something portable, try libunwind. It works great, but where would the fun be if we skipped the whole learning process and went straight to this library?


# Comments

---
## In reply to [this post](), [Anonymous]() commented @ 2016-10-16T21:01:01.000+02:00:

WTF? - asm("movl %%ebp,%0" : "=r"(sp));

Original [published here](/md_blog/2012/1023_GettingastacktraceonCCMappingfunctionpointerstofunctionnamesonruntime.md).
