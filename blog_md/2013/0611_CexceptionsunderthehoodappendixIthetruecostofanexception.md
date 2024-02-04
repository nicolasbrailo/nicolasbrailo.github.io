# C++ exceptions under the hood appendix I: the true cost of an exception

@meta publishDatetime 2013-06-11T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/06/c-exceptions-under-hood-appendix-i-true.html

Remember a long way back, when the series on exception handling was just started, that I mentioned these articles would only apply for gcc/x86? There is a reason for that since not all compilers implement exception handling the same way. In particular, there are two major ways of doing it:

* With a lookup table and some metadata, like the Itanium ABI specifies; this is what we talked about.
* Sj/Lj (ARM): Registering exception handling information upon entering or exiting a method.

The way gcc (and many other compilers) implement this ABI on x86 is by using metadata (the .gcc\_except\_table and the CFI). Although it's rather difficult to parse, and it might take a long time to parse this on runtime when an exception is thrown, it has a great upside: if no exceptions are thrown then there's no setup cost to be paid. This is called "Zero-cost exception handling" because a normal execution, where no exceptions are thrown, no penalty is payed. The performance is exactly the same we would have as if we had specified nothrow. That's right, leaving code locality & caching issues aside, using exceptions or not has no performance penalty unless an exception is actually thrown. This is a great advantage and it goes in line with C++ philosophy of having no-cost for non used features.

When using the noexcept specification while declaring a method (or an empty throw specifier, pre C++11) in the setup used for these articles the compiler would omit the creation of the .gcc\_except\_table. This will make the code more compact and it will improve the cache usage, but it's very unlikely that will have a noticeable impact on the performance of the application.

If we talk about ARM, Sj/Lj seems to be the default option (I'm sure there's a good reason for that but I don't have enough experience with ARM to know it). This exception handling method is based on registering exception handling information upon entering or exiting a method which either uses exceptions or requires a cleanup if an exception is thrown. This will result in a quicker exception handling, but the setup cost is payed whether an exception is thrown or not.

If you're interested on reading more about sjlj and zero cost exception handling [LLVM has great documentation](http://llvm.org/docs/ExceptionHandling.html).


---
## In reply to [this post](), [N]() commented @ 2013-06-11T23:31:26.000+02:00:

Nice information, although I have a small, nitpicky note on the language: "payed" is an obsolete form, unless you mean to use it in, e.g., nautical context, as in "to let (a ship) fall off to leeward."
I'm guessing you probably mean "paid" :-)
// http://dictionary.reference.com/browse/payed
// http://en.wiktionary.org/wiki/payed

Original [published here](/blog_md/2013/0611_CexceptionsunderthehoodappendixIthetruecostofanexception.md).

---
## In reply to [this post](), [nicolasbrailo](/blog_md) commented @ 2013-06-12T09:37:49.000+02:00:

Corrected, thanks!

Original [published here](/blog_md/2013/0611_CexceptionsunderthehoodappendixIthetruecostofanexception.md).
