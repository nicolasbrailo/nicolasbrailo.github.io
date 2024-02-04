# C++ exceptions under the hood 18: getting the right stack frame

@meta publishDatetime 2013-05-16T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/05/c-exceptions-under-hood-18-getting.html

Our latest personality function knows whether it can handle an exception or not (assuming there is only one catch statement per try block and assuming no inheritance is used) but to make this knowledge useful, we have first to check if the exception we can handle matches the exception being thrown. Let's try to do this.

Of course, we need first to know the exception type. To do this we need to save the exception type when **\_\_cxa\_throw** is called (this is the chance the ABI gives us to set all our custom data):

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v09).

```c++
void __cxa_throw(void* thrown_exception,
                 std::type_info *tinfo,
                 void (*dest)(void*))
{
    __cxa_exception *header = ((__cxa_exception *) thrown_exception - 1);

    // We need to save the type info in the exception header _Unwind_ will
    // receive, otherwise we won&#x27;t be able to know it when unwinding
    header-&gt;exceptionType = tinfo;

    _Unwind_RaiseException(&amp;header-&gt;unwindHeader);
}
```

And now we can read the exception type in our personality function and easily check if the exception types match (the exception names are C++ strings, so doing a == is enough to check this:

```c++
// Get the type of the exception we can handle
const void* catch_type_info = lsda.types_table_start[ -1 * type_index ];
const std::type_info *catch_ti = (const std::type_info *) catch_type_info;

// Get the type of the original exception being thrown
__cxa_exception* exception_header = (__cxa_exception*)(unwind_exception+1) - 1;
std::type_info *org_ex_type = exception_header-&gt;exceptionType;

printf("%s thrown, catch handles %s\n",
            org_ex_type-&gt;name(),
            catch_ti-&gt;name());

// Check if the exception being thrown is of the same type
// than the exception we can handle
if (org_ex_type-&gt;name() != catch_ti-&gt;name())
    continue;
```

Check [here](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v09) for the full source with the new changes.

Of course there would be a problem if we add that (can you see it?). If the exception is thrown in two phases and we said in the first one we would handle it, then we can't say on the second one we don't want it anymore. I don't know if \_Unwind\_ handles this case according to any documentation but this is most likely calling upon undefined behavior, so just saying we'll handle everything is no longer enough.

Since we gave our personality function the ability to know if the landing pad can handle the exception being thrown we have been lying to \_Unwind\_ about which exceptions we can handle; even though we said we handle all of them on [our ABI 9](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v09), the truth is that we didn't know whether we would be able to handle it. That's easy to change, we can do something like this:

```c++
_Unwind_Reason_Code __gxx_personality_v0 (...)
{
    printf("Personality function, searching for handler\n");

    // ...

    foreach (call site entry in lsda)
    {
        if (call site entry.not_good()) continue;

        // We found a landing pad for this exception; resume execution

        // If we are on search phase, tell _Unwind_ we can handle this one
        if (actions &amp; _UA_SEARCH_PHASE) return _URC_HANDLER_FOUND;

        // If we are not on search phase then we are on _UA_CLEANUP_PHASE
        /* set everything so the landing pad can run */

        return _URC_INSTALL_CONTEXT;
    }

    return _URC_CONTINUE_UNWIND;
}
```

As usual, check the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v10).

So, what would we get if we run the personality function with this change? Fail, that's what we'd get! Remember our throwing functions? This one should catch our exception:

```c++
void catchit() {
    try {
        try_but_dont_catch();
    } catch(Fake_Exception&amp;) {
        printf("Caught a Fake_Exception!\n");
    } catch(Exception&amp;) {
        printf("Caught an Exception!\n");
    }

    printf("catchit handled the exception\n");
}
```

Unfortunately, our personality function only checks for the first type the landing pad can handle. If we delete the Fake\_Exception catch block and try it again, though, we'd get a different story: finally, success! Our personality function can now select the correct catch in the correct frame, provided there's no try block with multiple catches.

Next time we'll be further improving this.

