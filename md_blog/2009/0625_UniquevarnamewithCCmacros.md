# Unique var name with C/C++ macros

@meta publishDatetime 2009-06-25T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/06/unique-var-name-with-cc-macros.html

So, you're working on some macro magic incantation and you need a unique variable name in you C program? Though it may seem simple at first, using \_\_LINE\_\_ for a variable name, the ## operator (concatenation in the preprocesor) won't let you. There's a secret spell to do it anyway:

```c++
// Do magic! Creates a unique name using the line number
#define LINE_NAME( prefix ) JOIN( prefix, __LINE__ )
#define JOIN( symbol1, symbol2 ) _DO_JOIN( symbol1, symbol2 )
#define _DO_JOIN( symbol1, symbol2 ) symbol1##symbol2
```

Great, now you can keep obscuring your programs even more - have fun!


---
## In reply to [this post](), [Why is a level of indirection needed for this concatenation macro? | CopyQuery](/blog_md/youfoundadeadlink.md) commented @ 2013-10-29T19:25:53.000+01:00:

[…] found an interesting little blog post that explains how to generate (semi) unique names in a macro by using the line […]

Original [published here](/blog_md/2009/0625_UniquevarnamewithCCmacros.md).

---
## In reply to [this post](), [How do I concatenate str and integer variables using macros? – program faq](/blog_md/youfoundadeadlink.md) commented @ 2017-12-27T16:30:10.000+01:00:

[…] reading this answer to a similar problem, and also attempting this similar concept to create level of indirection, I have found no solution, as neither of them work […]

Original [published here](/blog_md/2009/0625_UniquevarnamewithCCmacros.md).
