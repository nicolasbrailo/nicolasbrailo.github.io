# CRTP for static dispatching

@meta publishDatetime 2011-03-31T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/03/crtp-for-static-dispatching.html

So, virtual dispatching is just too much overhead for you? I bet you do need every femtosecond from your CPU. Even if you don't, who doesn't like weird C++ constructs? Take CRTP, for example, a Curiously recurring template pattern:

```c++
template &lt;class Derived&gt; struct CRTP {
    const char* greeting() const {
        const Derived* self = static_cast&lt;const Derived*&gt;(this);
        return self-&gt;greeting();
    }
};

struct Hello : public CRTP&lt;Hello&gt; {
    const char* greeting() const { return "Hello world"; }
};

struct Bye : public CRTP&lt;Bye&gt; {
    const char* greeting() const { return "Bye world"; }
};

#include &lt;iostream&gt;
template &lt;class T&gt; void print(const CRTP&lt;T&gt; &amp;x) {
    std::cout &lt;&lt; x.greeting() &lt;&lt; "n";
}

int main() {
    print(Hello());
    print(Bye());
    return 0;
}
```

Using this weird looking (ain't them all?) template device you can have static dispatching with most of the flexibility of dynamic dispatching. As a bonus, you'll drive all your cow-orkers insane!

Bonus non useful information: In C++ 0X you could use variadic templates and have a proxy object with static dispatching. How cool is that?

