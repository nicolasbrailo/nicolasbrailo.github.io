# Template metaprogramming II: Openning the box

@meta publishDatetime 2010-04-22T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/04/template-metaprogramming-ii-openning-box.html

We saw last time how to print a factorial using only template metaprogramming, but didn't explain anything about it. I promised to fix that in this article. Starting by the very beginning:

```c++
template &lt;int N&gt; struct Factorial {
	static const int result = N * Factorial&lt;N-1&gt;::result;
};

template &lt;&gt; struct Factorial&lt;0&gt; {
	static const int result = 1;
};

int main() {
	std::cout &lt;&lt; Factorial&lt;5&gt;::result &lt;&lt; "n";
	return 0;
}
```

### Why static const?

Templates get evaluated on compile time, remember? That means all that code actually executes when compiling the source, not when executing the resulting binary (assuming it actually compiles, of course). Having as a constraint the fact that all your code must resolve on compile time means only const vars make sense. Also, as you're working with classes (templates are applied to classes, not objects) only static objects make sense.

That explains the *static const* thing, what about the Factorial<0>? Well it's obviously an edge case. It describes a specific case of a Factorial. It's a specialization! Why do we need it? Take a look again at the definition of struct Factorial: it's a recursive definition. How do we break from the recursive loop? With a base case, obviously.

If this is starting to remind you of anything then you are crazier than you think, and you already know some Haskel. Indeed, template metaprogramming has some resemblance to Haskel programming: no const "variables", no for-loop (only recursion), base cases (pattern matching), and cryptic error messages which makes you want to jump of a cliff.

A useful trick I learned when working with Haskel (many many years ago) is to declare the problem, instead of thinking it. For our problem the factorial of a number is defined as said number times the factorial of that same number minus one, being the factorial of 0 always 1.

Translating:

```c++
// the factorial of a number is defined as said number times
// the factorial of that same number minus one

template &lt;int N&gt; struct Factorial {
	static const int result = N * Factorial&lt;N-1&gt;::result;
};

// being the factorial of 0 always 1.
template &lt;&gt; struct Factorial&lt;0&gt; {
	static const int result = 1;
};
```

That's good for a first approach... next time something more complex (and less theory, promise).

---

Thanks to Stéphane Michaut for reporting broken code in this page.


---
## In reply to [this post](), [Felix]() commented @ 2020-10-29T10:18:31.000+01:00:

Hi!
Maybe I am missing the point, but shouldn't it be

template struct Factorial {
 static const int result = N \* Factorial::result;
};

Otherwise the template instantiation leads to an endless recursion.
Anyway, thanks for your awesome blog posts!

Original [published here](md_blog/2010/0422_TemplatemetaprogrammingIIOpenningthebox.md).

---
## In reply to [this post](), [Felix Berlakovich]() commented @ 2020-10-29T10:19:22.000+01:00:

Sry, I meant N \* Factorial::result;

Original [published here](md_blog/2010/0422_TemplatemetaprogrammingIIOpenningthebox.md).

---
## In reply to [this post](), [Felix]() commented @ 2020-10-29T10:22:14.000+01:00:

Apparently the N-1 template argument gets stripped off in the comments and probably also in your source code listing. That is why I thought there was a mistake in the listing and also in my comment.

Original [published here](md_blog/2010/0422_TemplatemetaprogrammingIIOpenningthebox.md).

---
## In reply to [this post](), [nicolasbrailo](/md_blog) commented @ 2020-10-29T17:55:51.000+01:00:

Lol! Yeah I gave up fixing those. It breaks every year or so. If you are reading this article in 2020, it's probably good if you can't compile the examples. You should be using constexprs nowadays anyway :)

Original [published here](md_blog/2010/0422_TemplatemetaprogrammingIIOpenningthebox.md).
