# Cool C++0X features XI: decltype and disappearing constness

@meta publishDatetime 2011-09-27T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/09/cool-c0x-features-xi-decltype-and.html

After a long, long hiatus, the C++0x series are back. You may want to check where we left by reading the [last posts](md_blog/youfoundadeadlink.md) of this series.

In the last few entries we saw how to use decltype for type inference. Object types is a problem that seems easy but gets complicated very quickly, for example when you start dealing with constness. Constness is difficult in many ways but this time I want to review how constness works with type inference. This topic is not C++0x specific as it's present for template type deduction too, but decltype adds a new level of complexity to it.

Let's start with an example. Would this compile?

```c++
struct Foo {
	int bar;
};

void f(const Foo foo)
{
	foo.bar = 42;
}

```

Clearly not, having a const Foo means you can't touch foo.bar. How about this?

```c++
struct Foo {
	int bar;
};

void f(const Foo foo)
{
	int& x = foo.bar;
}
```

That won't compile either, you can't initialize an int reference from a const int, yet we can do this:

```c++
void f(const Foo foo)
{
	const int& x = foo.bar;
}
```

If we know that works it must mean that s.result's type is const int. Right? Depends.

Just as the name implies decltype yields the declared type of a variable, and what's the declared type for Foo.bar?

```c++
struct Foo {
	int bar;
};

void f(const Foo foo)
{
	// This won't compile
	int& x = foo.bar;
	// This will
	decltype(foo.bar) x = 42;
}
```

That's an interesting difference, but it makes sense once you are used to it. To make things more interesting, what happens if you start adding parenthesis (almost) randomly? Try to deduce the type of x:

```c++
void f(const Foo foo)
{
	decltype((foo.bar)) x
}
```

If **decltype(x)** is the type of **x** then **decltype((foo.bar))** is the type of **(foo.bar)**. Between **foo.bar** and **(foo.bar)** there's a very important difference; the first refers to a variable whilst the last refers to an expression. Even though **foo.bar** was declared as int, the expression **(foo.bar)** will yield a const int&, since that's the type (though implicit and not declared, since the expression is not declared).

This is how we would complete the example then:

```c++
void f(const Foo foo)
{
	// These two statements are equivalent
	decltype((foo.bar)) x = 42;
	const int& y = 42;
	// It's very easy to confirm that the typeof x is now const int&
	// This won't compile:
	x = 24;
}
```

As I said, disappearing constness is not a C++0x specific problem as it may occur on template type deduction, but that's besides the point of this post. Next time we'll continue working with type deduction, but with the new auto feature this time.

