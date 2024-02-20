# Cool C++0X features XII: type inference with auto

@meta publishDatetime 2011-10-04T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/10/cool-c0x-features-xii-type-inference.html

In the last four entries we worked on a simple example, like the one I'm pasting below, of type inference with decltype, which led us to learn about [delayed type declaration](md_blog/2011/0607_CoolC0XfeaturesIXdelayedtypedeclaration.md) and [decltypes with auto](md_blog/2011/0610_CoolC0XfeaturesXtypeinferencewithdecltype.md). This time I want to focus just on the auto keyword instead.

```c++
template <class... Args>
auto wrap(Args... a) -> decltype( do_something(a...) ) {
	std::cout << __PRETTY_FUNCTION__ << "n";
	return do_something(a...);
}
```

We saw [last time](md_blog/2011/0610_CoolC0XfeaturesXtypeinferencewithdecltype.md) how decltype can be used in a contrived way to create a local variable without specifying its type, only how to deduce the type for this variable. Luckily, that verbose method of type declaration can be summed up in the following way:

```c++
	int x = 2;
	int y = 3;
	decltype(x*y) z = x*y;
```

Should be written as:

```c++
	int x = 2;
	int y = 3;
	auto z = x*y;
```

That's right, when you are declaring local variables it's easier and cleaner to just use auto. This feature isn't even "in the wild" yet, so you can't really predict what will people do with it, but it seems to me that limiting its use to local variables with a very short lived scope is the best strategy. We are yet to see what monstrosities the abuse of this feature will produce, and I'm sure there will be many. Regardless of their potential to drive insane any maintainers, its best use probably comes in loops.

In any C++ application, you'll find code like this:

```c++
for (FooContainer<Bar>::const_iterator i = foobar.begin(); i != foobar.end(); ++i)
```

This ugly code can be eliminated with something much more elegant:

```c++
for (auto i = foobar.begin(); i != foobar.end(); ++i)
```

Looks nicer indeed, but we can improve it much further with other tools. We'll see how the next time. For the time being, let's see for what auto is not to be used.

When using auto, keep in mind it was designed to simplify the declaration of a variable with a complex or difficult to reason type, not as a replacement for other language features like templates. This is a common mistake:

Wrong:

```c++
void f(auto x) {
	cout << x;
}
```

Less wrong:

```c++
template <T>
void f(T x) {
	cout << x;
}
```

It makes no sense to use auto in the place of a template, since a template means that the type will be completed later whereas auto means it should be deduced from an initializer.

