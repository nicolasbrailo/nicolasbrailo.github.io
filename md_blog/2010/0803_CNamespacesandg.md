# C++ Namespaces and g++

@meta publishDatetime 2010-08-03T11:48:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/08/c-namespaces-and-g.html

Have you ever tried to leave open a C++ namespace after EOF (that is, openning a namespace in a headerfile but forgetting to close it). It's a little bit like getting your balls caught by the door. The compiler will throw at you an incredible number of seemingly unrelated errors, all of which occur in a different file than the offending header.

Reaching EOF on a C++ file without closing all its namespaces should be ilegal; or at least you should have better error reporting, because right now it's almost impossible to know what's the source of the error (for g++, that is).

