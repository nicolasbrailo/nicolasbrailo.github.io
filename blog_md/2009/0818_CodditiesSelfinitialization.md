# C++ oddities: Self initialization

@meta publishDatetime 2009-08-18T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/08/c-oddities-self-initialization.html

I get it, C++ is a complex language, but man, I'd like a little warning (lol) when this happens:

```c++
class Foo {
  int bar;
  Foo() : bar(bar) {}
};
```

Yeah, it bit me in the ass the other day. Why? A method's signature was awfully long, I wanted to delete a parameter and ended up deleting two. Luckly my [unit tests](http://code.google.com/p/googletest/) where there to save the day, but regardless, WTF?

