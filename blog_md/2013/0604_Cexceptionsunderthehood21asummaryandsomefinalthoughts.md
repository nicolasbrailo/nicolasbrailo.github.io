# C++ exceptions under the hood 21: a summary and some final thoughts

@meta publishDatetime 2013-06-04T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/06/c-exceptions-under-hood-21-summary-and.html

After writing twenty some articles about C++ low level exception handling, it's time for a recap and some final thoughts. What did we learn, how is an exception thrown and how is it caught?

Leaving aside the ugly details of reading the .gcc\_except\_table, which were probably the biggest part of these articles, we could summarize the whole process like this:

1. The C++ compiler actually does rather little to handle an exception, most of the magic actually happens in libstdc++.
2. There are a few things the compiler does, though. Namely:
	* It creates the CFI information to unwind the stack.
	* It creates something called .gcc\_except\_table with information about landing pads (try/catch blocks). Kind of like reflexion info.
	* When we write a throw statement, the compiler will translate it into a pair of calls into libstdc++ functions that allocate the exception and then start the stack unwinding process by calling libstdc.
3. When an exception is thrown at runtime \_\_cxa\_throw will be called, which will delegate the stack unwinding to libstdc.
4. As the unwinder goes through the stack it will call a special function provided by libstdc++ (called personality routine) that checks for each function in the stack which exceptions can be caught.
5. If no matching catch is found for the exception, std::terminate is called.
6. If a matching catch is found, the unwinder now starts again on the top of the stack.
7. As the unwinder goes through the stack a second time it will ask the personality routine to perform a cleanup for this method.
8. The personality routine will check the .gcc\_except\_table for the current method. If there are any cleanup actions to be run, it will "jump" into the current stack frame and run the cleanup code. This will run the destructor for each object allocated at the current scope.
9. Once the unwinder reaches the frame in the stack that can handle the exception it will jump into the proper catch statement.
10. Upon finishing the execution of the catch statement, a cleanup function will be called to release the memory held for the exception.

Having learned how exceptions work we are now in a position to better answer why it's hard to write exception safe code.

Exceptions, while conceptually clean, are pretty much "spooky action at a distance". Throwing and catching an exception involves a certain degree of reflexion (in the sense that a program must analyze itself) which is not common for C++ applications.

Even if we talk about higher level languages, throwing an exception means we cannot rely on our understanding of how a normal program execution flow should work anymore: we are used to a pretty much linear execution flow with some conditional operators branching or calling other functions. With an exception, this no longer holds true: an entity which is not the code of our application is in control of the execution, and it goes around the program executing certain blocks of code here and there without following any of the normal rules. The instruction pointer gets changed by each landing pad, the stack is unwinded in ways we can't control and, ultimately, a lot of magic happens under the hood.

To summarize it even more: exceptions are hard simply because they break the natural flow of a program as we understand it. This does not mean they are intrinsically bad as properly used exceptions can surely lead to cleaner code, but they should always be used with care.

