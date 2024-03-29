# Vim tip: no swap

@meta publishDatetime 2013-03-14T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/03/vim-tip-no-swap.html

Swap files in Vim can be helpful as a very dumb lock mechanism, just so you're sure no one is changing the same file as you are in the same server. They can also serve as a very crude back up system, in case your system crashes. Alas, git seems suited to cover much better both functionalities, as a not so dumb developer synchronization mechanism and as a code backup tool in case everything crashes (you don't really host your git on localhost, do you?).

If you commit often swapfiles can be an annoyance more than a useful feature, and disabling then can save you a lot of "Swap file already found" messages. Just add "**set noswapfile**" to your .vimrc and forget about them.

