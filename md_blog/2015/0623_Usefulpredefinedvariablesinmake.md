# Useful predefined variables in make

@meta publishDatetime 2015-06-23T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/06/useful-predefined-variables-in-make.html

I always forget about two very useful make variables, so I'll leave this here: $(COMPILE.cpp), $(LINK.cpp).
It's easy, instead of writing a rule as

```
foo.o: foo.cpp
  g++ -c foo.coo
```

you should instead write this:

```
foo.o: foo.cpp
  $(COMPILE.cpp) foo.coo
```

COMPILE.cpp will have the default compiler you are supposed to use, and probably some helpful parameters as well. Likewise, LINK.cpp will have the linker you are supposed to use.

There are many useful predefined variables in make. Be sure to check them all by running "make -p" in a console.

