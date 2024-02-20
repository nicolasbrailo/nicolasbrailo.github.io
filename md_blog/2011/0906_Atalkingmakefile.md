# A talking makefile

@meta publishDatetime 2011-09-06T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/09/a-talking-makefile.html

So, after learning [how to use makefiles](md_blog/2011/0818_Makefiles.md), then [how to use makefiles for TDD](md_blog/2011/0822_AMakefileforTDDwithC.md) and for [code coverage report](md_blog/2011/0830_AMakefileforcodecoveragereportwithC.md), now you need to annoy your whole team with a talking makefile. What could be better to notify everyone on your team when a test fails than a synthesized voice commanding you to fix your program?

```c++
test: $(TEST_SRCS)
	@for TEST in $(TEST_BINS); do
		make "$$TEST";
		echo "Execute $(TEST)";
		if ! ./$$TEST; then
			echo "Oh noes! I detected a failed test from $$TEST. Go and fix your program!" | festival --tts ;
	done
```

Try it. You'll love it.

Bonus chatter: when Valgrind detects over $MUCHOS errors it'll print "Too many errors detected. Go and fix your program", then it won't print so much detail in the next backtraces.


# Comments

---
## In reply to [this post](), [Links 7/9/2011: Linux World Domination, China Picks IBM’s GNU/Linux Mainframe | Techrights](http://techrights.org/2011/09/07/linux-world-domination/) commented @ 2011-09-07T20:13:23.000+02:00:

[...] talking makefile [...]

Original [published here](md_blog/2011/0906_Atalkingmakefile.md).
