# C preprocessor IV: VA Args

@meta publishDatetime 2013-09-10T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/09/c-preprocessor-iv-va-args.html

And things just got even more awesome in our preprocessor series: if just passing a known number of parameters is not cool enough for you you can use a variable number of arguments on a macro definition too. This is very useful to implement printf style debug macros which get replaced by no tokens on a release build. Or to make debugging a bit more complicated, your choice.

```c++
#define DEBUG(fmt, ...) printf(fmt, __VA_ARGS__);
```

Combining this with stringify will provide you hours of fun. Combining this with token pasting... well, that's just evil.

