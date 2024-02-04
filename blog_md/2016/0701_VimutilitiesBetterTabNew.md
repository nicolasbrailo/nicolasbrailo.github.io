# Vim utilities: Better Tab New

@meta publishDatetime 2016-07-01T01:00:00.009+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/07/vim-utilities-better-tab-new.html

I spent some time writing utility scripts for my Vim setup. I figured I can share them here, someone may even find them useful or at least get a laugh out of it. The first one is called "Better Tab New" and you can get it from my [Github repo](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/bettertabnew.vim) or from the script's [Vim page](http://www.vim.org/scripts/script.php?script_id=5405).

Why would you want a better tab new, and what's wrong with the default one? Simple: tabnew, in Vim, will just open a file. For that to happen you need to specify the exact path of a file. That's usually perfectly fine, but sometimes you need tabnew to be a bit smarter: maybe you just grep'ed something and ended up with a path that looks like "/foo/bar/baz:my\_text:42". Or maybe you want to open a file and go to a specific line. Those are things for which the default tabnew implementation isn't very good. BTN fills that niche and lets you create a simpler workflow when using grep.

Get BTN: Better Tab New here:

* [Gihub repo](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/bettertabnew.vim)
* [BTN's Vim page](http://www.vim.org/scripts/script.php?script_id=5405)

