# Quick refresher: argument dependent lookup

@meta publishDatetime 2017-01-04T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2017/01/quick-refresher-argument-dependent.html

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

