# Vim tip: "polymorphic" key bindings

@meta publishDatetime 2015-06-02T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/06/vim-tip-key-bindings.html

If you use vim daily, you probably have a bunch of maps for your most common tasks. You should also remember you can assign the same key to do different things according to which mode you are
in. For example, let's say you have a mapping to open a new tab:

```
map <leader>t :tabnew<cr>
```

You can also map t to open a new tab using the selected text as a filename. You just need to define two mappings:

```
nmap <leader>t :tabnew<cr>
vmap <leader>t :call Foo()<cr>
```

nmap stands for normal (mode) map, vmap for visual. How to get the text under the cursor is a bit more complex and out of scope for this vim tip, but you might want to check http://vim.wikia.com/wiki/Mapping\_keys\_in\_Vim\_-\_Tutorial\_%28Part\_1%29.

Remember to check ":help map" for a list of all mode mappings.


---
## In reply to [this post](), [Simple vim plugin III: a polymorphic project greper | An infinite monkey - Nicolas Brailovsky&#39;s blog](/blog_md/2016/1130_SimplevimpluginIIIapolymorphicprojectgreper.md) commented @ 2016-11-30T08:02:07.000+01:00:

[…] grep to vim. We can improve it a little bit with very simple changes. Using this tip to have different key binding for different modes we can do something a bit smarter . Let’s create two functions, one for normal mode that […]

Original [published here](/blog_md/2015/0602_Vimtippolymorphickeybindings.md).
