# Repeat (and fix) last command

@meta publishDatetime 2011-05-26T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/05/repeat-and-fix-last-command.html

How many times have you run a command but forgot to add sudo at the beginning? How many times did you open vim instead of gvim? All that has an easy fix, instead of pressing up-left-left-left-left-left... (almost like a Konami code, isn't it?) just use `!!`.

`!!` expands to the previous command, so for example:

```
vim foo
```

, then

```
g!!
```

will execute "gvim foo".

Another common problem, you mistype vim for vmi (hey, it may be a common problem if you're dyslexic). Just type fc, short for fix command, to open the last command in your configured editor. Fix it (lxp, bonus points if anyone understand this :D) then write and save. The fixed command will be executed.
