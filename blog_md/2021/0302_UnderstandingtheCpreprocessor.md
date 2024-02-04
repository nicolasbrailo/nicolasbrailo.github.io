# Understanding the C preprocessor

@meta publishDatetime 2021-03-02T16:08:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl http://monkeywritescode.blogspot.com/p/understanding-c-preprocessor.html

---

C preprocessor: Just a simple replacer?
---------------------------------------

Lately, out of curiosity, I spent some time to better understand how the C preprocessor works. I admit it, I thought it was a very dumb copy-paste based replace mechanism, only capable of doing the simpler keyword matching and replacement. Boy, was I wrong. Turns out the preprocessor is actually an organically grown pseudo language (as opposed to a properly designed language feature) inside C, which later got standardized through an incredibly complex set of rules and definitions. Rules for recursion, expansion, pattern matching and crazy operators like # and ## are some of the things that I never before knew existed in the preprocessor.

During my time toying with the preprocessor I learned a few things about recursion, the different operators supported by it and some crazy things about the order of conditional evaluation. I'll summarize some of the things I learned in the next few posts: you might want to check 16.3 in the C++ standard, since the next few articles will be only explanations about different paragraphs on this section.
Disclaimer: if you find any real-world utility to these bits of preprocessor trivia, you are probably doing something horribly wrong or horribly evil!

---

C preprocessor II: stringify operator
-------------------------------------

We all more or less know the list of operators that C++ provides for "normal code" but not everyone is aware that the preprocessor also has special operators we can use. Small difference: an operator like '+' will usually operate on numbers, but the preprocessor operates only on a single concept: source code tokens. What kind of operators could a preprocessor have, then? Two, actually. Let's start with the simpler one:

**Stringify**
The '#' operator is the simplest operator of the preprocessor: it converts the next token to string. Something like this, for example:

```c++
#define f(x) to_str(x) == #x
f(123)
```

Would print

```c++
to_str(123) == "123"
```

A restriction applies to the stringify operator: it can only be applied to a macro param, not just any token. So this, for example, is an illegal macro:

```c++
#define f(x) #123 == #x
```

There's another operator, which is a bit more "esoteric". We'll talk about token pasting next time.

---

C preprocessor III: Token pasting
---------------------------------

A stringify operator is good but the token pasting operator goes off the awesomeness chart (if you're working on an ioccc entry, that is). Actually, what token pasting does is conceptually simple: it will paste together two tokens to form a new one. So, for example, PASTE(foo, bar) would result in the "foobar" token. Looks simple enough, doesn't it? The token pasting operator is invoked via '##'. For example:

```c++
#define PASTE(x, y) x ## y
#define FOOBAR 42
int main() { return PASTE(FOO, BAR); }
```

The previous code would just return 42. So what's the usefulness of a paste operator? Other than obfuscating stuff, you can use it to create classes with similar interfaces but different method names (I'm not saying it's a good idea, I'm saying you can). For example:

```c++
#define MAKE_GET_SET(x, T) \
               void set_ ## x (T o) { this-&gt;x = o; } \
               T get_ ## x () { return this-&gt;x; }
class Foo {
  MAKE_GET_SET(foo, int);
```

The token pasting operator doesn't have the limitation of being applicable only to a macro parameter, so code like "12 ## 34" is a perfectly valid operation which results in "1234". It does have a catch: if the resulting token is not valid the behavior is undefined. This means that, for example, pasting "12" and "foo" together produces "12foo", which is not a valid token. Being the operation undefined means that a compiler might reject this operation (I'm pretty sure gcc does) or that it might do a completely different thing (it could choose to ignore the token pasting operator and it would still be standard compliant).

Nasal demons FTW!

---

C preprocessor IV: VA Args
--------------------------

And things just got even more awesome in our preprocessor series: if just passing a known number of parameters is not cool enough for you you can use a variable number of arguments on a macro definition too. This is very useful to implement printf style debug macros which get replaced by no tokens on a release build. Or to make debugging a bit more complicated, your choice.

```c++
#define DEBUG(fmt, ...) printf(fmt, __VA_ARGS__);
```

Combining this with stringify will provide you hours of fun. Combining this with token pasting... well, that's just evil.

---

C preprocessor V: Conditionals
------------------------------

While walking around the c preprocessor we came to know the stringify operator, the crazy token pasting operator and a \_\_VA\_ARGS\_\_ macro. All very weird, but at least the #if's work in a sane way... or do they? They do, but there's some room for unexpected behavior if you don't know some implementation details. Take this code for example:

```c++
#if 0
#  if 0
#  else
#  elif true
#  endif
#endif
```

Clearly the inner if is wrong because the else clause comes before the elseif, however you might think it doesn't matter because it's surrounded by an #if 0. Surprise: it does matter, that's not valid preprocessor input. Even if the outer #if is not "taken", whatever preprocessing directives are inside it should still be valid (though anything that's not a preprocessing directive will indeed be ignored).

Even though at first it might seem weird for things inside an #if 0 to be important, it makes sense if you think that should an internal #if not respect the proper structure then the preprocessor wouldn't know when to end the first #if 0. Then again, if you find any real-world utility to this bit of preprocessor implementation trivia, you are doing something horribly wrong!

---

C preprocessor VI: Recursive macro expansion rules
--------------------------------------------------

What happens if you define a recursive macro? This might seem like a silly question, but by asking it we can gain some insight on the inner working of the preprocessor.

Let's start with a simple example:

```c++
#define foo bar 1
#define bar foo 2
foo
```

Luckily the preprocessor is smart enough not to trip up on this simple piece of code. When expanding foo on line three it will do something like this:

