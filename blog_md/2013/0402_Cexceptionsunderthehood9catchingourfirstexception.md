# C++ exceptions under the hood 9: catching our first exception

@meta publishDatetime 2013-04-02T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/04/c-exceptions-under-hood-9-catching-our.html

We finished last chapter on the series about C++ exceptions by adding a personality function that \_Unwind\_ was able to call and then analyzing the parameters that the personality function receives. Now it's time to begin adding some real behavior to \_\_gxx\_personality\_v0: when \_\_gxx\_personality\_v0 is called we should say "yes, this stack frame can indeed handle this exception".

We have been building up to this point quite a bit: the time where we can implement for the first time a personality function capable of detecting when an exception is thrown, and then saying "yes, I will handle this exception". For that we had to learn how the two-phase lookup work, so we can now reimplement our personality function and our throw test file:

```c++
#include &lt;stdio.h&gt;
#include "throw.h"

struct Fake_Exception {};

void raise() {
    throw Exception();
}

void try_but_dont_catch() {
    try {
        raise();
    } catch(Fake_Exception&amp;) {
        printf("Caught a Fake_Exception!\n");
    }

    printf("try_but_dont_catch handled the exception\n");
}

void catchit() {
    try {
        try_but_dont_catch();
    } catch(Exception&amp;) {
        printf("Caught an Exception!\n");
    }

    printf("catchit handled the exception\n");
}

extern "C" {
    void seppuku() {
        catchit();
    }
}
```

And our personality function:

```c++
_Unwind_Reason_Code __gxx_personality_v0 (
                     int version, _Unwind_Action actions, uint64_t exceptionClass,
                     _Unwind_Exception* unwind_exception, _Unwind_Context* context)
{
    if (actions &amp; _UA_SEARCH_PHASE)
    {
        printf("Personality function, lookup phase\n");
        return _URC_HANDLER_FOUND;
    } else if (actions &amp; _UA_CLEANUP_PHASE) {
        printf("Personality function, cleanup\n");
        return _URC_INSTALL_CONTEXT;
    } else {
        printf("Personality function, error\n");
        return _URC_FATAL_PHASE1_ERROR;
    }
}
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v03).

Let's run it, see what happens:

```c++
alloc ex 1
__cxa_throw called
Personality function, lookup phase
Personality function, cleanup
try_but_dont_catch handled the exception
catchit handled the exception
```

It works, but something is missing: the catch inside the catch/try block is not being executed! This is happening because the personality function tells Unwind to "install a context" (ie to resume execution) but it never says which context. In this case it's probably resuming executing from after the landing pad, but I'd bet this is actually undefined behavior. We'll see next time how we can specify we want to resume executing from a specific landing pad using the information available on .gcc\_except\_table (our old friend, the LSDA).

