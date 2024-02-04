# Cool C++0X features IV: Variadic templates again

@meta publishDatetime 2011-05-03T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/05/cool-c0x-features-iv-variadic-templates.html

Last time we finally solved the varargs problem. Let's review what we learned:
* Variadic templates let us create something receiving a variable set of arguments
* We can process the head of that set, then recursively process the tail
* It adds weird new syntax
	+ When declaring typename... T you are saying "here goes a list of types"
	+ When declaring T... t you are saying t is a list of objects with different type
	+ When you write t..., you are saying "expand the list of arguments"
* It's type safe
* It's very neat to confuse your coworkers

So, what can we do with it besides implementing our own version of printf? Let's do something better, let's try adding up a list of numbers to start flexing our variadic templatefooness (?).

What's the usual way of adding a list of numbers? In templates, that is. We need something like this:

```
sum (H:T) <- H + sum(T)
sum () <- 0

```

Of course, in C++ templates you don't have values, you just have types. We could implement it like this (if this looks like a new language you may want to check my [template metaprogramming series](/search/label/Series%3A%20Template%20Metaprogramming)):

```c++
#include &lt;iostream&gt;

struct Nil{};
template &lt;typename H, typename T=Nil&gt; struct Lst {
	typedef H Head;
	typedef T Tail;
};

template &lt;
		template&lt;typename A, typename B&gt; class Op,
		typename Head,
		typename Lst&gt;
struct intForeach
{
	typedef typename intForeach
		&lt; Op, typename Lst::Head, typename Lst::Tail &gt;::result Next;
	typedef typename Op&lt; Head, Next &gt;::result result;
};

template &lt;
		template&lt;typename A, typename B&gt; class Op,
		typename Head&gt;
struct intForeach &lt;Op, Head, Nil&gt;
{
	typedef Head result;
};

template &lt;
		typename Lst,
		template&lt;typename A,
		typename B&gt;
		class Op&gt;
struct Reduce
{
	typedef typename intForeach
		&lt; Op, typename Lst::Head, typename Lst::Tail &gt;::result result;
};

template &lt;int N&gt; struct Num {
	const static int value = N;
};

template &lt;typename A, typename B&gt; struct Sum {
	static const int r = A::value + B::value;
	typedef Num&lt;r&gt; result;
};

int main() {
	std::cout &lt;&lt; Reduce&lt;
		Lst&lt;Num&lt;2&gt;, Lst&lt;Num&lt;4&gt;, Lst&lt;Num&lt;6&gt;, Lst&lt; Num&lt;8&gt; &gt; &gt; &gt; &gt;,
		Sum &gt;::result::value &lt;&lt; "n";
	return 0;
}

```

Nothing too fancy, plain old recursion with a sum. Yet it's quite verbose, can we make this a little bit more terse and, hopefully, more clear? Yes, we can. Take a look at that Lst, Lst<...> It sucks. And it's the perfect place to use variadic templates, we just need to construct a structure getting a list of ints, like this:

```c++
template &lt;
	// The operation we wish to apply
	template&lt;typename A, typename B&gt; class Op,
	// Current element to process
	class H,
	// All the rest
	class... T&gt;
struct Reduce_V
{
	// TODO
}
```

That one should look familiar from last time article. Now, to implement a reduce operation we need to operate the current element with the result of reducing the tail, so we have to do something like this:

```c++
// Remember how T... means to expand T for the next instance
	typedef typename Reduce_V&lt;Op, T...&gt;::result Tail_Result
```

There's something missing. Can you see what? The ending condition, of course. Let's add it and we'll get something like this:

```c++
template &lt;
        // The operation we wish to apply
        template&lt;typename A, typename B&gt; class Op,
        // All the rest
        class... T&gt;
struct Reduce_V
{
};

template &lt;
        // The operation we wish to apply
        template&lt;typename A, typename B&gt; class Op,
        // All the rest
        class H&gt;
struct Reduce_V&lt;Op, H&gt;
{
	typedef H result;
};

template &lt;
        // The operation we wish to apply
        template&lt;typename A, typename B&gt; class Op,
        // Current element to process
        class H,
        // All the rest
        class... T&gt;
struct Reduce_V&lt;Op, H, T...&gt;
{
        // Remember how T… means to expand T for the next instance
   typedef typename Reduce_V&lt;Op, T...&gt;::result Tail_Result;

   // Reduce current value with the next in line
   typedef typename Op&lt;H, Tail_Result&gt;::result result;
};
```

And using it is very simple too:

```c++
std::cout &lt;&lt; Reduce_V&lt; Sum, Num&lt;1&gt;, Num&lt;2&gt;, Num&lt;3&gt;, Num&lt;4&gt;&gt;::result::value &lt;&lt; "n";
```

Next time we'll see another example for variadic templates and a new C++0x feature.


---
## In reply to [this post](), [Chaitanya]() commented @ 2013-09-06T22:10:04.000+02:00:

Thanks for all the C++ posts. They are quite informative, really appreciate the C++ blog series :)

Original [published here](/blog_md/2011/0503_CoolC0XfeaturesIVVariadictemplatesagain.md).

---
## In reply to [this post](), [nicolasbrailo](/blog_md) commented @ 2013-09-06T22:42:15.000+02:00:

Glad you find them useful Chaitanya, thanks for the feedback

Original [published here](/blog_md/2011/0503_CoolC0XfeaturesIVVariadictemplatesagain.md).