```c++
#define foo bar
#define bar foo
foo
// Applies foo -&gt; bar 1
bar 1
// Applies bar -&gt; foo 2
foo 2 1
// Scans foo again... but doesn't expand it
```

The second time the preprocessor scans foo it won't expand it: it "knows" foo was already expanded, so it won't do it again. But how does it know that foo was already expanded? Let's try something a bit more complicated:

```c++
#define foo bar a baz b
#define bar foo 1
#define baz bar 2
foo
```

And then let's see how foo is expanded, step by step:

```c++
#define foo foo a bar b baz c
#define bar foo 1
#define baz bar 2
foo
```

First the rule "foo -> foo a bar b baz c" will be applied and the results rescanned: let's call this scope 1. We'll end up with:

```c++
foo a bar b baz c
```

Now the results of this expansion will be scanned, in a new scope. Let's call it scope 2. The first token the preporcessor will see is "foo", which was already expanded on scope 1: it will be ignored and it will continue to the next expandable token, "bar", and it will expand it like this:

```c++
foo a foo 1 b bar 2 c
```

On the scope that baz's expansion creates (scope 4), the parent's scope expansion rules are "inherited", so for scope 4 "foo" was already expanded but "bar" was not, because bar's expansion happened on scope 3 and scope 3 is not scope's 4 parent. Not following me? Try following this diagram:

```c++
foo -&gt; foo a bar b baz c
    foo -&gt; already expanded, ignore
    a   -&gt; not a macro, ignore
    bar -&gt; expand to "foo 1"
        foo -&gt; expanded at parent scope, ignore
        1   -&gt; not a macro, ignore
    b   -&gt; not a macro, ignore
    baz -&gt; expand to "bar 2"
        bar -&gt; expand to "foo 1"
            foo -&gt; already expanded at parent scope, ignore
            1   -&gt; not a macro, ignore
        2   -&gt; not a macro, ignore
    c   -&gt; not a macro, ignore
```

Hopefully the preprocessor expansion rules should be a bit more clear now: each expansion creates a scope, each scope inherits from parent's scopes whether a rule was applied or not and if it was then said rule is ignored in the current scope.

Of course these rules get more complicated when dealing with token pasting and stringifying operators, because each phase (stringifying, token pasting, rescanning and expansion) will happen in a specific order. Things get even more complicated when you realize (by reading the standard) that said order is not the same when you deal with argument replacement.

Then again, it's probably a good idea if your macros don't rely on the recursive expansion rules of the preprocessor.

---

C preprocessor VII: Recursive expansion on function macros
----------------------------------------------------------

The last time we talked about recursive expansion rules on C's preprocessor: to sum it up, each expansion creates a scope, that contains a list of all macros which have already been expanded in said scope, or in a parent scope. That gives us a very nice and easy to understand tree of already-expanded rules.

Clearly that's too easy for C. We need more complexity: we need to make the expansion rules interact with the argument substitution process and the preprocessor operators too!

How exactly? The whole process is specified by a very tiny paragraph, 16.3.1, on the standard, which despite being tiny contains a lot of information. Actually, it contains all the expansion and precedence rules for the preprocessor. And it's more or less like this:

1. Argument scanning: the perprocessor binds a set of tokens to each argument name. If there are extra arguments and the token "..." is part of the macro's signature, a \_\_VA\_ARGS\_\_ argument is created. (to put it simply: it will bind a set of tokens like "(a,b)" to an identifier like "ARG1").
2. Stringify and token pasting is applied ONLY to the arguments, not to the body function.
3. Each argument is recursively scanned for macro expansion, as if each argument was on a file on its own (imagine a new file is created with only preprocessor directives and the argument, then apply the expansion algorithm recursively to that file).
4. After the arguments have been fully expanded, they are substituted on the macro's body.
5. The resulting definition is then rescanned for macro expansions or token pasting operators.
6. A side effect of this multi-phase macro expansion is that the nice expansion tree we used to have no longer works.

Let's take this example:

```c++
#define str(...) #__VA_ARGS__
#define foo(a, b) foo a bar str(b)
#define bar foo bar 1
foo(bar, (1, 2, 3))
```

How can we expand this macro call? Like this:

```
expand{ foo(bar) }
        Match foo with definition of macro: foo(a)
            Bind a to bar
            Macro expand argument a -> expand{ bar }
                    bar takes no arguments, no binding is done
                    Apply rule bar -> foo bar 1
                    Scan the result for new expanions
                            foo was already expanded, no further expansion

            Bind b to (1, 2, 3)
            Macro expand argument b -> nothing to expand

        Replace macro expanded arguments in body definition:
            -> foo foo bar 1 bar str((1, 2, 3))

        Rescan the body for further expansion:
                foo: Already expanded on current scope
                foo: Already expanded on current scope
                bar: Already expanded (The compiler will have too keep a map of expanded macros for each identifier in a definition!)
                bar: Needs expansion
                        Apply rule bar -> foo bar 1
                        Rescan for further expansion
                                foo: Already expanded on parent scope
                                bar: Already expanded on current scope
                str((1, 2, 3)): Expand macro call
                        Bind (1, 2, 3) to __VA_ARGS__
                            Analyze (1, 2, 3) for further expansion
                            Apply operator '#' to (1, 2, 3) -> "(1, 2, 3)"
                        Replace #__VA_ARGS__
                Replace the result of str((1,2,3)) -> "(1, 2, 3)"

        Replace the original call "foo(bar, (1, 2, 3))" for the result
            -> foo foo bar 1 foo bar 1 "(1, 2, 3)"
```

This last example should be a good representative of the complexities involved in a macro expansion; hopefully now you know more than you ever wanted to know about macros.

