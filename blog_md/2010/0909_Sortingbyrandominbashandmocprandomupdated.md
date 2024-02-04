# Sorting by random in bash and mocp random updated

@meta publishDatetime 2010-09-09T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/09/sorting-by-random-in-bash-and-mocp.html

Random is nice. And now you can sort by random your output using sort -R. Why would this be useful? Well, I updated [my mocp random](/blog_md/2009/0723_mocprand.md) script with a oneliner:

```c++
mocp -c &amp;&amp; find -type d | sort -R | head -n1 | awk '{print """$0"""}'; | xargs mocp -a
```

