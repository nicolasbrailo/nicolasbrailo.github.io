# g++ has a (mean) personaility

@meta publishDatetime 2012-12-06T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/12/g-has-mean-personaility.html

Did you ever get a message like "undefined reference to `\_\_gxx\_personality\_v0'"? It means you are trying to link c++ code with a c linker, just change gcc with g++. But what is gxx\_personality?

Basically, gxx\_personality is a global pointer used for stack unwinding. You could make your code compile (assuming you don't have other problems with vtables and such) by defining it as a NULL ptr, and everything should work until an exception is thrown.

