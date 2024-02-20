# POD types in C++

@meta publishDatetime 2010-04-07T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/04/pod-types-in-c.html

Let's say you have something like this:

```c++
typedef int A;
void x(A);

struct B {
   int b;
   B(int b) : b(b) {}
   virtual void x() = 0;
};
```

Regardless of what does function x do, what's the difference between A and B? Without getting too picky and leaving semantics aside, we may say there is no difference in behaviour. There's however a small gotcha there, which is completely irrelevant for C++ code but can bite you in the ass when interfacing C and C++. Would this work?

```c++
{
   A a; B b;

   // Case 1
   A *p = malloc(sizeof(A));
   memcpy(p, &amp;a, sizeof(A));

   // Case 2
   B *p = malloc(sizeof(B));
   memcpy(p, &amp;b, sizeof(B));
}
```

The answer is perhaps. In most cases it would work, in some cases it won't. C++ uses a vtable to dispatch virtual methods, so if I were to perform a memcpy of an object, then store it on disk and retrieve it afterwards I don't have any guarantees the vtable will still be valid. And that's leaving aside the case of objects having dynamically allocated memory themselves.

Wrapping up, the difference between A and B is simple: A is a POD (Plain Old Datatype, POJO for you Java guys) type, B is not. There are some other things non-POD objects can't do, for example this is invalid:

```c++
   B b;
   printf("%i", b);
```

Not only it's invalid: g++ emits a warning and then crashes on runtime (this is related to the use of vargs in functions with "..." params, but it's not important now).

Knowing what a POD object is, what would you do now if you had to persist (serialize) an std::string-like object? That's a topic for the next post.


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Cool C++0X features III: Variadic templates, a fix for varargs](md_blog/2011/0426_CoolC0XfeaturesIIIVariadictemplatesafixforvarargs.md) commented @ 2011-04-26T09:05:06.000+02:00:

[...] POD types support [...]

Original [published here](md_blog/2010/0407_PODtypesinC.md).
