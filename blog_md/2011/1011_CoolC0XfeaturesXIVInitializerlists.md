# Cool C++0X features XIV: Initializer lists

@meta publishDatetime 2011-10-11T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/10/cool-c0x-features-xiv-initializer-lists.html

We talked last time about ranged fors and how they can simplify our life in C++0x. Now we are going to take a trip back to old C land. Remember when you could initialize your arrays like this:

```c++
int v[] = {1, 2, 3, 4};
```

C++0X brought a lot of changes to the world, and suddenly instead of int[] you were supposed to use vector, and with it your initializer didn't work anymore. Though luck. Try to compile this:

```c++
#include &lt;vector&gt;
int main() {
	std::vector&lt;int&gt; v = {1,2,3,4};
	return 0;
}
```

If you did compile it with g++, you may have noticed an interesting error message:

```c++
error: in C++98 ‘v’ must be initialized by constructor, not by ‘{...}’
warning: extended initializer lists only available with -std=c++0x or -std=gnu++0x
```

That's interesting. Try to compile it with g++ again, but using C++0x instead of plain C++. Magic, now it works!

Initializers lists bring the best of C to C++ world (?) by letting you use initialize any object with an initializer. And I mean \*any\* object, not just vectors. For example, say you have a map (a map and a bunch of other stuff):

```c++
int main() {
	map&lt;string, vector&lt;int&gt;&gt; v = {
			{ "a", {1,2,3} },
			{ "b", {4,5,6} },
			{ "c", {7,8,9} }
		};

	cout &lt;&lt; v["b"][1] &lt;&lt; "n";
	return 0;
}
```

Yes, that works! Maps, vectors, pairs, and even your own custom objects, but we'll see that next time.

