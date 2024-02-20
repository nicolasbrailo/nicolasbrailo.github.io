# Throwing destructors

@meta publishDatetime 2011-09-20T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/09/throwing-destructors.html

We already know what happens when you [throw from a constructor](/blog_md/2010/0225_CCompositeobjectsandthrowingconstructors.md). Ending up with a half built object is not good, but suppose we do manage to build one correctly. What happens if we [throw in a destructor](/blog_md/2010/0727_DesignPatternsCIdiomRAII.md) instead? The results are usually much worse, with a very real possibility of having your program terminated. Read on for a brief explanation on the perils of throwing constructors.

So, according to RAII pattern, resource deallocation should occur during the destructor, yet resource freeing is not exempt of possible errors. How would you notify of an error condition?

* First error handling choice, you notify /dev/null of the error condition. Best case, you may log the error somewhere, but you can't do anything about it, you end up ignoring it. Not good, usually you'll want to do something about the error condition, even more if it's transient.
* Second choice, throw. The user (of the class) will know something has gone horribly wrong. This option seems better, yet it has some disadvantages too (just as it happened with [throwing destructors](/blog_md/2010/0225_CCompositeobjectsandthrowingconstructors.md); when is an object completely deleted? is it ever deleted if an exception is thrown whilst running?)

Yet the worst part is not resource leaking through half destroyed objects, the worst part is having your program call std::abort.

Think of it this way: when an exception is active, the stack is unwind, i.e. the call stack is traversed backwards until a function which can handle the exception is found. And you just can't unwind the stack while unwinding the stack (you'd need a stack of stacks) so the reasonable thing to do is call std::abort.

So, what can you do about it? Go to your favorite jobs posting site and start searching for a PHP position, you'll sleep better at nights.

