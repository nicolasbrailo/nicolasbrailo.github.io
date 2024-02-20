# Vim tip: Replacing builtin commands

@meta publishDatetime 2016-03-03T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/03/vim-tip-replacing-builtin-commands.html

If you spent a day [writting a cool new version of the "tabnew" Vim command](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/bettertabnew.vim), you'll probably want it to be the default command used to open new tabs. Right?

Luckily, there's an easy way to replace built in commands with custom ones: cabbrev. cabbrev will do a textual replacement, so if you add "cabbrev tabnew TabNew" to your vimrc, eachtime you type "tabnew" it will be translated to TabNew.

Bonus tip: The command is actually, "abbrev", not "cabbrev". The "c" stands for command: it's telling Vim that you want the abbrev command applied in command mode. You can also use it as "nabbrev" to have it applied in normal mode. "abbrev" it's a nice way to correct common typos!

