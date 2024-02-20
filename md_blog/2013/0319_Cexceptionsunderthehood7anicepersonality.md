# C++ exceptions under the hood 7: a nice personality

@meta publishDatetime 2013-03-19T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/03/c-exceptions-under-hood-7-nice.html

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
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

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
    if (thrown_size > EXCEPTION_BUFF_SIZE) printf("Exception too big");
    return &exception_buff;
}

void __cxa_free_exception(void *thrown_exception);

#include <unwind.h>

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
    _Unwind_RaiseException(&header->unwindHeader);

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



# Comments

---
## In reply to this post, [Anonymous]() commented @ 2018-01-04T10:47:04.000+01:00:

But .gcc\_except\_table is same with .eh\_frame. (ubuntu Ubuntu 14.04.5 LTS, gcc gcc (Ubuntu 4.8.4-2ubuntu1~14.04.3) 4.8.4)

Original [published here](md_blog/2013/0319_Cexceptionsunderthehood7anicepersonality.md).
