# Cool C++0X features XIII: auto and ranged for, cleaner loops FTW

@meta publishDatetime 2012-11-29T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/11/cool-c0x-features-xiii-auto-and-ranged.html

Long time without updating this series. Last time we saw how the ugly

```c++
for (FooContainer::const_iterator i = foobar.begin(); i != foobar.end(); ++i)
```

could be transformed into the much cleaner

```c++
for (auto i = foobar.begin(); i != foobar.end(); ++i)
```

Yet we are not done, we can clean that a lot more using for range statements.

Ranged for is basically syntactic sugar (no flamewar intended) for shorter for statements. It's nothing new and it's been part of many languages for many years already, so there will be no lores about the greatness of C++ innovations (flamewar intended), but it still is a nice improvement to have, considering how tedious can be to write nested loops. This certainly looks much cleaner:

```c++
for (auto x : foobar)
```

This last for-statement, even though it looks good enough to print and hang in a wall, raises a lot of questions. What's the type of x? What if I want to change its value? Let's try to answer that.

The type of the iterator will be the same as the type of the vector, so in this case x would be an int:

```c++
std::vector foobar;
for (auto x : foobar) {
	std::cout &lt;&lt; (x+2);
}
```

And now, what happens if you want to alter the contents of a list and not only display them? That's easy too, just declare x as an auto reference:

```c++
std::vector foobar;
for (auto&amp; x : foobar) {
	std::cout &lt;&lt; (x+2);
}
```

This looks really nice but it won't really do anything, for two different reasons:
* Ranged fors won't work until g++ 4.5.6 is released
 * The list is empty!

There are many ways to initialize that list, but we'll see how C++0X let's you do it in a new way the next time.

