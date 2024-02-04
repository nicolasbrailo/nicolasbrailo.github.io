# C preprocessor VI: Recursive macro expansion rules

@meta publishDatetime 2013-09-24T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/09/c-preprocessor-vi-recursive-macro.html

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

