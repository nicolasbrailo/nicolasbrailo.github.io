# Vim Tip: I want more menus!

@meta publishDatetime 2015-04-02T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/04/vim-tip-i-want-more-menus.html

As a uber vim geek, you shouldn't be using a lot of gui menus. Scratch that, you shouldn't be using any menus at all, period. Still, I'll admit it's a bit hard to remember every single shortcut for actions you rarely use.

Say, for example, you like to encrypt your text. Not always, but every once in a while. Enough to make a shortcut for it but not enough to remember what the shortcut is. You can try to grep your ~/.vimrc. You might find something like:

```
" Encrypt my stuff
map <leader>e ggg?G<CR>
```

(Yes, that command will actually encrypt your text in Vim. Try it!)

Wouldn't it be nice if you had a simpler way, though?

Turns out you can add your "encrypt" command to your gui. Then "menu" commands work just like the "map" family, but they create a GUI menu instead. Change your vimrc to something like this:

```
" Encrypt my stuff
map <leader>e ggg?G<CR>
menu Project.Encrypt ggg?G<CR>
```

Now if you reload your vimrc you'll find a new GUI menu created, from which you can easily encrypt your text. Decrypting is left as an exercise to the reader.

Extra tip: Want to try to learn the actual shortcut, like a real vim'er? Then try this:

```
menu Project.Encrypt<TAB>ggg?G ggg?G<CR>
```

Everything after the TAB will be right-aligned: you can use that space to annotate the key-combo you should use next time.

As usual, for more info check :help menu


# Comments

---
## In reply to this post, [Simple vim plugin I: integrating new commands | An infinite monkey - Nicolas Brailovsky&#39;s blog](md_blog/2016/1124_SimplevimpluginIintegratingnewcommands.md) commented @ 2016-11-24T08:00:30.000+01:00:

[...] tip: add these too if you want to have a GUI menu for your new commands as [...]

Original [published here](md_blog/2015/0402_VimTipIwantmoremenus.md).
