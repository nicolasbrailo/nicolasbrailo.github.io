# A Makefile for TDD with C++

@meta publishDatetime 2011-08-22T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/08/a-makefile-for-tdd-with-c.html

So, after reading [my post about makefiles](/blog_md/2011/0818_Makefiles.md) you decided that you like them but would like to add some TDD to be buzzword compliant? No problem, that's easy to do.

Assuming you use a naming convention such as this one:

```c++
path/to/src/Object.h
path/to/src/Object.cpp
path/to/src/Object_Test.cpp
```

then it's easy to auto detect which tests should be built:

```c++
TEST_SRCS := $(patsubst ./%, %, $(shell find -L|grep -v svn|egrep "_Test.cpp$$" ) )
TEST_BINS := $(addprefix ./$(BIN_DIR)/, $(patsubst %.cpp, %, $(TEST_SRCS)) )
```

Then we have to define a special rule with pattern matching to compile the tests:

```c++
$(BIN_DIR)/%_Test: $(patsubst $(BIN_DIR)/%, %, %_Test.cpp ) %.cpp %.h
	@echo "Making $@"
	@mkdir -p $(shell dirname $@)
	g++ $(CXXFLAGS) -g3 -O0 $&lt; -o $@ -lpthread -lgtest_main -lgmock $(OBJECTS) $(LDFLAGS)
```

and some magic to auto execute every test when we "make test":

```c++
test: $(TEST_SRCS)
	@for TEST in $(TEST_BINS); do
		make "$$TEST";
		echo "Execute $(TEST)";
		./$$TEST;
	done
```

Everything nice and tidy for a copy & paste session:

```c++
TEST_SRCS := $(patsubst ./%, %, $(shell find -L|grep -v svn|egrep "_Test.cpp$$" ) )
TEST_BINS := $(addprefix ./$(BIN_DIR)/, $(patsubst %.cpp, %, $(TEST_SRCS)) )

$(BIN_DIR)/%_Test: $(patsubst $(BIN_DIR)/%, %, %_Test.cpp ) %.cpp %.h
	@echo "Making $@"
	@mkdir -p $(shell dirname $@)
	g++ $(CXXFLAGS) -g3 -O0 $&lt; -o $@ -lpthread -lgtest_main -lgmock $(OBJECTS) $(LDFLAGS)

.PHONY: test
test: $(TEST_SRCS)
	@for TEST in $(TEST_BINS); do
		make "$$TEST";
		echo "Execute $(TEST)";
		./$$TEST;
	done
```

Now you just need to run make test. Remember to add the proper [Vim's mapping](/blog_md/2010/0629_Vimtipsmakethingsworkagain.md).


# Comments

---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » A Makefile for code coverage report with C++](/blog_md/2011/0830_AMakefileforcodecoveragereportwithC.md) commented @ 2011-08-30T11:14:37.000+02:00:

[...] far you should know how to use makefiles and you should have a nice testable project. Then you have everything ready to get a coverage [...]

Original [published here](/blog_md/2011/0822_AMakefileforTDDwithC.md).
