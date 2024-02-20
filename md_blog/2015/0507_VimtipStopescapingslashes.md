# Vim tip: Stop escaping slashes

@meta publishDatetime 2015-05-07T09:07:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/05/vim-tip-stop-escaping-slashes.html

If you do a lot of search & replace in Vim, eventually you'll end up escaping a lot of slashes. Whenever you have to replace a path, for example. Isn't that annoying? After a couple of levels you end up with a horrible "\/path\/to\/foo\/bar" pattern. And if you miss an escape slash, good luck. It's better to scrap the whole thing and start over.

Luckily, when you are using the 's'earch command you can pick a different separator. Instead of typing "%s/\/foo\/bar\/baz\//foo\/bar\//g", you can simply type "%s#/foo/bar/baz/#foo/bar/#g". Vim will automagically detect you want to use '#' as a delimiter, and you'll end up with a much more readable pattern.

Extra tip: this also works in sed


# Comments

---
## In reply to this post, [VimTip: Search and f(replace) | An infinite monkey - Nico Brailovsky&#39;s blog](md_blog/2019/0226_VimTipSearchandfreplace.md) commented @ 2019-02-26T07:05:03.000+01:00:

[…] Pre-tip: When using search and replace in Vim, you don't need to use slashes […]

Original [published here](md_blog/2015/0507_VimtipStopescapingslashes.md).
