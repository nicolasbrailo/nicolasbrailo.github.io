# Vim tip: reload your vimrc

@meta publishDatetime 2015-06-18T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/06/vim-tip-reload-your-vimrc.html

If you're changing your vimrc, it can get boring to close and restart it only to see the changes applied. Want something quicker? You can ":so %". So stands for source, so you'll just be telling vim "include this file". % happens to be the path to the current file. If you're not editing your .vimrc but for some reason you still want to reload it, just use "so ~/.vimrc" instead.


# Comments

---
## In reply to this post, [Anonymous]() commented @ 2015-06-21T14:30:22.000+02:00:

```
augroup MyAutoCmd
 " Clear autocmds for this group
 autocmd!

" Automatically load vimrc when it is saved
autocmd bufwritepost $MYVIMRC source $MYVIMRC

augroup end
```

Original [published here](md_blog/2015/0618_Vimtipreloadyourvimrc.md).

---
## In reply to this post, [nicolasbrailo/](md_blog/aboutme.md) commented @ 2015-06-22T09:49:37.000+02:00:

Great tip, thanks Anon!

Original [published here](md_blog/2015/0618_Vimtipreloadyourvimrc.md).
