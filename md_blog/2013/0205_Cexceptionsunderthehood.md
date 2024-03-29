# C++ exceptions under the hood

@meta publishDatetime 2013-02-05T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/02/c-exceptions-under-hood.html

Everyone knows that good exception handling is hard. Reasons for this abound, in every single layer of an exception "lifetime": it's hard to write exception safe code, an exception might be thrown from unexpected places (pun intended!), it's can be complicated to understand badly designed exception hierarchies, it's slow because a lot of voodoo is happening under the hood, it's dangerous because improperly throwing an exception might call the unforgiving std::terminate. And although anyone who might have had to battle an "exceptional" program might know this, the reasons for this mess are not widespread knowledge.

The first question we need to ask ourselves is then, how does it all work. This is the first article on a long series, in which I'll be writing about how exceptions are implemented under the hood in c++ (actually, c++ compiled with gcc on x86 platforms but this might apply to other platforms too). On these articles the process of throwing and catching an exception will be explained with quite a lot of detail, but for the impatient people here is a small brief of all the articles that will follow: how is an exception thrown in gcc/x86:

1. When we write a throw statement, the compiler will translate it into a pair of calls into libstdc++ functions that allocate the exception and then start the stack unwinding process by calling libstdc.
2. For each catch statement, the compiler will write some special information after the method's body, a table of exceptions this method can catch and a cleanup table (more on the cleanup table later).
3. As the unwinder goes through the stack it will call a special function provided by libstdc++ (called personality routine) that checks for each function in the stack which exceptions can be caught.
4. If no matching catch is found for the exception, std::terminate is called.
5. If a matching catch is found, the unwinder now starts again on the top of the stack.
6. As the unwinder goes through the stack a second time it will ask the personality routine to perform a cleanup for this method.
7. The personality routine will check the cleanup table on the current method. If there are any cleanup actions to be run, it will "jump" into the current stack frame and run the cleanup code. This will run the destructor for each object allocated at the current scope.
8. Once the unwinder reaches the frame in the stack that can handle the exception it will jump into the proper catch statement.
9. Upon finishing the execution of the catch statement, a cleanup function will be called to release the memory held for the exception.

This already looks quite complicated and we haven't even started; that was but a short and inaccurate description of all the complexities needed to handle an exception.

To learn about all the details that happen under the hood on the next article we will start to implement our own mini libstdlibc++. Not all of it though, only the part that handles exceptions. Actually not even all of that, only the bare minimum we need to make a simple throw/catch statement work. Some assembly will be needed, but nothing too fancy. A lot of patience will be required, I'm afraid.

If you are too curious and want to start reading about exception handling implementation then you can start [here](md_blog/youfoundadeadlink.md), for a full specification of what we are going to implement on the next few articles. I'll try to make these articles a bit more didactic and easier to follow though, so see you next time to start our ABI!

###### \*\* Disclaimer note: I'm in no way versed on the magic going on when an exception is thrown. These series will be about trying to demystify the stuff going on under the hood and learning something in the process, and while I hope some of it will be correct I have no doubts there will be a lot of subtleties not quite right. Let me know if you think I should correct something \*\*

