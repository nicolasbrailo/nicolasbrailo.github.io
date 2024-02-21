
@meta docType index
## GCC instrumentation flag: slow everything down!

Post by Nico Brailovsky @ 2019-05-08 - [Permalink](md_blog/2019/0508_GCCinstrumentationflagsloweverythingdown.md)  - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0508_GCCinstrumentationflagsloweverythingdown.md&body=I%20have%20a%20comment!)

Here's a nice gcc tip if you think your code is running too fast: instrument everything! (Ok, it may also work if you need to create a profile of your application but for some reason Valgrind isn't your thing).

Compile with

```c++
g++ foo.cpp -ggdb3 -finstrument-functions
```

You can get a list of symbols with nm and c++filt, or you can implement your own elf reader too for extra fun.

```c++
extern "C" {
    bool g__cyg_profile_enabled = false;
    stack g__cyg_times;

    void __cyg_profile_func_enter(void *, void *) __attribute__((no_instrument_function));
    void __cyg_profile_func_exit(void *, void *) __attribute__((no_instrument_function));
    void cyg_profile_enable() __attribute__((no_instrument_function));
    void cyg_profile_disable() __attribute__((no_instrument_function));

    void __cyg_profile_func_enter(void *this_fn, void *call_site) {
        if (not g__cyg_profile_enabled) return;
        cout &lt;&lt; this_fn &lt;&lt; endl;
    }

    void __cyg_profile_func_exit(void *this_fn, void *call_site) {
        if (not g__cyg_profile_enabled) return;
        cout &lt;&lt; this_fn &lt;&lt; endl;
    }

    void cyg_profile_enable() {
        g__cyg_profile_enabled = true;
    }

    void cyg_profile_disable() {
        g__cyg_profile_enabled = false;
    }
}

int a() {
    return 42;
}

int b() {
    return a();
}

int c() {
    int x = b();
    int y = a();
    return x+y;
}

int d() {
    return c() + b();
}

int main() {
    cyg_profile_enable();
    cout << d() << endl;
    cyg_profile_disable();
    return 0;
}
```





---

## Chromecastic Slideshow

Post by Nico Brailovsky @ 2019-04-05 - [Permalink](md_blog/2019/0405_ChromecasticSlideshow.md)  - [1 comments](md_blog/2019/0405_ChromecasticSlideshow.md) - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0405_ChromecasticSlideshow.md&body=I%20have%20a%20comment!)

Plug for a new [script I've been working on: https://github.com/nicolasbrailo/ChromecasticSlideshow](https://github.com/nicolasbrailo/ChromecasticSlideshow):

Slideshows in Chromecast directly from your filesystem, without going through any online service. No Google Photos, Facebook or anything else: plain old random files straight from your disk to your Chromecast.

Hope someone else finds this useful!








---

## VimTip: Search and f(replace)

Post by Nico Brailovsky @ 2019-02-26 - [Permalink](md_blog/2019/0226_VimTipSearchandfreplace.md)  - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0226_VimTipSearchandfreplace.md&body=I%20have%20a%20comment!)

Pre-tip: When using search and replace in Vim, [you don't need to use slashes](md_blog/2015/0507_VimtipStopescapingslashes.md)
This works just fine:

```c++
%s#search#replace
```

Did you know $replace doesn't have to be a literal expression? You can also use Vim functions! For example:

```c++
%s#bar#\=line(&#x27;.&#x27;)
```

will replace every occurrence of 'bar' for its line number. You can get creative and use any other Vimscript function.





---

## std::byte - great idea. Meh execution?

Post by Nico Brailovsky @ 2018-10-02 - [Permalink](md_blog/2018/1002_stdbytegreatidea.Mehexecution.md)  - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2018/1002_stdbytegreatidea.Mehexecution.md&body=I%20have%20a%20comment!)

I love the idea of C++17's [std::byte](https://en.cppreference.com/w/cpp/types/byte). A data-type that makes it explicit we're dealing with ugly low-level details? What's there not to love! One thing only, turns out.

First, the good part: separating character (human) representation from binary (low-level) representation is brilliant. No implicit conversion between the two separates the domains very well and creates a much clearer interface.

The bad part: std::byte is really really strict. It only accepts other std::bytes as operands(\*). You'd hope this would work

```c++
auto f() {
  byte b{42};
  return b &amp; 0b11;
}
```

