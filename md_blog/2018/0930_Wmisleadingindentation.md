# -Wmisleading-indentation

@meta publishDatetime 2018-09-30T15:58:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2018/09/wmisleading-indentation.html

This gcc switch is a few years old but I discovered it recently. I'm not sure if that means my code is always very clean or my toolchain too oudated... in any case, -Wmisleading-indentation (which you get with -Wall) warns about this gotcha:

```c++
if (foo)
   bar();
   baz();
```

Neat!

