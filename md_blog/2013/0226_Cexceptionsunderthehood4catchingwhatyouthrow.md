# C++ exceptions under the hood 4: catching what you throw

@meta publishDatetime 2013-02-26T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/02/c-exceptions-under-hood-4-catching-what.html

In this series about exception handling, we have discovered quite a bit about exception throwing by looking at compiler and linker errors but we have so far not learned anything yet about exception catching. Let's sum up the few things we learned about exception throwing:

* A throw statement will be translated by the compiler into two calls, **\_\_cxa\_allocate\_exception** and **\_\_cxa\_throw**.
* **\_\_cxa\_allocate\_exception** and **\_\_cxa\_throw** "live" on libstdc++
* **\_\_cxa\_allocate\_exception** will allocate memory for the new exception.
* **\_\_cxa\_throw** will prepare a bunch of stuff and forward this exception to **\_Unwind\_**, a set of functions that live in libstdc and perform the real stack unwinding ([the ABI](md_blog/youfoundadeadlink.md) defines the interface for these functions).

Quite simple so far, but exception catching is a bit more complicated, specially because it requires certain degree of reflexion (that is, the ability of a program to analyze its own source code). Let's keep on trying our same old method, let's add some catch statements throughout our code, compile it and see what happens:

```c++
#include "throw.h"
#include <stdio.h>

// Notice were adding a second exception type
struct Fake_Exception {};

void raise() {
    throw Exception();
}

// We will analyze what happens if a try block doesnt catch an exception
void try_but_dont_catch() {
    try {
        raise();
    } catch(Fake_Exception&) {
        printf("Running try_but_dont_catch::catch(Fake_Exception)\n");
    }

    printf("try_but_dont_catch handled an exception and resumed execution");
}

// And also what happens when it does
void catchit() {
    try {
        try_but_dont_catch();
    } catch(Exception&) {
        printf("Running try_but_dont_catch::catch(Exception)\n");
    } catch(Fake_Exception&) {
        printf("Running try_but_dont_catch::catch(Fake_Exception)\n");
    }

    printf("catchit handled an exception and resumed execution");
}

extern "C" {
    void seppuku() {
        catchit();
    }
}
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v02).

Just like before, we have our seppuku function linking the C world with the C++ world, only this time we have added some more function calls to make our stack more interesting, plus we have added a bunch of try/catch blocks so we can analyze how does libstdc++ handles them.

And just like before, we get some linker errors about missing ABI functions:

```c++
> g++ -c -o throw.o -O0 -ggdb throw.cpp
> gcc main.o throw.o mycppabi.o -O0 -ggdb -o app
throw.o: In function `try_but_dont_catch():
throw.cpp:12: undefined reference to `__cxa_begin_catch
throw.cpp:12: undefined reference to `__cxa_end_catch

throw.o: In function `catchit():
throw.cpp:20: undefined reference to `__cxa_begin_catch
throw.cpp:20: undefined reference to `__cxa_end_catch

throw.o:(.eh_frame+0x47): undefined reference to `__gxx_personality_v0

collect2: ld returned 1 exit status
```

Again we see a lot of interesting stuff going on here. The calls to **\_\_cxa\_begin\_catch** and **\_\_cxa\_end\_catch** are probably something we could have expected: we don't know what they are yet, but we can presume they are the equivalent of the **throw/\_\_cxa\_allocate/throw** conversions (you do remember that our throw keyword got translated to a pair of **\_\_cxa\_allocate\_exception** and **\_\_cxa\_throw functions**, right?). The **\_\_gxx\_personality\_v0** thing is new, though, and the central piece of the next few articles.

What does the personality function do? We already said something about it on the introduction to this series but we will be looking into it with some more detail next time, together with our new two friends, **\_\_cxa\_begin\_catch** and **\_\_cxa\_end\_catch**.

