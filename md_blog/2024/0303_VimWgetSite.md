# Vim can wget + c-w search

@meta publishDate 2024-03-03
@meta author Nico Brailovsky
@meta tags Vim

I (re?)learned a thing today: Vim can wget a site!

Doing `c-w gf` tells Vim to open whatever path is under the cursor. This is usually something like "#include <foo/bar/baz.h>", which means it will ask Vim to open `foo/bar/baz.h`. If you happen to have `http://nicolasbrailo.github.io` under your cursor, you'll be fetching this site into a temp buffer, in Vim.

## Bonus tip:

If `c-w gf` isn't finding the files you want it to, you may need to set your search path:

```vim
set path+=/home/user/path/to/foo,/home/user/src/bar
```

