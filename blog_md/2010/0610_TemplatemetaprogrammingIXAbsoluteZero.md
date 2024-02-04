# Template metaprogramming IX: Absolute Zero

@meta publishDatetime 2010-06-10T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/template-metaprogramming-ix-absolute.html

By now we should have learned how to perform loops, branching and returns using templates. Let's add a couple of useful operations to our library: append and prepend.

Prepending an element to a list is very easy: the result is a list (oh surprise) consisting of a head (the element we want to add) and a tail (the old list). In the pseudocode I've been using so far:

```
Prepend(e, lst) <- LST(e, lst)

```

And in C++ (trivial, this time):

```c++
template &lt;typename Elm, typename Lst=NIL&gt; struct Prepend {
	typedef LST&lt;Elm, Lst&gt; result;
};

```

Appending is a little bit more difficult, as we need to first find the end of the list. Think for a second how would you define it... back? Ok, I'd define it this way: appending an element to the list yields a list, consisting of the same head and the result of appending said element to the tail. The null case, as usual, is appending an element to a NIL list; in this case the result is a list with the element itself. So:

```
Append(e, NIL) <- LST(e)
Append(e, lst) <- LST(lst.head, Append(e, lst.tail))

```

Looks complicated but it follows the same structure as the rest of the basic-ops:

```c++
template &lt;class Elm, class Lst&gt; struct Append {
	typedef typename Lst::head Head;
	typedef typename Lst::tail Tail;

<p>	typedef typename Append&lt;Elm, Tail&gt;::result Next;
	typedef typename LST&lt;Head, Next&gt;::result result;
};

<p>template &lt;class Elm&gt; struct Append&lt;Elm, NIL&gt; {
	typedef LST&lt;Elm&gt; result;
};

```

Easy. Now, what happens if we want to add a default value for Lst, so we can use Append to create lists? Easy too, but we need a façade this time; just rename Append to \_Append, then

```c++
// This is here just because I wanted a default param :D
template &lt;typename Elm, typename Lst=NIL&gt; struct Append {
	typedef typename _Append&lt;Elm, Lst&gt;::result result;
};

```

I promised to add one more operation to our toolbox, returning the position of an element, but this post is getting quite long and I'm afraid it may be too much for the average attention span of a programmer... we'll leave it for next time.

