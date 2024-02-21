# Scope ending in C++

@meta publishDatetime 2015-03-31T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/03/scope-ending-in-c.html

Is the following code valid C++?

```c++
const int x = 42;
void f() {
    int x[x];
    x[24] = 0;
}
```

Unfortunately, it is. According to 3.3.2 in the standard, a definition is available in a child scope up to the point where it's shadowed, and that means "x" will first be interpreted as the global const int, being an index for a vector named "x". Any new references to "x" will point to the new declaration.

Fun stuff, right?


# Comments

---
## In reply to this post, Jason Turner commented @ 2015-04-08T14:30:09.000+02:00:

It's issues like this that make me recommend enabling warnings of shadow variables, if your compiler supports it (https://github.com/lefticus/cppbestpractices/blob/master/02-Use\_the\_Tools\_Available.md#compilers)

Original [published here](md_blog/2015/0331_ScopeendinginC.md).

---
## In reply to this post, [nicolasbrailo/](md_blog/aboutme.md) commented @ 2015-04-08T14:42:53.000+02:00:

This weird construct actually has a good reason to be, as someone pointed out to me in twitter, namely to be used when writing constructors. So, while it has some reasonable use cases it can also be abused in amusing and unexpected ways. And indeed we should rely in our tools to let us know when we do this kind of things.

Original [published here](md_blog/2015/0331_ScopeendinginC.md).
