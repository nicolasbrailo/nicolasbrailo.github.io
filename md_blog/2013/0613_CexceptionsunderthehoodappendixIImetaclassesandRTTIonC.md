# C++ exceptions under the hood appendix II: metaclasses and RTTI on C++

@meta publishDatetime 2013-06-13T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/06/c-exceptions-under-hood-appendix-ii.html

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
    } catch(Exception&) {
        printf("Caught an Exception!\n");
    } catch(Derived_Exception&) {
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
throw.o:(.rodata._ZTI17Derived_Exception[typeinfo for Derived_Exception]+0x0): undefined reference to `vtable for __cxxabiv1::__si_class_type_info'
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
    // If the catch has no type specifier we;re dealing with a catch(...)
    // and we can handle this exception regardless of what it is
    if (not catch_type) return true;

    // Naive type comparisson: only check if the type name is the same
    // This won't work with any kind of inheritance
    if (thrown_exception->name() == catch_type->name())
        return true;

    // If types don't match just don't handle the exception
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

