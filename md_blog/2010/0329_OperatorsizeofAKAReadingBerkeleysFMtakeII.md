# Operator sizeof (AKA Reading Berkeley's FM, take II)

@meta publishDatetime 2010-03-29T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/03/operator-sizeof-aka-reading-berkeley-fm.html

[Last time](/md_blog/2010/0326_ReadingBerkeley39sFM.md) I told you about an evil snipet I found on Oracle Berkeley DB's manual:

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


---
## In reply to [this post](), [Gregory Burd](http://oracle.com/) commented @ 2010-03-29T18:26:21.000+02:00:

Nico,

Do you really hate "Berkeley" or just the ANSI C programming language? :)

"DB" is a type name for a struct and part of our ANSI C API while the "Db" is it's counterpart in C++. "Db" is a C++ Class name. You'll choose one or the other depending on the language you use. DB if you're programming in C, Db if you're programming in C++. Make sense?

The use of the ANSI C sizeof operator works perfectly in our manual, as you discovered, but I'll agree that it is hard to parse at first. You have to understand that sizeof is an operator and the precedence of it verses other C operators to fully get how that single line of code works. It's a bit obtuse and we are considering making the example code less complex in the next release.

I hope that helps.

-greg

Original [published here](/md_blog/2010/0325_IhateBerkeley.md).

---
## In reply to [this post](), [nico](/md_blog/youfoundadeadlink.md) commented @ 2010-03-29T18:59:07.000+02:00:

> “DB” is a type name for a struct and part of our ANSI C

> API while the “Db” is it’s counterpart in C++. “Db” is a C++

> Class name. You’ll choose one or the other depending on

> the language you use. DB if you’re programming in C, Db

> if you’re programming in C++. Make sense?

Sorry, it does not. Not using a namespace is by itself a bad thing but having two similar things which differ only by the capitalization of their name is error prone and leads to strange error messages, not to mention that it's one of the things
that you get told not to do in any first programming class.

You can live with it; it is a poor programming practice regardless.

> The use of the ANSI C sizeof operator works perfectly in our manual,
> as you discovered, but I’ll agree that it is hard to parse at first.

Again, I disagree: it's plain wrong to justify it saying it works that way when a much clear option (using parenthesis) exists, without any downside.

I can write C++ programs using only a big main. It works but it's wrong. I can use a sizeof operator to obfuscate my code, but I'd leave that for IOCCC, not for a public api manual.

> I hope that helps.

I find Berkeley to be a good product for what it was designed, but it has to many programming bad practices which force you to work with its manual right by your side, until you can hide it under an abstraction layer, and that's what I hate about Berkely.

Original [published here](/md_blog/2010/0325_IhateBerkeley.md).
