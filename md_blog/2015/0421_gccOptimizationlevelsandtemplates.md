# gcc: Optimization levels and templates

@meta publishDatetime 2015-04-21T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/04/gcc-optimization-levels-and-templates.html

Analyzing the assembly output for template devices can be a bit discouragging at times, specially when we spend hours trying to tune a mean looking template class only to find out the compiler is not able to reduce it's value like we expected. But hold on, before throwing all your templates away you might want to figure out why they are not optimized.

Let's start with a simple example: a template device to return the next power of 2:

```c++
template <int n, long curr_pow, bool stop>
struct Impl_Next_POW2 {
    static const bool is_smaller = n < curr_pow;
    static const long next_pow = _Next_POW2<n, curr_pow*2, is_smaller>::pow;
    static const long pow = is_smaller? curr_pow : next_pow;
};

template <int n, long curr_pow>
struct Impl_Next_POW2<n, curr_pow, true> {
    // This specializtion is important to stop the expansion
    static const long pow = curr_pow;
};

template <int n>
struct Next_POW2 {
    // Just a wrapper for _Next_POW2, to hide away some
    // implementation details
    static const long pow = _Next_POW2<n, 1, false>::pow;
};
```

Gcc can easily optimize that away, if you compile with "g++ foo.cpp -c -S -o /dev/stdout" you'll just see the whole thing is replaced by a compile time constant. Let's make gcc's life a bit more complicated now:

```c++
template <int n, long curr_pow, bool stop>
struct Impl_Next_POW2 {
    static long get_pow() {
        static const bool is_smaller = n < curr_pow;
        return is_smaller?
                    curr_pow :
                    _Next_POW2<n, curr_pow*2, is_smaller>::get_pow();
    }
};

template <int n, long curr_pow>
struct Impl_Next_POW2<n, curr_pow, true> {
    static long get_pow() {
        return curr_pow;
    }
};

template <int n>
struct Next_POW2 {
    static long get_pow() {
        return _Next_POW2<n, 1, false>::get_pow();
    }
};
```

Same code but instead of using plain static values we wrap everything in a method. Compile with "g++ foo.cpp -c -S -fverbose-asm -o /dev/stdout | c++filt" and you'll see something like this now:

```c++
main:
    call    Next_POW2<17>::get_pow()

Next_POW2<17>::get_pow():
    call    _Next_POW2<17, 1l, false>::get_pow()

_Next_POW2<17, 1l, false>::get_pow():
    call    _Next_POW2<17, 2l, false>::get_pow()

_Next_POW2<17, 2l, false>::get_pow():
    call    _Next_POW2<17, 4l, false>::get_pow()

_Next_POW2<17, 4l, false>::get_pow():
    call    _Next_POW2<17, 8l, false>::get_pow()

_Next_POW2<17, 8l, false>::get_pow():
    call    _Next_POW2<17, 16l, false>::get_pow()

_Next_POW2<17, 16l, false>::get_pow():
    call    _Next_POW2<17, 32l, false>::get_pow()

_Next_POW2<17, 32l, false>::get_pow():
    movl    $32, %eax    #, D.2171

```

What went wrong? It's very clear for us the whole thing is just a chain of calls which could be replaced by the last one, however that information is now only available if you "inspect" the body of each function, and this is something the template instanciator (at least in gcc) can't do. Luckily you just need to enable optimizations, -O1 is enough, to have gcc output the reduced version again.

Keep it in mind for the next time you're optimizing your code with template metaprogramming: some times the template expander needs some help from the optimizer too.


# Comments

---
## In reply to this post, [Griwes](md_blog/youfoundadeadlink.md) commented @ 2015-04-22T10:44:15.000+02:00:

So... you don't like that GCC doesn't optimize when you don't pass optimization flags or what?

Original [published here](md_blog/2015/0421_gccOptimizationlevelsandtemplates.md).

---
## In reply to this post, [nicolasbrailo](/md_blog) commented @ 2015-04-22T10:52:45.000+02:00:

While in hindsight it may be obvious that optimization and template instantiation are two different and orthogonal features, I've seen many people assume that "templates" means "optimal code". It's always good to understand how different features of a compiler interact.

Original [published here](md_blog/2015/0421_gccOptimizationlevelsandtemplates.md).

---
## In reply to this post, [Eric]() commented @ 2015-04-22T14:21:43.000+02:00:

You should stop using reserved identifiers.

Original [published here](md_blog/2015/0421_gccOptimizationlevelsandtemplates.md).

---
## In reply to this post, [nicolasbrailo](/md_blog) commented @ 2015-04-23T14:02:57.000+02:00:

Indeed, good observation. I'll probably replace the underscores once I get some free time.

Original [published here](md_blog/2015/0421_gccOptimizationlevelsandtemplates.md).

---
## In reply to this post, [robdesbois](md_blog/youfoundadeadlink.md) commented @ 2015-05-07T10:13:44.000+02:00:

I'm not sure this is the optimization level affecting template expansion at this point: collapsing the get\_pow calls isn't an optimization specific to templates but general to any function calls.

It would be interesting to see if making the get\_pow calls constexpr caused collapsing to take place even without optimization enabled.

Original [published here](md_blog/2015/0421_gccOptimizationlevelsandtemplates.md).

---
## In reply to this post, [nicolasbrailo](/md_blog) commented @ 2015-05-27T11:44:39.000+02:00:

Indeed that's (more or less) the point of the article: templates != optimization. I haven't thought about playing around with constexpr's, I guess mostly because I'm limited to 03 nowadays due to my job. I'll probably try it out some day.

Original [published here](md_blog/2015/0421_gccOptimizationlevelsandtemplates.md).
