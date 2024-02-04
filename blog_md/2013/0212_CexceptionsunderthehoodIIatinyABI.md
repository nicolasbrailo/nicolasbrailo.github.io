# C++ exceptions under the hood II: a tiny ABI

@meta publishDatetime 2013-02-12T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/02/c-exceptions-under-hood-ii-tiny-abi.html

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
> g++ -c -o throw.o -O0 -ggdb throw.cpp
> gcc -c -o main.o -O0 -ggdb main.c
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v01).

So far so good. Both g++ and gcc are happy in their little world. Chaos will ensue once we try to link them, though:

```c++
> gcc main.o throw.o -o app
throw.o: In function `foo()':
throw.cpp:4: undefined reference to `__cxa_allocate_exception'
throw.cpp:4: undefined reference to `__cxa_throw'
throw.o:(.rodata._ZTI9Exception[typeinfo for Exception]+0x0): undefined reference to `vtable for __cxxabiv1::__class_type_info'
collect2: ld returned 1 exit status
```

And sure enough, gcc complains about missing C++ symbols. Those are very special C++ symbols, though. Check the last error line: a vtable for cxxabiv1 is missing. cxxabi, defined in libstdc++, refers to the application binary interface for C++. So now we have learned that the exception handling is done with some help of the standard C++ library with an interface defined by C++'s ABI.

The C++ ABI defines a standard binary format so we can link objects together in a single program; if we compile a .o file with two different compilers, and those compilers use a different ABI, we won't be able to link the .o objects into an application. The ABI will also define some other formats, like for example the interface to perform stack unwinding or the throwing of an exception. In this case, the ABI defines an interface (not necessarily a binary format, just an interface) between C++ and some other library in our program which will handle the stack unwinding, ie the ABI defines C++ specific stuff so it can talk to non-C++ libraries: this is what would enable exceptions thrown from other languages to be caught in C++, amongst other things.

In any case, the linker errors are pointing us to the first layer into exception handling under the hood: an interface we'll have to implement ourselves, the cxxabi. For the next article we'll be starting our own mini ABI, as defined in the [C++ ABI](/blog_md/youfoundadeadlink.md).

