# Cool C++0X features X: type inference with decltype

@meta publishDatetime 2011-06-10T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/06/cool-c0x-features-x-type-inference-with.html

After creating a [wrapper object](md_blog/2011/0531_CoolC0XfeaturesVIIIVariadicwrapperandtypeinferencewithdecltype.md) on the last entries, we were left with three syntax changes two analyze:

* [-> (delayed declaration)](md_blog/2011/0607_CoolC0XfeaturesIXdelayedtypedeclaration.md)
* decltype
* auto

We already saw the first, and we'll be talking about the other two this time. This was the original wrapper function which led us here:

```c++
template <class... Args>
auto wrap(Args... a) -> decltype( do_something(a...) ) {
	std::cout << __PRETTY_FUNCTION__ << "n";
	return do_something(a...);
}
```

Back on topic: **decltype**
This operator (yes, decltype is an operator) is a cousin of sizeof which will yield the type of an expression. Why do I say it's a cousin of sizeof? Because it's been in the compilers for a long time, only in disguise. This is because you can't get the size of an expression without knowing it's type, so even though it's implementation has existed for a long time only now it's available to the programmer.

One of it's interesting features is that the expression with which you call decltype won't be evaluated, so you can safely use a function call within a decltype, like this:

```c++
auto foo(int x) -> decltype( bar(x) ) {
	return bar(x);
}
```

Doing this with, say, a macro, would get bar(x) evaluated twice, yet with decltype it will be evaluated only once. Any valid C++ expression can go within a decltype operator, so for example this is valid too:

```c++
template <typename A, typename B>
auto multiply(A x, B y) -> decltype( x*y )
{
	return x*y;
}
```

What's the type of A and B? What's the type of A\*B? We don't care, the compiler will take care of that for us. Let's look again at that example, more closely:

**-> (delayed declaration) and decltype**
Why bother creating a delayed type declaration at all and not just use the decltype in place of the auto? That's because of a scope problem, see this:

```c++
// Declare a template function receiving two types as param
template <typename A, typename B>
// If we are declaring a multiplication operation, what&#x27;s the return type of A*B?
// We can&#x27;t multiply classes, and we don&#x27;t know any instances of them
auto multiply(A x, B y)
// Luckily, the method signature now defined both parameters, meaning
// we don&#x27;t need to expressly know the type of A*B, we just evaluate
// x*y and use whatever type that yields
	-> decltype( x*y )
{
	return x*y;
}

```

**decltype**
As you see, decltype can be a very powerful tool if the return type of a function is not known for the programmer when writing the code, but you can use it to declare any type, anywhere, if you are too lazy to type. If you, for example, are very bad at math and don't remember that the integers group is closed for multiplication, you could write this:

```c++
	int x = 2;
	int y = 3;
	decltype(x*y) z = x*y;
```

Yes, you can use it as VB's dim! (kidding, just kidding, please don't hit me). Even though this works and it's perfectly legal, auto is a better option for this. We'll see that on the next entry.

