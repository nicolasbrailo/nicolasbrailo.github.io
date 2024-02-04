# Operator sizeof (AKA Reading Berkeley's FM, take II)

@meta publishDatetime 2010-03-29T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/03/operator-sizeof-aka-reading-berkeley-fm.html

[Last time](/blog_md/2010/0326_ReadingBerkeley39sFM.md) I told you about an evil snipet I found on Oracle Berkeley DB's manual:

```c++
  skey-&gt;size = sizeof((struct student_record *)pdata-&gt;data)-&gt;last_name;
```

And we concluded it's trying to... well, dereference a number. And yet it compiles. What the hell is going on there?

The answer here is in the subtleties of the sizeof **operator**. That's right, **operator**, not function. Plus is an operator. Less is an operator. \* is a (unary) operator. sizeof is a unary operator too. The relevance of this is that operators can behave in more bizzare ways than functions do. In this case there's a difference between this two lines:

```c++
  MyClass x;
  int a = sizeof(MyClass);
  int b = sizeof(x);
```

A very subtle difference. Can you spot it? a and b will have the exact same value, rest assured. The difference is in the operator itself: sizeof MUST have parenthesis when applied to a type name, yet parenthesis are optional when applied to an instance of a datatype, so this code is legal:

```c++
  MyClass x;
  int a = sizeof(MyClass);
  int b = sizeof x;
```

Oh, wait, the fun doesn't stop there: sizeof also has bizarre precedence order, meaning it won't get applied as you expect it. So, this is valid too:

```c++
  struct MyClass { int y; } x;
  int b = sizeof x-&gt;y;
```

Can you see where we are going? Knowing that sizeof will be applied last lets you write something like this too:

```c++
  void *ptr = ...
  int b = sizeof((X*)ptr)-&gt;y;
```

Which means nothing else than "store in b the size of member y in struct X. It should be easy to see why BDB's example does compile, and why did I spend half an hour trying to understand the reason it compiled fine.

By using some more casts and a clever arangement of parenthesis you can come up with a great job security device.

