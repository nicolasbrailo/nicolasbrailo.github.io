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

Of course, in C++ templates you don't have values, you just have types. We could implement it like this (if this looks like a new language you may want to check my [template metaprogramming series](/md_blog/youfoundadeadlink.md)):

```c++
#include <iostream>

struct Nil{};
template <typename H, typename T=Nil> struct Lst {
	typedef H Head;
	typedef T Tail;
};

template <
		template<typename A, typename B> class Op,
		typename Head,
		typename Lst>
struct intForeach
{
	typedef typename intForeach
		< Op, typename Lst::Head, typename Lst::Tail >::result Next;
	typedef typename Op< Head, Next >::result result;
};

template <
		template<typename A, typename B> class Op,
		typename Head>
struct intForeach <Op, Head, Nil>
{
	typedef Head result;
};

template <
		typename Lst,
		template<typename A,
		typename B>
		class Op>
struct Reduce
{
	typedef typename intForeach
		< Op, typename Lst::Head, typename Lst::Tail >::result result;
};

template <int N> struct Num {
	const static int value = N;
};

template <typename A, typename B> struct Sum {
	static const int r = A::value + B::value;
	typedef Num<r> result;
};

int main() {
	std::cout << Reduce<
		Lst<Num<2>, Lst<Num<4>, Lst<Num<6>, Lst< Num<8> > > > >,
		Sum >::result::value << "n";
	return 0;
}

```

Nothing too fancy, plain old recursion with a sum. Yet it's quite verbose, can we make this a little bit more terse and, hopefully, more clear? Yes, we can. Take a look at that Lst, Lst<...> It sucks. And it's the perfect place to use variadic templates, we just need to construct a structure getting a list of ints, like this:

```c++
template <
	// The operation we wish to apply
	template<typename A, typename B> class Op,
	// Current element to process
	class H,
	// All the rest
	class... T>
struct Reduce_V
{
	// TODO
}
```

That one should look familiar from last time article. Now, to implement a reduce operation we need to operate the current element with the result of reducing the tail, so we have to do something like this:

```c++
// Remember how T... means to expand T for the next instance
	typedef typename Reduce_V<Op, T...>::result Tail_Result
```

There's something missing. Can you see what? The ending condition, of course. Let's add it and we'll get something like this:

```c++
template <
        // The operation we wish to apply
        template<typename A, typename B> class Op,
        // All the rest
        class... T>
struct Reduce_V
{
};

template <
        // The operation we wish to apply
        template<typename A, typename B> class Op,
        // All the rest
        class H>
struct Reduce_V<Op, H>
{
	typedef H result;
};

template <
        // The operation we wish to apply
        template<typename A, typename B> class Op,
        // Current element to process
        class H,
        // All the rest
        class... T>
struct Reduce_V<Op, H, T...>
{
        // Remember how T… means to expand T for the next instance
   typedef typename Reduce_V<Op, T...>::result Tail_Result;

   // Reduce current value with the next in line
   typedef typename Op<H, Tail_Result>::result result;
};
```

And using it is very simple too:

```c++
std::cout << Reduce_V< Sum, Num<1>, Num<2>, Num<3>, Num<4>>::result::value << "n";
```

Next time we'll see another example for variadic templates and a new C++0x feature.

# Comments

---
## In reply to [this post](), [Chaitanya]() commented @ 2013-09-06T22:10:04.000+02:00:

Thanks for all the C++ posts. They are quite informative, really appreciate the C++ blog series :)

Original [published here](/md_blog/2011/0503_CoolC0XfeaturesIVVariadictemplatesagain.md).

---
## In reply to [this post](), [nicolasbrailo](/md_blog) commented @ 2013-09-06T22:42:15.000+02:00:

Glad you find them useful Chaitanya, thanks for the feedback

Original [published here](/md_blog/2011/0503_CoolC0XfeaturesIVVariadictemplatesagain.md).
