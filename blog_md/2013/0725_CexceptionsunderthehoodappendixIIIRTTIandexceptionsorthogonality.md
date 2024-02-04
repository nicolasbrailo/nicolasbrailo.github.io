# C++ exceptions under the hood appendix III: RTTI and exceptions orthogonality

@meta publishDatetime 2013-07-25T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/c-exceptions-under-hood-appendix-iii.html

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


---
## In reply to [this post](), [C++ Performance: Common Wisdoms and Common “Wisdoms” - IT Hare](/blog_md/youfoundadeadlink.md) commented @ 2018-01-02T11:58:47.000+01:00:

[…] [Brailovsky] Nicolás Brailovsky, C++ exceptions under the hood appendix III: RTTI and exceptions orthogonality […]

Original [published here](/blog_md/2013/0725_CexceptionsunderthehoodappendixIIIRTTIandexceptionsorthogonality.md).
