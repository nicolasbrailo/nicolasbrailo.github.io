# LaTeX: Makefile

@meta publishDatetime 2009-07-02T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/07/latex-makefile.html

Remember I said that being a programmer would make you a lot more comfortable around LaTeX? The reason is quite simple, tex is just source code for a document. As with any source code in Linux (Windows too, but that is besides the point) you can use a Makefile to compile it and make your life easier.

I have already posted this Makefile in [another entry](/blog_md/2009/0528_LaTeXbasics.md) but it's time to explain how it works.

```c++

all: main.pdf

main.pdf: code_frames *.tex
  pdflatex main.tex &amp;&amp; pdflatex main.tex

.PHONY: run clean edit
edit:
  gvim -S vim.sess

run: main.pdf
 evince main.pdf &amp;

clean:
 @# for each .tex file, remove the extension
 @#    and delete its generated files
 @for PART in $(shell ls *.tex| sed 's:.tex::g'); do
   echo "*.out *.nav *.aux *.toc *.log *.snm *.pdf *.vrb" | \
      sed "s:*:$$PART:g" | xargs rm -f;
 done

```

It's rather easy, let's check it target by target:

* **all**: create the main document - used as default target
* **main.pdf**: document's target - no need to call it main.pdf, I just do it because the entry point in C programs is called "main" so I'm used to it. Also, it looks better than foo.pdf. As a side note, it runs twice "pdflatex" because it first creates the document and the second time updates the document's index.
* **edit**: I usually have a single document split in many files, so keeping a line to quickly open up your editor with all this files is handy. I just keep it as a Vim session, no need for more
* **run**: target to open up the document in a pdf viewer. I call it run so I can use it with my default mapping in Vim
* **clean**: clean up the files created while compiling a document. Some times it's needed if there's an error you can track - it may be a corrupted .aux file

Short entry this time - next: using source code from within LaTeX.

