# mocp rand

@meta publishDatetime 2009-07-23T08:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/07/mocp-rand.html

I'm quite sure everyone reading this must have a respectable, if not massive, music collection. In this days and age is difficult finding someone who doesn't. It's also difficult to choose one, and only one, disk to listen at any given moment. Until we're upgraded to support concurrent music listening we're better of with a random disk selector, which is exactly what this little script does:

```c++
#!/bin/bash

SEARCH_DIR="/home/nico/Música"
START_RANDOM=1
RAND_MAX=32767

while (( 1 )); do
  NUM_DISCS=$(find $SEARCH_DIR -type d | wc -l)
  RAND=$(($NUM_DISCS * $RANDOM / $RAND_MAX))
  RAND_DISC=$(find $SEARCH_DIR -type d | head -n $RAND | tail -n 1)

  # Wake up moc
  mocp -FS 2&gt;/dev/null &gt;/dev/null &amp;
  mocp -pca "$RAND_DISC" &amp;
  echo "Playing $RAND_DISC"

  # Start from a random file?
  if (( $START_RANDOM )); then
    mocp --on shuffle &amp;
    mocp -f &amp;
    mocp --off shuffle &amp;
  fi

  read
done
```

Of course, it requires [mocp](http://moc.daper.net/), my favorite music (on console) player. And obviously, you'll have to configure SEARCH\_DIR but I'm sure some bash hacking is not that hard.

Beware though, using this + cron may have the undesired effect of awakening to the pleasant music of Cannibal Corpse.


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Sorting by random in bash and mocp random updated](md_blog/2010/0909_Sortingbyrandominbashandmocprandomupdated.md) commented @ 2010-09-09T09:04:03.000+02:00:

[...] And now you can sort by random your output using sort -R. Why would this be useful? Well, I updated my mocp random script with a [...]

Original [published here](md_blog/2009/0723_mocprand.md).
