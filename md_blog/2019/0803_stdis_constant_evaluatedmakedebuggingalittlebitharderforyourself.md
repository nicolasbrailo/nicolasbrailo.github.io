# std::is_constant_evaluated: make debugging a little bit harder for yourself!

@meta publishDatetime 2019-08-03T13:25:00.001+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2019/08/stdisconstantevaluated-make-debugging_3.html

Let's pretend you find this:

```c++
const int a = foo();
int b = foo();
```

Would you be tempted to assume that a==b, always? I would. What if 'foo' actually depends on a global variable, and its return value depends on that global setting? Suddenly the code above will raise a few eyebrows in a code review session.

Coming to your friendly c++20 standard now:

```c++
constexpr int foo() {
    return (std::is_constant_evaluated())? 42 : 24;
}

bool a() {
    const int x = foo();
    return x == foo();
}
```

I'm sure with careful usage, is\_constant\_evaluated will allow library writers to create much more performant code. I'm also sure I'll lose a lot of hair trying to figure out why my debug code (`cout << foo()`, anyone?) prints different values than my `production` code.


# Comments

---
## In reply to [this post](), [aiusepsi]() commented @ 2019-08-03T18:58:11.000+02:00:

From what I can glean from the standard, there's no debug/release mode difference here. In either case, the compiler is required to constant-evaluate foo() when initialising x. From reading P0595R2 it seems like they tightened up the semantics somewhat to make sure that this was the case.

To test the theory, a program compiled with Clang produces the same result in both -O0 and -O3 modes: https://godbolt.org/z/BpG2Ob

Original [published here](md_blog/2019/0803_stdis_constant_evaluatedmakedebuggingalittlebitharderforyourself.md).

---
## In reply to [this post](), [nicolasbrailo](/md_blog) commented @ 2019-08-03T20:10:45.000+02:00:

Thanks aiusepsi! I think that somewhat misses the point of the article though: I'm not saying -O levels will provide different behavior, I'm worried that code I use to debug, such as "cout << foo()" will have different behavior to "const int x = foo()". If there ever is a bug that causes foo to behave differently due to is\_const\_eval, I'll take hours to find it out.

The wording in the article might be a bit poor, I think... Probably a good idea if I clarify the last sentence of the article to reflect this!

Original [published here](md_blog/2019/0803_stdis_constant_evaluatedmakedebuggingalittlebitharderforyourself.md).
