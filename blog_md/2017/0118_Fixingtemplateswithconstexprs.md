# Fixing templates with constexpr's

@meta publishDatetime 2017-01-18T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2017/01/fixing-templates-with-constexpr.html

For my hundredth (and a bit) c++ post I decided to do something I never did before: fix my old code!

A long time ago I wrote about template metaprogramming devices. There, I tried to explain that many atrocities have been commited in the name of performance and "compile time evaluation". Template metaprogramming is probably one of the worse culprits of job security. Its (ab)use can create monstrosities, all in the name of runtime performance. Like, for example, my [template device to calculate e](/search/label/Series%3A Template Metaprogramming). Let's remember what that atrocious code looks like (follow the link if you want an explanation on how this works):

```c++
template &lt;int N, int D&gt; struct Frak {
        static const long Num = N;
        static const long Den = D;
};

template &lt;int N, typename F&gt; struct ScalarMultiplication {
    typedef Frak&lt;N*F::Num, N*F::Den&gt; result;
};

template &lt;int X, int Y&gt; struct MCD {
        static const long result = MCD&lt;Y, X % Y&gt;::result;
};

template &lt;int X&gt; struct MCD&lt;X, 0&gt; {
        static const long result = X;
};

template &lt;class F&gt; struct Simpl {
        static const long mcd = MCD&lt;F::Num, F::Den&gt;::result;
        typedef Frak&lt; F::Num / mcd, F::Den / mcd &gt; result;
};

template &lt;typename X1, typename Y1&gt; struct SameBase {
    typedef typename ScalarMultiplication&lt; Y1::Den, X1&gt;::result X;
    typedef typename ScalarMultiplication&lt; X1::Den, Y1&gt;::result Y;
};

template &lt;typename X, typename Y&gt; struct Sum {
    typedef SameBase&lt;X, Y&gt; B;
    static const long Num = B::X::Num + B::Y::Num;
    static const long Den = B::Y::Den; // == B::X::Den
    typedef typename Simpl&lt; Frak&lt;Num, Den&gt; &gt;::result result;
};

template &lt;int N&gt; struct Fact {
    static const long result = N * Fact&lt;N-1&gt;::result;
};
template &lt;&gt; struct Fact&lt;0&gt; {
    static const long result = 1;
};

template &lt;int N&gt; struct E {
    // e = S(1/n!) = 1/0! + 1/1! + 1/2! + ...
    static const long Den = Fact&lt;N&gt;::result;
    typedef Frak&lt; 1, Den &gt; term;
    typedef typename E&lt;N-1&gt;::result next_term;
    typedef typename Sum&lt; term, next_term &gt;::result result;
};
template &lt;&gt; struct E&lt;0&gt; {
    typedef Frak&lt;1, 1&gt; result;
};

int main() {
  typedef E&lt;8&gt;::result X;
  std::cout &lt;&lt; "e = " &lt;&lt; (1.0 * X::Num / X::Den) &lt;&lt; "\n";
  std::cout &lt;&lt; "e = " &lt;&lt; X::Num &lt;&lt;"/"&lt;&lt; X::Den &lt;&lt; "\n";
  return 0;
}
```

While this is just a toy example to play with templates, it does illustrate code I've seen in the wild. Would this look cleaner in c++11? Yes, it would. Constexprs are, in my opinion, one of the most overlooked "killer" features of c++11.

Starting with a simple example:

```c++
constexpr int foo(int a, int b) { return a+b; }
static constexpr int n = foo(1, 2);
int bar() { return n; }
```

Try to compile it with "g++ -std=c++11 -fverbose-asm -O0 -c -S -o /dev/stdout" and see what happens. You should get the equivalent of "return 3" - just as anyone would expect - but note that no optimizations were enabled. What about loops? Let's try this:

```c++
constexpr int f(int n) {
    return (n&lt;2)? 1 : n + f(n-1);
}

constexpr int n = f(999);
```

You'll probably get an error about maximum depth exceeded, but that's alright: we have loops in constexprs too! (note that some of these restrictions have been relaxed in C++17).

In general, if you can express your function as a single const return statement, it should be a valid constexpr. With this new knowledge, let's convert the template meta-atrocity above to something a bit less hideous:

```c++
struct PodFrac {
    int num;
    int den;
};

constexpr int mcd(int a, int b) {
    return (b==0)? a : mcd(b, a%b);
}

constexpr PodFrac simpl(const PodFrac &amp;f) {
    return PodFrac{f.num / mcd(f.num, f.den), f.den / mcd(f.num, f.den)};
}

constexpr PodFrac sum(const PodFrac &amp;a, const PodFrac &amp;b) {
    return simpl(PodFrac{a.num*b.den + b.num*a.den, a.den*b.den});
}

constexpr int fact(int n) {
    return (n==0)? 1 : n*fact(n-1);
}

constexpr PodFrac e(int n) {
    return (n==0)? PodFrac{1, 1} :
                   sum(PodFrac{1, fact(n)}, e(n-1));
}

constexpr float e_num = 1.0 * e(8).num / e(8).den;

float get_e() {
    return e_num;
}
```

Disclaimer: while I explicitly stated this multiple times in my "[C++ template metaprogramming introduction](/search/label/Series%3A Template Metaprogramming)" article, it's worth re-stating it: this code is meant as an example to showcase a c++ feature, not as a proper way of deriving a mathematical constant in production code.

First thoughts after comparing the two versions: much, much [, much]\*100 cleaner.

As you may notice, all constexprs need to be a return statement. There's no multi-statement constexpr in c++11, which explains why loops are not really supported. For the same reason the implementation of e() is a bit hindered by this limitation: its code would be much more readable splitting it in a few lines with proper names. Good news: some of these restrictions have been relaxed in C++17.

Note that if you analyze your compiler's output when building without optimizations, you may see either a const with e's value, or a static initializer that does some trivial operation, like loading e's value from a fraction: gcc seems to get tired of constexpr evaluation after a few recursive calls, so your results may vary (slightly).

I called constexpr's one of c++11's killer features, and hopefully you can see why I'm so enthusiastic about them now: there's much less incentive for people to write horrible template metaprogramming devices when simply adding a little keyword to a normal function has the same effect, only cleaner.


---
## In reply to [this post](), [Fixing templates with constexpr’s | patwanjau](/blog_md/youfoundadeadlink.md) commented @ 2017-01-19T13:01:02.000+01:00:

[…] Source: Fixing templates with constexpr’s […]

Original [published here](/blog_md/2017/0118_Fixingtemplateswithconstexprs.md).