It doesn't. std::byte only accepts other std::byte's as operands. The design goal behind it is good, sure. In practice, I've noticed this means casts are not limited to the interface between low-level and rest-of-the-world: casts and explicit byte's get sprinkled all over the place.

My prediction: most people will dislike the boilerplate std::byte adds and fall back to unsinged char's, until the type restrictions in std::byte are relaxed. I hope I'm wrong though!

(\*) Yes, with the exception of shift operations. That was a good design decision!





---

## -Wmisleading-indentation

Post by Nico Brailovsky @ 2018-09-30 - [Permalink](md_blog/2018/0930_Wmisleadingindentation.md)  - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2018/0930_Wmisleadingindentation.md&body=I%20have%20a%20comment!)

This gcc switch is a few years old but I discovered it recently. I'm not sure if that means my code is always very clean or my toolchain too oudated... in any case, -Wmisleading-indentation (which you get with -Wall) warns about this gotcha:

```c++
if (foo)
   bar();
   baz();
```

Neat!





---

## GitHub tip: Prefill a bug report

Post by Nico Brailovsky @ 2018-09-04 - [Permalink](md_blog/2018/0904_GitHubtipPrefillabugreport.md)  - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2018/0904_GitHubtipPrefillabugreport.md&body=I%20have%20a%20comment!)

Getting feedback from users is hard. In a platform such as Android, with apps evaluated in a couple of seconds, it's even harder.

While trying to get bug reports for [VlcFreemote](https://github.com/nicolasbrailo/VlcFreemote) I found a neat GitHub trick: you can pre-fill a bug report by using url parameters. For example, check this link: <https://github.com/nicolasbrailo/VlcFreemote/issues/new?title=foo&body=bar>

Awesome! Takes a second and makes life much easier for bug-reporters!





---

## Happiest bug report

Post by Nico Brailovsky @ 2018-09-02 - [Permalink](md_blog/2018/0902_Happiestbugreport.md)  - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2018/0902_Happiestbugreport.md&body=I%20have%20a%20comment!)

Something is wrong: I'm happy over a bug report!

A few years back I developed a [VlcRemote control](https://github.com/nicolasbrailo/VlcFreemote) app for Android. According [to this chart](https://xkcd.com/1205/), I didn't actually save any time doing so. The time I spent spent developing the app is more than the cumulative time I would have spent by getting up from the couch and manually controlling VLC. That said, not having to leave the coziness of a warm blanket in winter probably made it worth the investment.

Not long ago I decided to [submit this app to F-Droid](https://f-droid.org/en/packages/com.nicolasbrailo.vlcfreemote/). I'm too cheap to pay the 20ish dollars for Google App Store, and since I don't have any commercial interest I don't see the point. I didn't think I'd actually get any users there, but today I got my first bug report. So much happiness! You'd think I shouldn't be happy about my crappy software not-working, but hey, someone actually took the time to try it out. Even more, someone cared enough to submit a bug report!

Open source rules!





---

## Geotagging in Ubuntu: more broken than ever

Post by Nico Brailovsky @ 2017-04-14 - [Permalink](md_blog/2017/0414_GeotagginginUbuntumorebrokenthanever.md)  - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2017/0414_GeotagginginUbuntumorebrokenthanever.md&body=I%20have%20a%20comment!)

This is depressing. All the geotagging tools in Ubuntu seem dead. Even mine, apparently the latest version of CEF Python changed something that breaks my app. Even worse, looking for "ubuntu geotagging" has my own blog as one of the top results... time to fix my code, I guess?





---

## Fixing templates with constexpr's

Post by Nico Brailovsky @ 2017-01-18 - [Permalink](md_blog/2017/0118_Fixingtemplateswithconstexprs.md)  - [1 comments](md_blog/2017/0118_Fixingtemplateswithconstexprs.md) - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2017/0118_Fixingtemplateswithconstexprs.md&body=I%20have%20a%20comment!)

For my hundredth (and a bit) c++ post I decided to do something I never did before: fix my old code!

A long time ago I wrote about template metaprogramming devices. There, I tried to explain that many atrocities have been commited in the name of performance and "compile time evaluation". Template metaprogramming is probably one of the worse culprits of job security. Its (ab)use can create monstrosities, all in the name of runtime performance. Like, for example, my [template device to calculate e](md_blog/youfoundadeadlink.md). Let's remember what that atrocious code looks like (follow the link if you want an explanation on how this works):

