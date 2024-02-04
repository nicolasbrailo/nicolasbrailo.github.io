# C preprocessor VII: Recursive expansion on function macros

@meta publishDatetime 2013-10-01T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/c-preprocessor-vii-recursive-expansion.html

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

