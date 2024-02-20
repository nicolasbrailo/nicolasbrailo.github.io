# Cool C++0X features I: Intro

@meta publishDatetime 2011-04-18T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/04/cool-c0x-features-i-intro.html

C++0X brings some very cool changes, and I wanted to start a series of posts regarding some of these changes, with a small explanation of each new feature (that I currently understand, at least), an example of its usage and why I think it's a cool thing. Notice these two may be mutually exclusive, some of these may just be cool but I wouldn't recommend using them on a day to day basis. An example of a very cool feature which I wouldn't normally use in a project is the one I want to write about today: variadic templates.

What's not to love about variadic templates? Its name implies (correctly) that it uses templates, and it also has a "variadic" thingy, which you can use to look smart since no one really knows what it means.

Templates themselves can quickly get complicated if used by unexperienced padawans in the art of martial C++, yet their hypnotic beauty draws every programmer to use them just like flies are drawn to fire. When used correctly they can produce very elegant code; if not for the template programmer, at least for the end user. Yet in all their power, templates in C++ have been lacking a fundamental aspect: a variable number of arguments.

There are ways to work around this limitation, like using a list of types paired with a template-paramlist-object. Sounds familiar? (I know it doesn't, don't worry). You could also generate N constructors, one overload for each parameter count. The drawback, exponential compile time (say, TR1). These are all hacks, which are in place only because there wasn't a safe way of passing a list of types associated with a list of arguments. This is over now with variadic templates in C++0X.

So, what kind of problem would variadic templates solve? Let's name a few:
* A typesafe varargs function (a function with a variable number of arguments)
* Easily create a template object which acts as a tuple
* An easier implementation of a reduce (inject) function

This entry is getting quite long so we'll start seeing these examples on the next post.

