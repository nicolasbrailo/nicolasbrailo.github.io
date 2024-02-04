# Vim tip: custom commands

@meta publishDatetime 2016-11-17T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/11/vim-tip-custom-commands.html

If you have a function that you use a lot, you may find it interesting to use a custom command for it. Try this:

```bash
:command Foo echo('Hola!')
```

Now invoke the command with ':Foo' and Vim should say hello. Neat, huh? This is especially useful (and dangerous) when combined with cabbrev, like this:

```bash
:command! Foobar echo('Nope!')
:cabbrev close Foobar
```

If you try to :close a document, Vim will now say "Nope!". Other than using this to mess with someone's Vim session, you can replace builtin commands with your own tweaked functions. I tend to use that quite frequently in [my own .vimrc](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/).

