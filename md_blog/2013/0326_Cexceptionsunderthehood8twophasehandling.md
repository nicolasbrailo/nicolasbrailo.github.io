# C++ exceptions under the hood 8: two-phase handling

@meta publishDatetime 2013-03-26T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/03/c-exceptions-under-hood-8-two-phase.html

We finished last chapter on the series about C++ exceptions by adding a personality function that \_Unwind\_ was able to call. It didn't do much but there it was. The ABI we have been implementing can now throw exceptions and the catch is already halfway implemented, but the personality function needed to properly choose the catch block (landing pad) is bit dumb so far. Let's start this new chapter by trying to understand what are the parameters that the personality function receives and next time we'll begin adding some real behavior to \_\_gxx\_personality\_v0: when \_\_gxx\_personality\_v0 is called we should say "yes, this stack frame can indeed handle this exception".

We already said we won't care for the version or the exceptionClass for our mini ABI. Let's ignore the context too, for now: we'll just handle every exception with the first stack frame above the function throwing; note this implies there must be a try/catch block on the function immediately above the throwing function, otherwise everything will break. This also implies the catch will ignore its exception specification, effectively turning it into a catch(...). How do we let \_Unwind\_ know we want to handle the current exception?

\_Unwind\_Reason\_Code is the return value from the personality functions; this tells \_Unwind\_ whether we found a landing pad to handle the exception or not. Let's implement our personality function to return \_URC\_HANDLER\_FOUND then, and see what happens:

```c++
alloc ex 1
__cxa_throw called
Personality function FTW
Personality function FTW
no one handled __cxa_throw, terminate!
```

See that? We told \_Unwind\_ we found a handler, and it called the personality function yet again! What is going on there?

Remember the action parameter? That's how \_Unwind\_ tells us what he is expecting, and that is because the exception catching is handled in two phases: lookup and cleanup (or \_UA\_SEARCH\_PHASE and \_UA\_CLEANUP\_PHASE). Let's go again over our exception throwing and catching recipe:

* \_\_cxa\_throw/\_\_cxa\_allocate\_exception will create an exception and forward it to a lower-level unwind library by calling \_Unwind\_RaiseException
* Unwind will use CFI to know which functions are on the stack (ie to know how to start the stack unwinding)
* Each function has have an LSDA (language specific data area) part, added into something called ".gcc\_except\_table"
* Unwind will try to locate a landing pad for the exception:
	+ Unwind will call the personality function with the action \_UA\_SEARCH\_PHASE and a context pointing to the current stack frame.
	+ The personality function will check if the current stack frame can handle the exception being thrown by analyzing the LSDA.
	+ If the exception can be handled it will return \_URC\_HANDLER\_FOUND.
	+ If the exception can not be handled it will return \_URC\_CONTINUE\_UNWIND and Unwind will then try the next stack frame.
* If no landing pad was found, the default exception handler will be called (normally std::terminate).
* If a landing pad was found:
	+ Unwind will iterate the stack again, calling the personality function with the action \_UA\_CLEANUP\_PHASE.
	+ The personality function will check if it can handle the current exception again:
	+ If this frame can't handle the exception it will then run a cleanup function described by the LSDA and tell Unwind to continue with the next frame (this is actually a very important step: the cleanup function will run the destructor of all the objects allocated in this stack frame!)
	+ If this frame can handle the exception, don't run any cleanup code: tell Unwind we want to resume execution on this landing pad.

There are two important bits of information to note here:
1. Running a two-phase exception handling procedure means that in case no handler was found then the default exception handler can get the original exception's stack trace (if we were to unwind the stack as we go it would get no stack trace, or we would need to keep a copy of it somehow!).
2. Running a \_UA\_CLEANUP\_PHASE and calling a second time each frame, even though we already know the frame that will handle the exception, is also really important: the personality function will take this chance to run all the destructors for objects built on this scope. It is what makes RAII an exception safe idiom!

Now that we understand how the catch lookup phase works we can continue our personality function implementation. The next time.

