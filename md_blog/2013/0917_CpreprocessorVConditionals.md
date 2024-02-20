# C preprocessor V: Conditionals

@meta publishDatetime 2013-09-17T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/09/c-preprocessor-v-conditionals.html

While walking around the c preprocessor we came to know the stringify operator, the crazy token pasting operator and a \_\_VA\_ARGS\_\_ macro. All very weird, but at least the #if's work in a sane way... or do they? They do, but there's some room for unexpected behavior if you don't know some implementation details. Take this code for example:

```c++
#if 0
#  if 0
#  else
#  elif true
#  endif
#endif
```

Clearly the inner if is wrong because the else clause comes before the elseif, however you might think it doesn't matter because it's surrounded by an #if 0. Surprise: it does matter, that's not valid preprocessor input. Even if the outer #if is not "taken", whatever preprocessing directives are inside it should still be valid (though anything that's not a preprocessing directive will indeed be ignored).

Even though at first it might seem weird for things inside an #if 0 to be important, it makes sense if you think that should an internal #if not respect the proper structure then the preprocessor wouldn't know when to end the first #if 0. Then again, if you find any real-world utility to this bit of preprocessor implementation trivia, you are doing something horribly wrong!

