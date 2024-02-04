# Cool C++0X features VIII: Variadic wrapper and type inference with
decltype

@meta publishDatetime 2011-05-31T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/05/cool-c0x-features-viii-variadic-wrapper.html

The wrapper function we built last time looks something like this now:

```c++
#include &lt;iostream&gt;

void do_something() { std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n"; }
void do_something(const char*) { std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n"; }

template &lt;class... Args&gt;
void wrap(Args... a) {
	std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n";
	do_something(a...);
}

int main() {
	wrap();
	wrap("nice");
	return 0;
}
```

But, as we saw last time, this approach has the problem of requiring the return type of do\_something to be known before hand. What can we do to remove this dependency? In C++, not much. You can't really declare a type based on the return type of another function. You do have the option of using lots of metaprogramming wizardy, but this is both error prone and ugly (see [Stroustroup's C++0x FAQ](/blog_md/youfoundadeadlink.md)).

C++0x lets you do some magic with type inference using decltype; decltype(expr) will yield the type of that expression. It works quite similarly as sizeof does; decltype is resolved at compile time and the expression with which it's being called is not evaluated (more on this later).

How would this work on our example?

```c++
#include &lt;iostream&gt;

void do_something() { std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n"; }
void do_something(const char*) { std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n"; }
int do_something(int) { std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n"; return 123; }

template &lt;class... Args&gt;
auto wrap(Args... a) -&gt; decltype( do_something(a...) ) {
	std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n";
	return do_something(a...);
}

int main() {
	wrap();
	wrap("nice");
	int x = wrap(42);
	std::cout &lt;&lt; x &lt;&lt; "n";
	return 0;
}
```

Try it (remember to add -std=c++0x) it works great! The syntax is not so terribly difficult to grasp as it was with variadic templates. The auto keywords says "hey, compiler, the return type for this method will be defined later", and then the -> actually declares the return type. This means that the auto-gt idiom isn't part of typedecl but a helper, which in turns means that even if not useful, this is valid C++0x code:

```c++
auto wrap() -&gt; void {
}
```

This means that we have three interesting components to analyze in this scenario:
* -> (delayed declaration)
* auto
* decltype

We'll go over each one the next time.

Closing remark: At first I choose the following example to introduce delayed return types and decltype (warning, untested code ahead):

```c++
#include &lt;iostream&gt;

struct Foo {
	void do_something() { std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n"; }
	void do_something(const char*) { std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n"; }
	int do_something(int) { std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n"; return 123; }
};

// Untested code ahead
// This makes g++ coredump (v 4.4.5)
template &lt;class T&gt;
struct Wrap : public T {
	template &lt;class... Args&gt;
	auto wrap(Args... a) -&gt; decltype( T::do_something(a...) ) {
		std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n";
		return T::do_something(a...);
	}
};

int main() {
	Wrap&lt;Foo&gt; w;
	w.wrap();
	w.wrap("nice");
	std::cout &lt;&lt; w.wrap(42) &lt;&lt; "n";
	return 0;
}
```

Though this looks MUCH better (and useful), at the time of writing this article mixing variadic templates with decltypes in a template class makes g++ segfault. It should be valid C++, but I can't assure it's correct code since I've never tried it.

