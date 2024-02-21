# Vim tim: quickly switch from header to impl

@meta publishDatetime 2013-11-19T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/11/vim-tim-quickly-switch-from-header-to.html

Switching from header to implementation in vim takes up precious milliseconds of typing and thinking, so we'd better delegate that to a computer. Instead of typing :tabnew FOO.cpp, just download A (for alternate) from this url: http://www.vim.org/scripts/script.php?script\_id=31

Add it to your bundles in vim and, for extra magic, just map some key to :AT in your vimrc. I have added this one:

```c++
map <F4> :AT<CR>
```

I don't know how I lived without this for such a long time.


# Comments

---
## In reply to this post, [Matt]() commented @ 2013-11-19T21:29:34.000+01:00:

I've not tried A, but fswitch offers similar functionality: http://www.vim.org/scripts/script.php?script\_id=2590

Original [published here](md_blog/2013/1119_Vimtimquicklyswitchfromheadertoimpl.md).

---
## In reply to this post, [nico](md_blog/aboutme.md) commented @ 2013-11-19T21:33:54.000+01:00:

Thanks Matt!

Original [published here](md_blog/2013/1119_Vimtimquicklyswitchfromheadertoimpl.md).
