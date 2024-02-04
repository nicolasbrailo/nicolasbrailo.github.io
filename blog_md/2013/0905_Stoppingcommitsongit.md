# Stopping commits on git

@meta publishDatetime 2013-09-05T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/09/stopping-commits-on-git.html

Who hasn't commited debug code by mistake? It's only normal to forget to remove an #include we added only to test some stuff. Luckily it's easy to tell git that we don't want to commit any changes with a certain string.

On any (git) repo you'll find a .git/hooks folder; add this script in .git/hooks/pre-commit (and don't forget to chmod +x it):

```bash
#!/bin/sh

if [ 0 != `git diff | grep "STOPCOMMIT" | wc -l` ]; then
    echo "Error: STOPCOMMIT found, remove it before commiting";
    git diff
    exit 1
fi
```

Now git will check your commits and stop them if they contain the STOPCOMMIT string. Now you can add all the debug changes you want, as long as you add a //STOPCOMMIT after them you'll never end up commiting them by mistake.

