# Cool C++0X features VII: A variadic wrapper solution

@meta publishDatetime 2011-05-24T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/05/cool-c0x-features-vii-variadic-wrapper.html

[Last time](/blog_md/2011/0531_CoolC0XfeaturesVIIIVariadicwrapperandtypeinferencewithdecltype.md) we were trying to build a wrapper function, in which we don't control the class being wrapped nor the user of the wrapper (meaning we can't change either of those but they could change without warning).

This was the first approach:

```c++
#include <iostream>

void do_something() { std::cout << __PRETTY_FUNCTION__ << "n"; }

void wrap() {
	std::cout << __PRETTY_FUNCTION__ << "n";
	do_something();
}

int main() {
	wrap();
	return 0;
}
```

Yet, as we saw, it's not scalable, when either part changes the whole things break. We proposed then a variadic template solution, which, if you tried it yourself, should look something like this:

```c++
#include <iostream>

void do_something() { std::cout << __PRETTY_FUNCTION__ << "n"; }
void do_something(const char*) { std::cout << __PRETTY_FUNCTION__ << "n"; }

template <class... Args>
void wrap(Args... a) {
	std::cout << __PRETTY_FUNCTION__ << "n";
	do_something(a...);
}

int main() {
	wrap();
	wrap("nice");
	return 0;
}
```

That's better. Now we don't care about which parameters do\_something should get, nor how many of them are there supposed to be, just how it's called. If you read the [previous entries on variadic templates](/blog_md/2011/0426_CoolC0XfeaturesIIIVariadictemplatesafixforvarargs.md) this should be a walk in the park. It still has a flaw though: we need to know the return type of do\_something!

Is there a way to write a wrapper without knowing the return type of a function you are wrapping? Yes, in Ruby you can. But now you can do it in C++0x too, and we'll see how to do it next time.

A closing remark: You could do something like this wrapping everything in a class:

```c++
#include <iostream>

struct Foo {
	void do_something() { std::cout << __PRETTY_FUNCTION__ << "\n"; }
	void do_something(const char*) { std::cout << __PRETTY_FUNCTION__ << "\n"; }
};

template
struct Wrapper : public Base {
	template <class... Args>
	void wrap(Args... a) {
		std::cout << __PRETTY_FUNCTION__ << "n";
		Base::do_something(a...);
	}
};

int main() {
	Wrapper w;
	w.wrap();
	w.wrap("nice");
	return 0;
}
```

The above works just fine, but due to some limitations in the current (stable) version of gcc we will use the former version (the problem with this form will be clear later, I promise).

