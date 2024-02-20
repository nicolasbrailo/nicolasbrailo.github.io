# Globing in bash

@meta publishDatetime 2015-04-30T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/04/globing-in-bash.html

There is a pretty common and unnecessary pattern used by bash scripts: whenever you need to loop through a list of file names in a path, you might tempted to write something like this.

```c++
for fname in $(ls | grep foo); do echo $fname; done
```

You can save some typing by using bash-globbing:

```c++
for fname in *foo*; do echo $fname; done
```

Not only the script should be cleaner and faster, bash will take care of properly expanding the file names and you won't have to worry about things like filenames with spaces. This should also be portable to other shells too.

Want to know more about bash globbibg? Check out http://www.linuxjournal.com/content/bash-extended-globbing

