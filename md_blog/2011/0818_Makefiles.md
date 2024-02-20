# Makefiles

@meta publishDatetime 2011-08-18T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/08/makefiles.html

For open source projects, makefiles are a must. All C++ projects need them, even though cmake is strong nowadays, and even though Java has its own version (actually, several of them, but that's not important now) a makefile could be used.

Even if it is an ubiquitous build system, it is pretty much outdated nowadays, and although using its basic features is easy, mastering it is a complex task. Worst still, mastering makefiles means you'll probably produce write-only-code, and as makefiles are code themselves, and must therefore be maintained, this can be a nuisance to a newcomer to your project.

There's an upside to makefiles being code: they can be reused. Once you find a configuration that suits your development process, you don't need to write it again. I'll post here some of the main targets I ussually include in a common.mk. As I mentioned, it's mostly write-only-code, yet you may find it useful:

```c++
# Dependency directoy
df=$(BUILD_DIR)/$(*D)/$(*F)

$(OBJECTS): $(BUILD_DIR)/%.o: %.cpp
	@mkdir -p $(BUILD_DIR)/$(*D)
	$(COMPILE.cpp) -MD -o $@ $&lt;
	@cp $(df).d $(df).P;
	sed -e 's/#.*//' -e 's/^[^:]*: *//' -e 's/ *\$$//'
		-e '/^$$/ d' -e 's/$$/ :/' &lt; $(df).d &gt;&gt; $(df).P;
	rm -f $(df).d

$(MAIN_OBJ): $(MAIN_SRC)
	$(COMPILE.cpp) -MD -o $@ $&lt;

# Binary name depends on BIN_DIR/BIN_NAME, so the call to create BIN can
# be forwarded to BIN_DIR/BIN_NAME
$(BINARY): $(BIN_DIR)/$(BINARY)
$(BIN_DIR)/$(BINARY): $(OBJECTS) $(DEPS_OBJECTS) $(MAIN_OBJ)
	@mkdir -p $(BIN_DIR)
	@# Workaround for a linker bug: if the libs are not
	@# at the end it won't link (something to do with how the linker
	@# lists the dependencies... too long for a comment, rtfm
	g++ $(CXXFLAGS) $^ -o $(BIN_DIR)/$@ $(LDFLAGS)
	@#$(LINK.cpp) $^ -o $@

-include $(DEPENDS)
```

How is this used? Well, don't even try to understand the dependency autogeneration, it'll make your head explode.

```c++
$(OBJECTS): $(BUILD_DIR)/%.o: %.cpp
```

This defines a rule for building .o objects; a variable named OBJECTS should be present when including this file.

```c++
$(MAIN_OBJ): $(MAIN_SRC)
```

A special rule is defined for a main object (actually this is needed to compile the tests, which we'll do next time, since you may have a different main function).

```c++
$(BINARY): $(BIN_DIR)/$(BINARY)
$(BIN_DIR)/$(BINARY): $(OBJECTS) $(DEPS_OBJECTS) $(MAIN_OBJ)
```

And finally, a rule for to create the real binary. Next time I'll add some cool features for TDD to this makefile.


# Comments

---
## In reply to [this post](), [Links 20/8/2011: Linux Graphics Survey, Firefox 7 Beta | Techrights](http://techrights.org/2011/08/20/firefox-7-beta/) commented @ 2011-08-20T08:13:24.000+02:00:

[...] Makefiles [...]

Original [published here](/blog_md/2011/0818_Makefiles.md).

---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » A Makefile for TDD with C++](/blog_md/2011/0822_AMakefileforTDDwithC.md) commented @ 2011-08-22T09:09:05.000+02:00:

[...] after reading my post about makefiles you decided that you like them but would like to add some TDD to be buzzword compliant? No problem, [...]

Original [published here](/blog_md/2011/0818_Makefiles.md).
