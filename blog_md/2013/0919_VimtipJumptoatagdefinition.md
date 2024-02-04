# Vim tip: Jump to a tag definition

@meta publishDatetime 2013-09-19T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/09/vim-tip-jump-to-tag-definition.html

I admit it, hitting control enter to jump to a definition is a very useful feature of fancy GUIs. Fortunately, it's not exclusive to fancy GUIs, apparently it's been available using ctags too for a little while (if you consider the last 20 or 30 years to be little, that is).

Just add this magic spell to your .vimrc; next time you open a file in a project with a tags file generated just press ctrl-enter with your cursor over the definition you wish to find:

```c++
map &lt;C-CR&gt; :tab split&lt;CR&gt;:exec("tag ".expand("&lt;cword&gt;"))&lt;CR&gt;
```

