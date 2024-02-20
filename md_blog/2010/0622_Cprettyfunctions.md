# C++ pretty functions

@meta publishDatetime 2010-06-22T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/c-pretty-functions.html

There are two well known macros from the preprocessor which every macro-sorcer must know. They are \_\_FILE\_\_ and \_\_LINE\_\_. You probably already know about them but anyway, \_\_FILE\_\_ will give you the current file and \_\_LINE\_\_ the current line. Easy, huh?

```c++
int main() {
   printf("%s : %i", __FILE__, __LINE__);
   return 0;
}
```

The program above would give you "main.cpp : 3" as a result. There is nothing going on at execution time, it's all preprocesor wizardy. In fact with "**g{++/cc} -E**" you can even check what the "real" output is (-E means to return the preprocessor output. Keep in mind a lot of stuff will be included from the headers you use).

```c++
int main() {
   printf("%s : %i", "main.cpp", 3);
   return 0;
}
```

Well that's nice and all, but g++ can top this easily:

```c++
int main() {
   std::cout &lt;&lt; __PRETTY_FUNCTION__ &lt;&lt; "n";
   return 0;
}
```

There are a couple of notable things about this new "pretty function" thing:
* 1. It will demangle a function's name
* 2. This time it isn't a preprocessor secret thing but a real variable g++ will create.

You can easily use this for better logging functions now (with some macro wizardy, obviously).


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Cool C++0X features VI: A variadic wrapper](/md_blog/2011/0531_CoolC0XfeaturesVIIIVariadicwrapperandtypeinferencewithdecltype.md) commented @ 2011-05-17T09:06:06.000+02:00:

[...] you want to wrap do\_something with something else (Remember \_\_PRETTY\_FUNCTION\_\_?). This is a solution, the worst one [...]

Original [published here](/md_blog/2010/0622_Cprettyfunctions.md).
