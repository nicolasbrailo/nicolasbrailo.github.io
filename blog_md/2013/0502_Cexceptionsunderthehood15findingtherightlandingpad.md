# C++ exceptions under the hood 15: finding the right landing pad

@meta publishDatetime 2013-05-02T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/05/c-exceptions-under-hood-15-finding.html

This is now the 15th installment in what's becoming the longest series I've written for this blog; we have so far learned how exceptions are thrown and we have written a personality function capable of, with some sort of reflexion, detecting where the catch-blocks are (landing pads, in exception speak). In the last article we wrote a personality function that can handle exceptions, but it does so only with the first landing pad of the first call frame in the stack. Let's improve that a little bit, let's make our personality function capable of choosing the right landing pad in a function with multiple landing pads.

In a TDD fashion we can first build a test for our ABI. Let's modify our test program, throw.cpp, to have two try/catch blocks:

```c++
#include <stdio.h>
#include "throw.h"

struct Fake_Exception {};

void raise() {
    throw Exception();
}

void try_but_dont_catch() {
    try {
        printf("Running a try which will never throw.\n");
    } catch(Fake_Exception&) {
        printf("Exception caught... with the wrong catch!\n");
    }

    try {
        raise();
    } catch(Fake_Exception&) {
        printf("Caught a Fake_Exception!\n");
    }

    printf("try_but_dont_catch handled the exception\n");
}

void catchit() {
    try {
        try_but_dont_catch();
    } catch(Fake_Exception&) {
        printf("Caught a Fake_Exception!\n");
    } catch(Exception&) {
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

Before you test it, try to think about what will happen upon running this test. Focus on the try\_but\_dont\_catch function: the first try/catch block will not throw, then the second block will throw. Since our ABI is quite dumb the first block will handle the second block's exception. What will happen after the first block has finished handling the exception? The execution will resume from where the catch/try ends, thus entering again on the second try/catch block. Infinite loop! We have reinvented yet again a very complicated while(true).

Let's use our knowledge of the start/length fields in the call site table (LSDA) to properly choose our landing pad. For this we will need to know what the instruction pointer was when the exception was thrown, and we can do this with an \_Unwind\_ function we already know: \_Unwind\_GetIP. To understand what \_Unwind\_GetIP will return let's see an example:

```c++
void f1() {}
void f2() { throw 1; }
void f3() {}

void foo() {
L1:
    try{ f1(); } catch(...) {}
L2:
    try{ f2(); } catch(...) {}
L3:
    try{ f3(); } catch(...) {}
}
```

In this case our personality function would be called for the catch block for f2 and the stack would be like this:

```
+------------------------------+
|   IP: f2  stack frame: f2    |
+------------------------------+
|   IP: L3  stack frame: foo   |
+------------------------------+
```

Note that IP will be at L3 but the exception will be thrown in L2; this is because the IP will point to the next instruction to execute. This also means we need to substract one if we need to find the IP where an exception was thrown, otherwise the result from \_Unwind\_GetIP would not be in the range of our landing pad. Back to our personality function:

```c++
_Unwind_Reason_Code __gxx_personality_v0 (
                             int version,
                             _Unwind_Action actions,
                             uint64_t exceptionClass,
                             _Unwind_Exception* unwind_exception,
                             _Unwind_Context* context)
{
    if (actions & _UA_SEARCH_PHASE)
    {
        printf("Personality function, lookup phase\n");
        return _URC_HANDLER_FOUND;
    } else if (actions & _UA_CLEANUP_PHASE) {
        printf("Personality function, cleanup\n");

        // Calculate what the instruction pointer was just before the
        // exception was thrown for this stack frame
        uintptr_t throw_ip = _Unwind_GetIP(context) - 1;

        // Pointer to the beginning of the raw LSDA
        LSDA_ptr lsda = (uint8_t*)_Unwind_GetLanguageSpecificData(context);

        // Read LSDA headerfor the LSDA
        LSDA_Header header(&lsda);

        // Read the LSDA CS header
        LSDA_CS_Header cs_header(&lsda);

        // Calculate where the end of the LSDA CS table is
        const LSDA_ptr lsda_cs_table_end = lsda + cs_header.length;

        // Loop through each entry in the CS table
        while (lsda < lsda_cs_table_end)
        {
            LSDA_CS cs(&lsda);

            // If there's no LP we can't handle this exception; move on
            if (not cs.lp) continue;

            uintptr_t func_start = _Unwind_GetRegionStart(context);

            // Calculate the range of the instruction pointer valid for this
            // landing pad; if this LP can handle the current exception then
            // the IP for this stack frame must be in this range
            uintptr_t try_start = func_start + cs.start;
            uintptr_t try_end = func_start + cs.start + cs.len;

            // Check if this is the correct LP for the current try block
            if (throw_ip < try_start) continue;
            if (throw_ip > try_end) continue;

            // We found a landing pad for this exception; resume execution
            int r0 = __builtin_eh_return_data_regno(0);
            int r1 = __builtin_eh_return_data_regno(1);

            _Unwind_SetGR(context, r0, (uintptr_t)(unwind_exception));
            // Note the following code hardcodes the exception type;
            // we'll fix that later on
            _Unwind_SetGR(context, r1, (uintptr_t)(1));

            _Unwind_SetIP(context, func_start + cs.lp);
            break;
        }

        return _URC_INSTALL_CONTEXT;
    } else {
        printf("Personality function, error\n");
        return _URC_FATAL_PHASE1_ERROR;
    }
}
```

As usual: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v07).

Try the example again and voila, no more infinite loop! That was a simple change and we can now choose the correct landing pad. Next time we'll try to make our personality function also pick the correct stack frame instead of choosing the first one.

