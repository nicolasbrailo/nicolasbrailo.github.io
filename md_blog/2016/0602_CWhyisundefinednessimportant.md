# C++: Why is undefinedness important

@meta publishDatetime 2016-06-02T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/06/c-why-is-undefinedness-important.html

Let's start with an example:

```c++
int *x = (int*) NULL;
x[0] = 42;
```

Luckily so far I've never seen anyone argue about this one: we all know we're dealing with undefined behavior and that it's bad. Things get a bit more tricky when the example is not so trivial.

### C's abstract machine

In a way, C and C++ describe a "virtual machine". This is what the standard defines: what kind of operations are valid in this VM. This VM resembles an old single-thread mono-processor architecture. Most often, the code will run in a modern architecture that will resemble very little the design of C's VM. "New" features (like caching, vectorization, atomics, pipelining, etc) implemented by the target architecture make the process of mapping our code (in the VM that C defines) much more difficult. The compiler needs to map instructions in C's simple architecture to a much (\*MUCH\*) more complex design. To do that, it needs to analyze the code to guarantee certain constrains are met.

Let's see how these constrains and undefined behavior relate to each other with this snippet:

```c++
template <typename T>
    bool always_true(T x) {
    return (x < x+1);
}
```

From a math perspective, and assuming that T is a numeric type, always\_true should always return true. Is that the case for C's virtual machine?

If we call always\_true with a type like "unsigned int", then x+1 may overflow and wrap around. This is fine because unsigned int's are allowed to wrap around. What happens if instead we use a signed type? Things get more interesting.

Signed types are not allowed to overflow. If they do, the standard says the behavior is undefined. And the standard also says that our program can not invoke undefined behavior. This is a very important phrase: the standard says undefined behavior can NOT occur. There is no "if it does": it just can't, so the compiler will assume that UB will never happen. What if it does happen? Nasal demons, that's what!

Knowing that UB can't happen, and in our example above, the compiler can assume that x+1 will never overflow. If it will never overflow, (x<x+1) will always be true.

The compiler, by analyzing our program, can detect what conditions might trigger undefined behavior. By knowing that undefined behavior is not allowed, it can assume those conditions will never happen. That's why, for the sample above, any optimizing-compiler will just produce code similar to "return true", at least for -O2.

Undefined behavior is not (only) to make programmer's lives miserable, it actually is needed to create optimizing compilers.


# Comments

---
## In reply to this post, [anon12]() commented @ 2016-06-02T12:54:44.000+02:00:

"From a math perspective, and assuming that T is a numeric type, always\_true should always return true"

return (x > x + 1 ) always returns true !!!

Are you kidding me ?

Original [published here](md_blog/2016/0602_CWhyisundefinednessimportant.md).

---
## In reply to this post, [Undefined, implementation defined and unspecified behaviors in C++ - Native Coding](md_blog/youfoundadeadlink.md) commented @ 2016-06-02T23:47:33.000+02:00:

[…] And another explanation here : /md_blog/2016/06/02/c-why-is-undefinedness-important/ […]

Original [published here](md_blog/2016/0602_CWhyisundefinednessimportant.md).

---
## In reply to this post, [nicolasbrailo/](md_blog/aboutme.md) commented @ 2016-06-03T17:30:39.000+02:00:

That's a very trollish way of saying "careful with typos" but thanks for reporting nonetheless, anon. Fixed.

Original [published here](md_blog/2016/0602_CWhyisundefinednessimportant.md).
