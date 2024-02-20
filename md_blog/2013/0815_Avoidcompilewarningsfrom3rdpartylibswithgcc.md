# Avoid compile warnings from 3rd party libs with gcc

@meta publishDatetime 2013-08-15T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/08/avoid-compile-warnings-from-3rd-party.html

So, your code is ferpect. It compiles cleanly with all warning options maxed out. You have already added -ansi, -pedantic, -Wall, -Wc++0x-compat, -Wextra and it all works. Even -Weffc++ emits no warning. And then, a wild third party library appears; your beautiful compile log is now littered with "initialization out of order" and "should declare a virtual destructor" warnings. What to do?

When including a third party library (like, for example, boost) you will almost never have the option to fix any of the diagnostics that your compiler helpfully provides you. If there's nothing you can do about them, there's no point in getting the warnings either. Disabling -Weffc++ is also not a good idea. If you already took the effort of cleaning your code to such a high standard, you shouldn't now relax it.

There's a third option: When compiling don't include those libs as "-I /path/to/lib", do it as "-isystem /path/to/lib". Gcc will now know those warnings are not your fault and it will stop nagging you.


---
## In reply to [this post](), [Seth]() commented @ 2013-09-19T13:18:08.000+02:00:

"So, your code is ferpect" - lol

Original [published here](/blog_md/2013/0815_Avoidcompilewarningsfrom3rdpartylibswithgcc.md).
