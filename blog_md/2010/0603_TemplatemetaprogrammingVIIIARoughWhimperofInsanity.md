# Template metaprogramming VIII: A Rough Whimper of Insanity

@meta publishDatetime 2010-06-03T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/template-metaprogramming-viii-rough.html

Remember last time? We learned how to get the lenght of a list. This time I'll introduce some more of these basic ops. Let's begin with "Nth": getting the Nth element of a list; which, remember, in this case is a type, not a concrete element. This means the Nth element will be something like int, char, const char\*, not 1, 2 or 3. We introduced a trick to get around this limitation before using a template , go there to refresh your memory if needed.

So, what would the coloquial definition of "Nth" be? I'd put it like "The operation Nth for a list equals the head of the list for N = 0 and Nth (minus one) of the tail otherwise". A little bit more formally:

```
Nth(0, lst) <- lst.head
Nth(n, lst) <- Nth(n-1, lst.tail)

```

Translating this to C++ should be a breeze to you now. Try it, I'll wait. Read? OK, this is MY answer:

```c++
template &lt;typename LST, int N&gt; struct Nth {
	typedef typename LST::Tail Tail;
	typedef typename Nth&lt;Tail, N-1&gt;::result result;
};

<p>template &lt;typename LST&gt; struct Nth&lt;LST, 0&gt; {
	typedef typename LST::head result;
};

```

Though the structure is very similar to the previous "basic operation", getting the length of a list, the concept is quite different. This time we're defining a return type recursively. Anyway, it was too easy indeed, let's try a more complex operation now.

How can we check if an element exists on a list? Seems easy enough, an element is included in a list if the head equals the element itself or if the element is included in the tail. In the pseudo language I just invented:

```
Includes(lst.head, lst) <- true
Includes(e, lst) <- Includes(e, lst.tail)

```

Looks easy, right? Well, there's a bug there, can you spot it? Yeah, we're missing the false condition. We should add a third specialization:

```
Includes(lst.head, lst) <- true
Includes(e, NIL) <- false
Includes(e, lst) <- Includes(e, lst.tail)

```

Again, let's translate the pseudocode to C++. Try it, I'll wait. Read? OK, this is MY answer:

```c++
template &lt;class Elm, class Lst&gt;
struct Includes {
	typedef typename LST::head Head;
	typedef typename LST::tail Tail;

	static const bool found = (Elm == Head);
	static const bool found_tail = Includes&lt;Elm, Tail&gt;::result;
	static const bool result = found || found_tail;
};

template &lt;class Elm&gt; struct Includes &lt;Elm, NIL&gt; {
	static const bool result = false;
};

```

Looks nice, doesn't it? Too bad it won't work, you can't compare two types. What would (int == char) mean in C++? We need a helper there, some kind of trick to compare two types. We can use partial template specialization again:

```c++
template &lt;class X, class Y&gt;
struct Eq { static const bool result = false; }

template &lt;class X&gt;
struct Eq&lt;X, X&gt; { static const bool result = true; }

```

With this little struct now we can write our include operation this way:

```c++
template &lt;class Elm, class Lst&gt;
struct Includes {
	static const bool result = Eq&lt;Elm, typename LST::head&gt;::result
				   || Includes&lt;Elm, typename LST::tail&gt;::result;
};

template &lt;class Elm&gt; struct Includes&lt;Elm, NIL&gt; {
	static const bool result = false;
};

```

Very esoteric looking, the right mix of Haskel, C++ and booze to ensure job security for life. Next time we'll find a way to search for the position of an element, a somewhat more complicated task.

