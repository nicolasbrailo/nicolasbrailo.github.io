# Human friendly c declarations

@meta publishDatetime 2013-11-12T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/11/human-friendly-c-declarations.html

An appropriate use of typedef's can transform 99% of c's gruesome type declarations into a mostly maintainable and maybe even readable piece of code. For that remaining 1%, or if you got a legacy application from someone with a very twisted mind, you'll probably need a way decode what "int (\*(Foo::\*foo)(void\*\*))[3]" means.

To decipher weird c declarations go to [http://cdecl.org/](http://cdecl.org/ "http://cdecl.org/") and type your type. It works for most cases... good luck trying to figure out templates, though, for template metaprogramming you are on your own.

