# Mixin(ish) classes with parameter packs in C++

@meta publishDatetime 2020-02-18T08:00:00.001+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2020/02/mixinish-classes-with-parameter-packs_18.html

For some reason I couldn't find many examples of how to use a parameter pack as a mixin, to enable different features with no runtime overhead. Here is a full example of you might implement this (be aware there are some nasal daemons in the code below!). The technique is really based on this one line:

```c++
 int dummy[sizeof...(Config)] = { (Config::apply(p), 0)... };
```

This idiom will unpack a parameter pack and call T::apply, for each T in the parameter pack. You can use this idiom to build very clean mixin-type interfaces with static dispatch, or to build job security.

Full example:

```c++
struct EnableFeatureA {
  template &lt;typename T&gt; static void apply(T *a) {
    cout &lt;&lt; a-&gt;a() &lt;&lt; endl;
  }
};

struct EnableFeatureB {
  template &lt;typename T&gt; static void apply(T *a) {
    cout &lt;&lt; T::b() &lt;&lt; endl;
  }
};

template &lt;typename Impl, typename... Config&gt;
struct Foo {
  Foo(){
    // Call apply() for each type in Config
    Impl *p = nullptr;
    int dummy[sizeof...(Config)] = { (Config::apply(p), 0)... };
  }
};

struct Bar;
using FwdFoo = Foo&lt;Bar, EnableFeatureA, EnableFeatureB&gt;;

struct Bar : FwdFoo {
   int a() { return 4; }
   static int b() { return 2; }
};
```


---
## In reply to [this post](), [Balazs Benics]() commented @ 2020-02-18T18:57:18.000+01:00:

Keep in mind that parameter packs can be empty, in which case the array would try to have zero elements.
Also, some apply function might return an object which overloaded the comma operator, in which case the result of the whole expression would otherwise.

I would address the mentioned issues like this:
int dummy[1 + sizeof...(Config)] = { 0, (static\_cast(Config::apply(p)), 0)... };

Note that nobody can override the comma operator there.

Original [published here](/blog_md/2020/0218_MixinishclasseswithparameterpacksinC.md).

---
## In reply to [this post](), [nicolasbrailo](/blog_md) commented @ 2020-02-19T13:06:50.000+01:00:

Good catch, thanks!

Original [published here](/blog_md/2020/0218_MixinishclasseswithparameterpacksinC.md).