```c++
template <int N, int D> struct Frak {
        static const long Num = N;
        static const long Den = D;
};

template <int N, typename F> struct ScalarMultiplication {
    typedef Frak<N*F::Num, N*F::Den> result;
};

template <int X, int Y> struct MCD {
        static const long result = MCD<Y, X % Y>::result;
};

template <int X> struct MCD<X, 0> {
        static const long result = X;
};

template <class F> struct Simpl {
        static const long mcd = MCD<F::Num, F::Den>::result;
        typedef Frak< F::Num / mcd, F::Den / mcd > result;
};

template <typename X1, typename Y1> struct SameBase {
    typedef typename ScalarMultiplication< Y1::Den, X1>::result X;
    typedef typename ScalarMultiplication< X1::Den, Y1>::result Y;
};

template <typename X, typename Y> struct Sum {
    typedef SameBase<X, Y> B;
    static const long Num = B::X::Num + B::Y::Num;
    static const long Den = B::Y::Den; // == B::X::Den
    typedef typename Simpl< Frak<Num, Den> >::result result;
};

template <int N> struct Fact {
    static const long result = N * Fact<N-1>::result;
};
template <> struct Fact<0> {
    static const long result = 1;
};

template <int N> struct E {
    // e = S(1/n!) = 1/0! + 1/1! + 1/2! + ...
    static const long Den = Fact<N>::result;
    typedef Frak< 1, Den > term;
    typedef typename E<N-1>::result next_term;
    typedef typename Sum< term, next_term >::result result;
};
template <> struct E<0> {
    typedef Frak<1, 1> result;
};

int main() {
  typedef E<8>::result X;
  std::cout << "e = " << (1.0 * X::Num / X::Den) << "\n";
  std::cout << "e = " << X::Num <<"/"<< X::Den << "\n";
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
    return (n<2)? 1 : n + f(n-1);
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

Disclaimer: while I explicitly stated this multiple times in my "[C++ template metaprogramming introduction](md_blog/youfoundadeadlink.md)" article, it's worth re-stating it: this code is meant as an example to showcase a c++ feature, not as a proper way of deriving a mathematical constant in production code.

First thoughts after comparing the two versions: much, much [, much]\*100 cleaner.

As you may notice, all constexprs need to be a return statement. There's no multi-statement constexpr in c++11, which explains why loops are not really supported. For the same reason the implementation of e() is a bit hindered by this limitation: its code would be much more readable splitting it in a few lines with proper names. Good news: some of these restrictions have been relaxed in C++17.

Note that if you analyze your compiler's output when building without optimizations, you may see either a const with e's value, or a static initializer that does some trivial operation, like loading e's value from a fraction: gcc seems to get tired of constexpr evaluation after a few recursive calls, so your results may vary (slightly).

I called constexpr's one of c++11's killer features, and hopefully you can see why I'm so enthusiastic about them now: there's much less incentive for people to write horrible template metaprogramming devices when simply adding a little keyword to a normal function has the same effect, only cleaner.








---

## Quick refresher: argument dependent lookup

Post by Nico Brailovsky @ 2017-01-04 - [Permalink](md_blog/2017/0104_Quickrefresherargumentdependentlookup.md)  - [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2017/0104_Quickrefresherargumentdependentlookup.md&body=I%20have%20a%20comment!)

Since I wasted a few precious minutes stuck on an ADL problem, I figured I needed a quick reminder on how they work. Check this code: does it compile?

```c++
namespace N {
    int foo() {
    }
}

int main() {
    return foo();
}
```

Of course it doesn't! You'd expect a 'foo' not declared/out of scope error from your compiler. What about this other example?

```c++
namespace N {
    struct Dummy;

    int foo(Dummy*) {
        return 0;
    }

    int foo() {
    }
}

int main() {
    return foo((N::Dummy*)0);
}
```

You'd be tempted to say it won't work either. (Un?)fortunately, 'argument dependant lookup' is a thing, and the second code sample works. How? The compiler will look for 'foo' in the global namespace, and also in the namespace of the arguments to 'foo'. Seeing 'N::Dummy' in there, the compiler is allowed to peak into the namespace N for method 'foo'. Why? Short: operator overloading. Long: [check here](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2006/n2103.pdf) (the 'Why ADL' section is very good).





---

[Prev](md_gen/index1.md) | [History](md_gen/history.md)