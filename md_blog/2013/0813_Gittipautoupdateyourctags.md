# Git tip: auto update your ctags

@meta publishDatetime 2013-08-13T07:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/08/git-tip-auto-update-your-ctags.html

On any your .git/hooks folder; add this script in .git/hooks/post-merge (and don't forget to chmod +x it):

```c++
ctags -R -f .ctags .
```

Now every time you do a git pull your ctags file will automagically update. You might also want to copy or ln -s this script for the post-commit hook, if you want to run a ctags update on each git commit. Be aware that this will make your commits slower, if generating your tags file takes a long time.

Extra tip: "-f .ctags" will make ctags write into a hidden file, .ctags, which you can then add to .gitignore. Now ctags magically works in Vim and you won't even need to see your tags file (just don't forget to "set tags=./.ctags;/" on vim).

