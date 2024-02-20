# LaTeX: Including Source Code

@meta publishDatetime 2009-07-09T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/07/latex-including-source-code.html

I'm sure every programmer has had to include source code in a document at least once, an architecture documentation for example, or perhaps as part of a presentation (beamer FTW, coming soon!). With most document formats including source code usually means writing the code and use some kind of manual syntax higlighting. Of course, any time you change the source you'll need to manualy update the document.

In LaTeX there's an easy way to handle source code. Though it was difficult to figure out, once in place this requires no maintenance at all - no need to manually syntax highlight your code nor update any files other than the source code itself. Even more, you can even change the source code language and it won't even matter in the presentation.

### Preliminars

You'll need "pygmentyze" which is provided by the package python-pygments:

```c++
apt-cache search pygment
python-pygments - syntax highlighting package written in Python
sudo apt-get install python-pygments
```

Using it is really easy, check the manpage. Anyway, I'm too lazy to generate the syntax highlighted document by hand, let's add it to the makefile.

### Automating the source code generation

Let's beging by adding a "code" folder inside our project. We'll store there all the source code files, and having them in a separated folder will enable us to add a target in the makefile to automatically update the source code in the LaTeX file.

Remember the makefile from a couple of posts back? Let's add a target:

```c++
# Hack to make it work when foo.code =&gt; foo.code.tex
code/%.tex: code/%.* code/%.aux code/%.tex
  @rm code/*.aux
 $(MAKE) -C .

code/%.tex: code/%.*
 pygmentize -f latex -O style=&#x27;border=#000000,colorful,linenos=1&#x27; $&lt; &gt; $@

# Search each code file to format and include
CODE_FILES:=$(shell ls code/|egrep -v &#x27;.tex$ |.aux$ &#x27; )
CODE_FILES_DEP:=$(addprefix code/, $(CODE_FILES))
CODE_FILES_TGT:=$(addsuffix .tex, $(basename $(CODE_FILES_DEP)))

main.pdf: $(shell ls *.tex) $(CODE_FILES_TGT)
  pdflatex main.tex &gt; /dev/null
```

OK, maybe a couple more than one. It may seem like a lot of makefile code but all it does is define a code directory and a target to run pygmentize on each source file found there. We'll have to add a dependency in the document's target so it'll be automatically generated with each build:

```c++
main.pdf: code_frames *.tex
  pdflatex main.tex &amp;&amp; pdflatex main.tex
```

and then, we'll need to clean up the new temp files:

```c++
code_clean:
 @rm -f $(CODE_FILES_TGT) code/*.aux
```

Don't worry, there's a link to the full makefile.

### At last!

It shouldn't have been too much work and we're done anyway. To include a source code file in your document now use the include command (like include{code/foobar.cpp) and re build. I'm attaching a complete example in a zip file, with my latest implementation of a bogosort algorithm (now 50% faster).

* [Makefile](md_blog/youfoundadeadlink.md)
* [source\_code\_example.tar](md_blog/youfoundadeadlink.md)
* [Compiled example project](md_blog/youfoundadeadlink.md)


---
## In reply to [this post](), [Anonymous]() commented @ 2010-02-14T21:25:57.000+01:00:

You can use the package listings too.

Original [published here](md_blog/2009/0709_LaTeXIncludingSourceCode.md).
