# gdb: graphic (tui) mode

@meta publishDatetime 2009-09-22T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/09/gdb-graphic-tui-mode.html

A little known fact about gdb is that you can use it in graphics mode, called TUI. Yes, you can obviously use [DDD](http://www.gnu.org/software/ddd/) or a similar front end but that's not even nearly as cool as using a console based GUI (!), is it?

The easiest way is to start gdb like this:

```
gdb -tui
```

That will display the usual gdb console plus a code listing, similar to the code listing you get using the "list" command but shown in another window. Alternatively you can press C-X C-A (both, in that order) while in gdb to switch between TUI mode and back.

Don't know enough about gdb? Read <http://beej.us/guide/bggdb/>, a great gdb intro.

