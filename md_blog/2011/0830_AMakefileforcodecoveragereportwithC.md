# A Makefile for code coverage report with C++

@meta publishDatetime 2011-08-30T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/md_blog/2011/0830_AMakefileforcodecoveragereportwithC.md

So far you should know how to [use makefiles](md_blog/2011/0822_AMakefileforTDDwithC.md) and you should have a nice [testable project](md_blog/2011/0830_AMakefileforcodecoveragereportwithC.md). Then you have everything ready to get a coverage report. Yeah, using makefiles, you guessed!

This time we'll depend on two tools, gcov and gtest. These are in Ubuntu's repositories, so you should have no problem getting them. I won't even bother to explain this makefile (not because it's obvious but because I don't really remember how it works. I wrote this over a year ago).

```c++
.PHONY: clean coverage_report
coverage_report:
	# Reset code coverage counters and clean up previous reports
	rm -rf coverage_report
	lcov --zerocounters --directory .
	$(MAKE) COMPILE_TYPE=code_coverage &&
	$(MAKE) COMPILE_TYPE=code_coverage test
	lcov --capture --directory $(BIN_DIR)/$(OBJ_DIR)/code_coverage --base-directory . -o salida.out &&
	lcov --remove salida.out "*usr/include*" -o salida.out &&
	genhtml -o coverage_report salida.out
	rm salida.out
```

Bonus makefile target: make your code pretty:

```c++
.PHONY: pretty
pretty:
	find -L|egrep '.(cpp|h|hh)$$'|egrep -v 'svn|_Test.cpp$$' | xargs astyle --options=none
```

Remember to change your astyle options as needed.

Bonus II: Example project using gcov and gtest: [gcov\_gtest\_sample.tar](md_blog/youfoundadeadlink.md). The irony? It doesn't use my common makefile, it predates it.

