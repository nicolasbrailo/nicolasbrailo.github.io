# Template metaprogramming VII: The Enemy Within

@meta publishDatetime 2010-05-27T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/05/template-metaprogramming-vii-enemy.html

Remember where were we last time? We had this code to define a list:

```c++
struct NIL {
	typedef NIL Head;
	typedef NIL Tail;
};

template &lt;typename H, typename T=NIL&gt; struct Lst {
	typedef H Head;
	typedef T Tail;
};

template &lt;int N&gt; struct Int{ static const int result = N; };
typedef Lst&lt; Int&lt;1&gt;, Lst&lt; Int&lt;2&gt;, Lst&lt; Int&lt;3&gt; &gt; &gt; &gt; OneTwoThree;
```

Now, to increase our template-foo, let's practice some basic operations. The same operations you would implement to practice your skill any other functional language. If I remember correctly these where useful when learning Haskel: getting a list's lenght, getting the Nth element, appending and preppending elements... that sort of stuff.

Let's start with the most basic: getting the length of a list. We don't really have a for loop so using recursion is the only way. It gets easier if we think again on our definition of list: "think of a list as tuple, two elements, the first (called head) will be the first element of the list and the second element as another list or a NIL object". Whit this definition of a list, then it's length turns to be 1 (the head) + the length of the remaining list (the tail), with a special case for the length of a NIL object which should always be 0. In template-speak:

```c++
template &lt;typename LST&gt; struct Length {
	typedef typename LST::Tail Tail;
	static const unsigned int tail_length = Length&lt; Tail &gt;::result;
	static const unsigned int result = 1 + tail_length;
};

template &lt;&gt; struct Length &lt;NIL&gt; {
	static const unsigned int result = 0;
};
```

I know. You are thinking "wait, what?". Well, even for this basic case we need to use some esoteric language features:

* typename is needed to tell the compiler LST::Tail is a type and not a static variable (like Length::result is). Did you remember that from [chapter IV](md_blog/2010/0506_TemplatemetaprogrammingIVNightmarestocome.md)?
* We have to use recursive templates, but you probably already figured that out. You should remember this from [chapter II](md_blog/2010/0422_TemplatemetaprogrammingIIOpenningthebox.md).
* We can provide a spetialization of a template. You should also remember this from [chapter II](md_blog/2010/0422_TemplatemetaprogrammingIIOpenningthebox.md).

Obviously, you can write it this way too:

```c++
template &lt;typename LST&gt; struct Length {
	static const unsigned int result = 1 + Length&lt; typename LST::Tail &gt;::result;
};

template &lt;&gt; struct Length  {
	static const unsigned int result = 0;
};
```

The rest of the "basic" list-operations are quite similar, but I'll leave that for another post.

---

Thank you Stéphane Michaut for pointing out typos and bugs in the code listings

