# gdb-tui and the previous-command problem

@meta publishDatetime 2016-01-26T10:04:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/01/gdb-tui-and-previous-command-problem.html

Raise your hand if you have run gdb in [tui](md_blog/2009/0922_gdbgraphictuimode.md) (graphical) mode, only to find you can't refer to the previous command when pressing "up". I can't see you but I know this is true for pretty much everyone reading this blog. All three of you.

In the gdb-TUI mode, the arrow keys are used by the active window for scrolling. This means they are not available for readline, the component that takes care of the magic invocations needed to bring back the previous command from the land of the dead. Luckily there are alternative readline keybindings: just try C-p, C-n, C-b and C-f. Takes a while getting used to it but you can finally use gdb-TUI and forget about copy-pasting every gdb command.

Bonus tip: if pressing "up" (or C-p) in gdb doesn't bring back the previous command, it probably means you don't have the readline package installed. Go ahead an install it. It'll change your life.


# Comments

---
## In reply to this post, [UncleNinja](md_blog/youfoundadeadlink.md) commented @ 2017-12-03T17:39:34.000+01:00:

thank you dude

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [thekilokahn](md_blog/youfoundadeadlink.md) commented @ 2018-01-02T04:14:21.000+01:00:

Thanks!

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [Anonymous]() commented @ 2018-02-21T11:15:00.000+01:00:

Thanks. A second option is to focus the command window, then arrows work. To cycle focus: C-x o.

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [Gustavo]() commented @ 2018-08-09T23:09:56.000+02:00:

4 now. Thank you.

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [Noah]() commented @ 2018-10-28T23:54:19.000+01:00:

Thank you!

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [Anonymous]() commented @ 2018-11-25T00:14:37.000+01:00:

There are dozens of us! dozens!

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [nicolasbrailo](/md_blog) commented @ 2018-11-26T09:00:38.000+01:00:

Seems so... and I'm still surprised by that!
Thanks Anon

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [Anonymous]() commented @ 2019-04-03T05:29:44.000+02:00:

More than dozens!!

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [Anonymous]() commented @ 2019-04-24T01:56:21.000+02:00:

There is a whole company of us here!

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [Anonymous]() commented @ 2019-07-30T16:49:03.000+02:00:

there is me too

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).

---
## In reply to this post, [sherais](md_blog/youfoundadeadlink.md) commented @ 2020-04-01T20:55:14.000+02:00:

Thank you very much, I am learning GDB and this saves me so many grey hairs.

Original [published here](md_blog/2016/0126_gdbtuiandthepreviouscommandproblem.md).
