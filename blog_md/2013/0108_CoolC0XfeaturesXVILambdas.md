# Cool C++0X features XVI: Lambdas

@meta publishDatetime 2013-01-08T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/01/cool-c0x-features-xvi-lambdas.html

Last time we created a device to sum an initializer list of ints, something like this:

```c++
void Add(initializer_list&lt;int&gt; lst) {
	int sum = 0;
	for (auto i = lst.begin(); i != lst.end(); ++i)
		sum += *i;

	cout &lt;&lt; sum &lt;&lt; "n";
}

```

And then we said this can be improved using some new C++0x wizardry to support actions other than adding. How would we do that? Easy, we need to decouple the iteration of the list from the operation logic. We can do something like this:

```c++

// Note how we don't care about the type of OP, just that
// it can be called (i.e. has an operator ())
template &lt;class OP&gt;
void do_something(OP op, int init, initializer_list&lt;int&gt; lst) {
	int sum = init;
	for (auto i = lst.begin(); i != lst.end(); ++i)
	{
		int x = *i;
		sum = op(sum, x);
	}

	cout &lt;&lt; sum &lt;&lt; "n";
}

struct Sum {
	int operator() (int a, int b)
	{
		return a + b;
	}
};

int main() {
	do_something(Sum(), 0, {1, 2, 3, 4});
	return 0;
}
```

We had to do some changes other than passing the operation-object into the do\_something method; since the start value (zero) was hardcoded we had to remove it to really decouple the action from the iteration.

Other than creating a function object (which is the correct name for the object wrapping our operation) we don't see any strange changes, there's no C++0x there, but C++0x gives us a little tool which gives you the power of creating much simpler and nicer code, or to make the next maintainers' life a living hell. That's a discussion for other time though, now let's take a sneak preview a lambdas, the evolution of function objects:

```c++
int main() {
	auto f = [] (int a, int b){ return a+b; } ;
	do_something(f, 0, {1, 2, 3, 4});
	return 0;
}
```

Note that we didn't change anything on the method iterating the list, we just changed main! There's a lot to talk about lambdas, so this is only an intro to the subject. Next time we'll discuss the subtleties of the new syntax.

