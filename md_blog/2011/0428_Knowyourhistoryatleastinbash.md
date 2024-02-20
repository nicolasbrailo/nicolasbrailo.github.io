# Know your history (at least in bash)

@meta publishDatetime 2011-04-28T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/04/know-your-history-at-least-in-bash.html

I always wonder why do you see so many people pressing up a bazillion times when trying to bring a command they recently typed. Just use ctrl+r and type part of the previous command, it'll save you many hours of pressing up.

# Comments

---
## In reply to [this post](), [Ridgeland]() commented @ 2011-04-29T12:02:02.000+02:00:

in .bashrc I have an alias:
alias his='history | grep '
So I use
$ his ssh
to see all the ssh command I've entered.
It's a shorter list than history and more than [Ctrl]+r
Then !1234 to run a command again.

Original [published here](/md_blog/2011/0428_Knowyourhistoryatleastinbash.md).

---
## In reply to [this post](), [Links 30/4/2011: Systemd and a Lot of Ubuntu Coverage | Techrights](http://techrights.org/2011/04/30/lot-of-ubuntu-coverage/) commented @ 2011-04-30T13:48:04.000+02:00:

[...] Know your history (at least in bash) [...]

Original [published here](/md_blog/2011/0428_Knowyourhistoryatleastinbash.md).
