# Automagically setup breakpoints with gdb

@meta publishDatetime 2013-11-05T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/11/automagically-setup-breakpoints-with-gdb.html

When you are trying to debug a project you don't know you'll probably end up recompiling a few times, then restarting your debugging session. This can be quite frustrating, when you have gdb workset [full of breakpoints](md_blog/2013/0704_Myowngdbcheatsheetjustbecause.md), [watch expressions](md_blog/2013/0625_Watchpointsingdbwakemeupwhenfoochanges.md) and all that stuff.

Luckily you can easily restore your state if you just write all the gdb commands you need into a file, then start gdb with "--command=state.gdb". Magic! All your breakpoints are there.

Alternatively, an even better solution: just don't exit gdb after recompiling, simply "kill" your currently under-debug process (ie type "kill" inside gdb, do not kill gdb itself!) and gdb will be smart enough to reload your binary if it changed.

