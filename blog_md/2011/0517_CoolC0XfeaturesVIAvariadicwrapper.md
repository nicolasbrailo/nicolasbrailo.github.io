# Cool C++0X features VI: A variadic wrapper

@meta publishDatetime 2011-05-17T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/05/cool-c0x-features-vi-variadic-wrapper.html

Let's work on the last variadic exercise, a wrapper. Say you have something like this:

```c++
#include <iostream>

void do_something() { std::cout << __PRETTY_FUNCTION__ << "n"; }

int main() {
	do_something();
	return 0;
}
```

And you want to wrap do\_something with something else (Remember [\_\_PRETTY\_FUNCTION\_\_](/blog_md/2010/0622_Cprettyfunctions.md)?). This is a solution, the worst one though (or, to be accurate, the most boring one):

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

Why is it so bad? Let's say you don't control do\_something, you just control the wrapper. You may not even control main(), it may be beyond your scope. That means each time do\_something changes, or adds an overload, you have to change your code. That's ugly and you should already know how to set up a variadic function to forward the arguments to do\_something. Give it a try, next time the solution.

