# C preprocessor II: stringify operator

@meta publishDatetime 2013-08-27T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/08/c-preprocessor-ii-stringify-operator.html

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

