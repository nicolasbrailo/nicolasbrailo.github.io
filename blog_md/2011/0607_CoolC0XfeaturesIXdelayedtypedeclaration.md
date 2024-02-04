# Cool C++0X features IX: delayed type declaration

@meta publishDatetime 2011-06-07T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/06/cool-c0x-features-ix-delayed-type.html

In the last two entries we worked on a wrapper object which allows us to decorate a method before or after calling (hello aspects!), or at least that's what it should do when g++ fully implements decltypes and variadic templates. Our wrapper function looks something like this (check out the previous entry for the wrapper object):

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

After the example, we were left with three new syntax changes to analyze:
* -> (delayed declaration)
* decltype
* auto

Let's study the -> operator this time: **-> (delayed declaration)**
This is the easiest one. When a method is declared auto (I've left this one for the end because auto is used for other things too) it means its return type will be defined somewhere else. Note that in this regard the final implementation differs from [Stroustroup's FAQ](/blog_md/youfoundadeadlink.md).

The -> operator in a method's definition says "Here's the return type". I'll paste the same simple example we had last time, the following two snippets of code are equivalent:

```c++
void foo() {}
```

Is the same as:

```c++
auto foo() -&gt; void {}
```


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Cool C++0X features XII: type inference with auto](/blog_md/2011/1004_CoolC0XfeaturesXIItypeinferencewithauto.md) commented @ 2011-10-04T09:23:29.000+02:00:

[...] like the one I’m pasting below, of type inference with decltype, which led us to learn about delayed type declaration and decltypes with auto. This time I want to focus just on the auto keyword [...]

Original [published here](/blog_md/2011/0607_CoolC0XfeaturesIXdelayedtypedeclaration.md).
