# Vim utilities: Impl switcher

@meta publishDatetime 2016-07-04T01:00:00.010+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/07/vim-utilities-impl-switcher.html

I spent some time writing utility scripts for my Vim setup. I figured I can share them here, someone may even find them useful or at least get a laugh out of it. Last time I presented "[BTN: Better Tab New](/md_blog/2016/0701_VimutilitiesBetterTabNew.md)". Today it's the turn for "Impl switcher".

With its very imaginative name, "Impl switcher" has a very obvious purpose: it will just switch from a header file to an implementation file. So, between .h and .cpp. Surely there are lots of Vim plugins to do just that, why write another one?

Most impl-switcher plugins in the wild tend to, in my experience, require either a lot of configuration, a lot of dependencies, or a very specific project layout (or a combination of all three). They also seem to be huge and very complicated projects.

Impl switcher will recursively go up your directory hierarchy and use "find" to locate any files named like your base file but with a different extension. That makes it very simple and it requires minimal (if any) configuration: just drop it in your .vimrc file and you're good to go. OK, not exactly: it requires a Linux-like system with utilities like "find". Still, a good trade-off to keep the project's dependencies as small as possible.

Get "impl swicher" here:

* [Git hub repo](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/impl_switcher.vim)
* [Impl switcher's Vim page](http://www.vim.org/scripts/script.php?script_id=5406)

