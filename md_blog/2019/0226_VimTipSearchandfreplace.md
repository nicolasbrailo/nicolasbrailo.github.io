# VimTip: Search and f(replace)

@meta publishDatetime 2019-02-26T07:00:00.001+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2019/02/vimtip-search-and-freplace_26.html

Pre-tip: When using search and replace in Vim, [you don't need to use slashes](/md_blog/2015/0507_VimtipStopescapingslashes.md)
This works just fine:

```c++
%s#search#replace
```

Did you know $replace doesn't have to be a literal expression? You can also use Vim functions! For example:

```c++
%s#bar#\=line(&#x27;.&#x27;)
```

will replace every occurrence of 'bar' for its line number. You can get creative and use any other Vimscript function.

