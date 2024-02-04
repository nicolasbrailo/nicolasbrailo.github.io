# Template metaprogramming III: Entering Pandemonium

@meta publishDatetime 2010-04-29T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/04/template-metaprogramming-iii-entering.html

If you are here and you have read the previous two parts then you are crazy. If you haven't then go and read it, then never come back if you value your sanity at all. We saw last time an example of a factorial using template metaprogramming, now it's time for something a little bit more fun. I was thinking on lists, but that's a bit too much for starters: let's do some more math. Now with fractions!

So, how would you express a fraction? The fun part, and you already know this, you have only types (\*), there are no variables. Luckly static const int saves the day:

```c++
template &lt; int N, int D &gt; struct Frak {
	static const long Num = N;
	static const long Den = D;
};
```

Woo hoo... how boring, let's do something on those Fraktions, so they don't get bored... like multiplying:

```c++
template &lt; int N, typename X &gt; struct ScalarMultiplication {
	static const long Num = N * X::Num;
	static const long Den = N * X::Den;
};
```

Well that does the job, I guess, but it's ugly. Too ugly... why would we redefine a Fraction when we already have a great definition? Let's try again:

```c++
template &lt; int N, typename X &gt; struct ScalarMultiplication {
	typedef Frak&lt; N*X::Num, N*X::Den &gt; result;
};
```

OK, now you think I'm pulling your leg, but, promise, I'm not. This actually works, and it looks nice! Check out that sexy typedef: you can't have variables, we said, so instead we return types. Frak is a type when binded to two concrete values, so Frak is a type too. Just typedef it to a result and be done with it.

How do we test if it worked? Easy:

```c++
int main() {
	typedef Frak&lt; 2, 3 &gt; Two_Thirds;
	typedef ScalarMultiplication&lt; 2, Two_Thirds &gt;::result Four_Sixths;
	std::cout &lt;&lt; Four_Sixths::Num &lt;&lt; "/" &lt;&lt; Four_Sixths::Den &lt;&lt; "n";
}
```

Nice! By now you should have learned how to return new types, which are the result types for template metaprogramming devices. You should have also learnt how to write a device which operates on another template device... congratulations, that's metaprogramming. Next time, something a little bit more interesting.

(\*) Boring theory rant: What do I mean you can't have return values so you must use types instead? Let's see: a variable or an attribute are both parts of an object. If I have a variable named height in a class named Person, then each person gets his own height. Even if the numeric value is the same there won't be two shared height attributes. On the other hand static const vars are defining parts of classes, not objects; stupidity could be static const var of Person (only in this case we'd all be equally stupid... this is were the analogy falls apart, I'm sorry).

Knowing the difference between an object and a class defining characteristics, it is clear we can only use static const stuff - it's nonsense talking about template-objects, it's all about template classes.

