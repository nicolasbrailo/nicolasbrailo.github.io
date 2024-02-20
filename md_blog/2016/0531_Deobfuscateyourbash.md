# Deobfuscate your bash

@meta publishDatetime 2016-05-31T01:00:00.007+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/05/deobfuscate-your-bash.html

Who hasn't written some read-only magical Bash voodoo, only to find you need to decrypt your own creation later on? Luckily, [Explain Shell](http://explainshell.com/) can help with that. Here's an example from my .bash\_history file:

```bash
for fn in *; do echo cat $fn | sed "s|' '$URL'||g" | sed "s|curl -X POST -d '||g" ; done
```

And [Explain Shell's](http://explainshell.com/explain?cmd=for+fn+in+*%3B+do+echo+cat+%24fn+%7C+sed+%22s%7C%27+%27%24URL%27%7C%7Cg%22+%7C+sed+%22s%7Ccurl+-X+POST+-d+%27%7C%7Cg%22+%3B+done) explanation: it's no substitute for knowing Bash but it sure helps.

**Bonus**: while reading my bash history file, I realized I accidentally copy&paste a lot of code to my terminals. There are way too many "template <FOO>" entries in there...

**Bonus II**: It's a good thing they wrote "shell" in a different color. I was wondering why I had "explains hell" in my bookmarks.

