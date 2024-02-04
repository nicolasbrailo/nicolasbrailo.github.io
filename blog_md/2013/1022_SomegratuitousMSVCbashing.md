# Some gratuitous MSVC bashing

@meta publishDatetime 2013-10-22T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/some-gratuitous-msvc-bashing.html

Recently I found out Microsoft's Visual Studio doesn't support alternative tokens (ie "and" instead of "&&"). Even worse than that, apparently they don't think it's even necessary. And by the looks of [this thread](http://connect.microsoft.com/VisualStudio/feedback/details/751842/alternative-tokens-dont-work), the people working on MSVC need to take some time to actually READ the cpp standard. You know... it's kind of like a spec for your product. It's always good to take some time to understand the specs for your product...

I can only imagine how incredibly ugly their lexer must be to say it's not a fixable problem.

