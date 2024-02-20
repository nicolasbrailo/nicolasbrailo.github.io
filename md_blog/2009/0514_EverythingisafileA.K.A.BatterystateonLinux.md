# Everything is a file A.K.A. Battery state on Linux

@meta publishDatetime 2009-05-14T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/05/everything-is-file-aka-battery-state-on.html

I present to you the latest release from Wheel Reinventions Inc. - Already Invented dept. - a script to check the remaining battery time from Linux console.

|

```c++
<pre class="c++">echo -n "Hours remaining: "
&amp;&amp; echo "$(cat /proc/acpi/battery/BAT0/state
      | grep &#x27;remaining capacity&#x27;
      | awk &#x27;{print $3}&#x27;) /
   $(cat /proc/acpi/battery/BAT0/state
      | grep &#x27;present rate&#x27;
      | awk &#x27;{print $3}&#x27;)"
   | bc -l</pre>
```
 |
  |

Yes, I was bored, so? I'm planning to release a new bogosort implementation after this one, what do you think?

Jokes aside, this nifty script shows how flexible can be the model "everything is a file" which Unix-y systems implement. With a couple of pipes (and an almost magical incantation for those uninitiated in the console cult) you can do lots of stuff with very little work

This concept could be associated with the way polymorfism works in a programming language, but that's an entry for another day.


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » DIY gnome applets](/blog_md/2011/0929_DIYgnomeapplets.md) commented @ 2011-09-29T09:13:55.000+02:00:

[...] widgets. Need to check your laptop’s battery? No need to search for a widget anymore, just cat /proc/acpi/battery/BAT0/state. Need to check the weather? Just wget your favorite forecast page and parse it with grep, sed an [...]

Original [published here](/blog_md/2009/0514_EverythingisafileA.K.A.BatterystateonLinux.md).
