# Vim Tip: Folding FTW

@meta publishDatetime 2009-10-06T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/10/vim-tip-folding-ftw.html

I always say methods should have two levels of indentation at most, but even if your code is perfect like mine you may still have to dwell with other people's code (which, obviously, is ugly code), people how may have lots of fun shaping the program like a pyramid.

Not all is lost, you don't have to commit sepuku (at least not for this one). Just use Vim's indent method like this:

```
:set foldmethod=indent
```

That should give you a better view of the code flow. As always, use '%' to navigate all those pesky { and }.

