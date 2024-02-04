# Cool C++0X features XVII: Lambdas syntax

@meta publishDatetime 2013-01-10T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/01/cool-c0x-features-xvii-lambdas-syntax.html

After creating a device to sum an initializer list as an example of this new feature last time, we created a generic function to receive a function object, which worked just very similarly to Smalltalk's inject. After creating the usual function object, overloading the () operator, we saw a much cooler way of doing that using lambdas, like this:

```c++
int main() {
	auto f = [] (int a, int b){ return a+b; } ;
	do_something(f, 0, {1, 2, 3, 4});
	return 0;
}

```

Pretty cool. Pretty weird too. Let's analyze how to declare a lambda before we continue discussing about the usage of this new feature.

```c++
auto f
```

Auto f. Lambdas have a type, and you can explicitly declare it. The type might be quite complicated though, and it doesn't really add any information that makes reading the code any easier, so we are better off using C++0x's new feature, auto, which will infer the type for us. Saves a lot of typing, trust me.

```c++
auto f = [] (int a, int b)
```

Brackets, and then the parameters specification. Looks weird but the brackets are there just to tell the compiler "hey, an anonymous method comes here" (actually the brackets could be omitted in this case but we'll need them later on). After that, it's just a normal method declaration. Useless trivia: before C++0x you could have anonymous objects but not anonymous methods. Can you think where would you have an anonymous object? I think I even wrote an article about it on this blog, but I'm too lazy to search for it.

```c++
auto f = [] (int a, int b) { return a+b; }
```

After the lambda's signature, which is the same as the signature of a common method, you have the body of the method. It can be as short or as long as you want, it's just a method's body (though for the sanity of the maintainer you'd better keep it short).

Watch out though, that's not the end of the declaration, we're missing a crucial piece on this lambda:

```c++
auto f = [] (int a, int b) { return a+b; }&lt;strong&gt;;&lt;/strong&gt;
```

I'd use the blink tag, but I think it has been deprecated. Notice that last semicolon; when you declare the lambda's body you finish with a semicolon inside, just as you would inside a normal method, but that's not the end of the expression, for the lambda declared outside the body of that method still needs another semicolon to appraise the compiler god.

And now, we know almost everything we need to know about lambda's syntax. Notice how the return type of the method is automagically deduced. That's useful, but there's something the compiler can't deduce by itself about the return type. If you are trying to return a reference to something, you need to make this explicit, the compiler has no way of detecting if you need a copy return or a reference return (until the next draft of C++, which I heard incorporates mind reading capabilities into the compiler. You may have to wait a couple of years though). This is easy to specify, though:

```c++
auto f = [&amp;] (int a, int b) { return a+b; };
```

Just add an ampersand between the brackets and the lambda will return a reference instead of a copy of whatever object you're trying to return. How about receiving a reference instead of returning one? That's easy, remember the signature is the same as any other method:

```c++
auto f = [] (int&amp; a, int&amp; b) { return a+b; };
```

That's it, now we know how to use basic lambdas. You should keep in mind, though, this mythical beast has a lot more to it than just its syntax. We'll discuss about some of it's darkest secrets, how to use it, when to use it, how does it work. That discussion is for next time, though.

