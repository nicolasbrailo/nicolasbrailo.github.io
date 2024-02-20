# Template metaprogramming VI: The Spider Webb

@meta publishDatetime 2010-05-20T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/05/template-metaprogramming-vi-spider-webb.html

We have been building our template meta-foo for five chapters now, and I think we are ready to move on to more advanced topics. We will be borrowing a lot more from functional languages from now on, so you may want to actually start practicing some template metaprogramming to keep advancing.

In our previous entries we worked with basic building blocks, making it quite easy to keep in mind the whole "program flow". Now it won't be so easy anymore, as we'll be using real metaprogramming (i.e. templates operating on templates) so a lot more thought will be needed for each program.

Another point to keep in mind, you don't have a debugger here. All the magic occurs at compile time so there is no gdb to step through your program to find a logic flaw. There's a little trick to check if you are too far off from the target but, mainly, you'll have to think for yourself.

Let's start with any functional programming course basics: lists. We have to think, first, how can a list make any sense when you only have types and no values. It means you can have a list like "int, char, void\*\*, Foo", and not something like "1, 2, 3". Or, can you? There's a way to trick the compiler into creating a type from a integral value:

```c++
template &lt;int N&gt; struct Int {
	static const int value = N;
};
```

Voila! Now you can create a list of numbers. For our next trick, let's implement the list itself. No pointer magic, think of a functional definition of a list. Come on, I'll wait... ready? OK, a list is a tuple T of two values, in which the first element, called head, is the first element of the list and the second element, called tail, is either a list or the NULL element.

Quite a mouthful... let's go over that definition again:

```c++
// A list is a tuple T of two values
List: [ ..., ... ]

// in which the first element, called head, is the first element of the list
List: [ Head, ... ]

// and the second element, called tail,
List: [ Head, Tail]

// is either a list or the NULL element
List: [ Head, Tail]
Tail: List | Nil
```

So, as an example, a list of numbers could be expressed as:

```c++
	List( 1, List( 2, List( 3, NIL ) ) )
```

Closing up... how would you define this list in C++? Easy:

```c++
template &lt;typename H, typename T&gt; LST {
	typedef H Head;
	typedef T Tail;
};
```

We need here a NIL type to use as a list ending element. We could also use a default template type, so we won't have to write the last NIL to end a list definition. Thus we have now:

```c++
struct NIL {
	typedef NIL Head;
	typedef NIL Tail;
};

template &lt;typename H, typename T&gt; struct LST {
	typedef H Head;
	typedef T Tail;
};
```

Nice. You should remember the following rules:

1. We can use template to define a template class, defining a new type based on a number instead of another type ;)
 - We can't "store" a value in a type... unless we store it as a static value, that is.
 - Using a convention for defining result holding variable names is very useful, as there are no interfaces and more than once we'll be using a result from an unknown class

With that said, let's translate the list (1, 2, 3) to Tmpl C++

```c++
template &lt;int N&gt; Int{ static const int result = N; };
typedef Lst&lt; Int&lt;1&gt;, Lst&lt; Int&lt;2&gt;, Lst&lt; Int&lt;3&gt; &gt; &gt; &gt; OneTwoThree;
```

Not so bad to start with. Next time we'll be doing something a little bit more useful with this list.

One last note, initializing a static const int in the definition of the class may be non portable (some compilers seem to have trouble with it). An enum may be used instead.

