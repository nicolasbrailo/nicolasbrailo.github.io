# Fastgrep, a cache for grep

@meta publishDatetime 2012-10-30T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/10/fastgrep-cache-for-grep.html

Sooner or later, you'll find that you need to know where to find a certain piece of text that ctags does not index, and grep is just not fast enough. Say, you're trying to match that log line you see every one in a while to the specific printf("I'm here!\n") that produced it.

Working on any reasonable sized project, searching for free-form text means you'll need some kind of indexing; grep will work, but you'll end up having to wait a couple of minutes between searches. Funny thing, we can probably speed up grep quite easily. Long story short, you can find a grep cache here: [Fastgrep](https://github.com/nicolasbrailo/Nico.rc/blob/master/fastgrep.sh).

So, how does it work? If we reason a bit about how grep will spend time we can probably assume the following:
1. Re-positioning the disk head to find the next file to grep
2. Reading file contents
3. Opening & closing files
4. Actually grepping

I didn't actually check how closely this "benchmark" resembles reality, but it seems reasonable to assume that most of the time grep spends searching for a string in a big project, is actually wasted in I/O, and more cores won't help.

After a quick Google search I didn't come up with any already available grep cache, so I rolled up a quick version myself which you can find here: [Fastgrep](https://github.com/nicolasbrailo/Nico.rc/blob/master/fastgrep.sh). The idea behind it is very simple, if most of the time is wasted accessing files, then just cat every file in the project together and grep that one instead.

Since the grepcache is actually a merged copy of all the files in the project, it can quickly get out of sync with the rest of the code. To somewhat improve this the index file is only used to get the list of files where a string might be found; these files are then grepped for the real results. This only helps a little bit and eventually everything gets out of sync, but I found that rebuilding the cache in a post-merge git hook (or a post-commit svn hook) is more than enough to make fastgrep more than usable.


# Comments

---
## In reply to [this post](), [Vim utilities: Findgrep & Fastgrep | An infinite monkey - Nicolas Brailovsky&#39;s blog](md_blog/2016/0706_VimutilitiesFindgrepFastgrep.md) commented @ 2016-07-06T09:05:59.000+02:00:

[...] wrote about Fastgrep a long time ago. The idea behind it is to speed up the slowest part in a grep command, the disk seek time, by [...]

Original [published here](md_blog/2012/1030_Fastgrepacacheforgrep.md).
