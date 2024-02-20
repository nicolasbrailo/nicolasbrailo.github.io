# Bash: Color in command line prompt PS1

@meta publishDatetime 2019-07-18T10:06:00.001+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2019/07/bash-color-in-command-line-prompt-ps1_18.html

I'm lately dealing with lots of hosts in different environments (eg local, dev, test, etc). Some actions are safe to perform in some of these hosts, in others not so much. To help quickly figure out which hosts are safe, I wanted to add a color to my Bash prompt (PS1) - for example green for dev, where it's unlikely I'll break anything other than my stuff, red for hosts where carelessness might result in a weekend spent at the office.

The first result I get in Google when trying to set Bash's PS1 to use colors seems to be wrong (or, rather, I wasn't smart enough to make it work). An escape sequence seems to be missing, resulting in weird behavior with new lines; colors work, but line wrapping gets broken. Took me a while to associate broken \n's with colors, but once I did the fix was easy. Check out here for the [proper way to escape color commands in Bash](https://stackoverflow.com/questions/342093/ps1-line-wrapping-with-colours-problem).

And here's my current setup:

```c++
export COLOR_SET='\[\e['$THIS_HOST_COLOR'm\]'
export COLOR_RESET='\[\e[0m\]'

# Example:
export PS1='\A '$COLOR_SET'\h'$COLOR_RESET':\w$ '
```

