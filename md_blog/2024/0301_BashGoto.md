# Bash: goto
#
@meta publishDate 2024-03-01
@meta author Nico Brailovsky
@meta tags Metapost

I rediscovered a nifty little utility I added to my [bashrc](https://github.com/nicolasbrailo/Nico.rc) a while back: [goto](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/goto.sh). Goto is a short script that works as a bookmark mechanism for Bash. With you, you can set a bookmark directory, and then jump to that directory from anywhere else (with autocomplete). For example:

```bash
$ cd foo/bar/baz
foo/bar/baz$ goto . bookmark
foo/bar/baz$ cd /
/$ goto boo<tab>
foo/bar/baz$
```

It works by setting itself as a Bash autocomplete, so that bookmarks are autocompletable and available anywhere in Bash. A bookmark is itself nothing more than a symlink saved to `~/goto`.

To install, you can `wget -O - https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/goto.sh > ~/.goto.sh` and add it to your bashrc.

