# Template metaprogramming X: Zero Minus Ten

@meta publishDatetime 2010-06-17T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/template-metaprogramming-x-zero-minus.html

So far we've learned the basic constructs of template metaprogramming (loops, branching, return values) and some basic list operations (getting the length of a list, appending and prepending elements, checking if an element is included in a list). Let's put it all together by creating an operation to return the position of an element. It'll be very useful later on too.

If we go back to the Includes operation we can get some help to define the Position operation: the position of an element in a list is one plus the position of the element we're searching for in the tail, or zero if the head equals said element. The operation is not defined if the element is not in the list.

Translating to pseudo-code:

```
Position (lst.head, lst) <- 0
Position (e, lst) <- 1 + Position(e, lst.tail)

```

The translation to C++ is not so trivial this time. Try it, I'll wait... ready? OK, let's start

```c++
template &lt;class Elm, class Lst&gt; struct Position {
	typedef typename Lst::head Head;
	typedef typename Lst::tail Tail;
	static const bool found = (Head == Elm);
	static const int result = found? 0 : 1 + next;
	static const int next = Position&lt;Elm, Tail&gt;::result;
};

```

Looks easy... but doesn't work. First problem, we can't compare two types, remember? We need to use Eq again. Second problem, although we said the operation is undefined if the element is not included on the list, it would be nice if we could force the compiler to fail if (or when) that happens. Let's rewrite the operation using a façade again, but adding an Assert:

```c++
template &lt;typename Elm, typename LST&gt; struct _Position {
	typedef typename LST::head Head;
	typedef typename LST::tail Tail;

	static const bool found = Eq&lt;Elm, Head&gt;::result;
	static const int result = (found)? 0 : 1 + _Position&lt;Elm, Tail&gt;::result;
};

template &lt;typename Elm, typename LST&gt; struct Position {
	typedef typename Assert&lt;Includes&lt; Elm, LST &gt;::result&gt;::check include;
	static const int result = _Position&lt;Elm, LST&gt;::result;
};

```

Oh, we haven't defined assert yet! There's another problem, too: even if it won't compile, the compiler will try to expand \_Position< ..., NIL > indefinitely, causing an error after too many nested template calls. Not nice. We need to add a case to make the compiler stop:

```c++
/******************************************************/

// Helper: Will fail to compile if the assert is false
class Assertion{};
template &lt;bool cond, class T=Assertion&gt; struct Assert {
	typedef typename T::fail check;
};
template &lt;&gt; struct Assert&lt;true&gt; {
	typedef void check;
};

/******************************************************/

template &lt;typename Elm, typename LST&gt; struct _Position {
	typedef typename LST::head Head;
	typedef typename LST::tail Tail;

	static const bool found = Eq&lt;Elm, Head&gt;::result;
	static const int result = (found)? 0 : 1 + _Position&lt;Elm, Tail&gt;::result;
};

// The compiler will try to expand the position check
// after NIL has been reached if this isn&#x27;t here
template &lt;typename Elm&gt; struct _Position&lt;Elm, NIL&gt; {
	static const int result = 0;
};

template &lt;typename Elm, typename LST&gt; struct Position {
	typedef typename Assert&lt;Includes&lt; Elm, LST &gt;::result&gt;::check include;
	static const int result = _Position&lt;Elm, LST&gt;::result;
};

```

All that code for such a simple operation, man. Also, see what we did with Assert<>? It seems making a compile fail is actually quite easy. That's what I have most experience with.

We've been through quite a lot, and our toolboox should be quite big already. Next time we'll start steering towards some sort of applicability, trying to use some of all these stuff to implement a real, useful and working program... assuming that's even possible.


---
## In reply to this post, [Nicolás Brailovsky » Blog Archive » Quote of the week](md_blog/2010/0916_Quoteoftheweek.md) commented @ 2010-09-16T09:02:28.000+02:00:

[...] “Template metaprogramming“, chapter 10 by [...]

Original [published here](md_blog/2010/0617_TemplatemetaprogrammingXZeroMinusTen.md).
