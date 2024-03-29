# LaTeX basics

@meta publishDatetime 2009-05-28T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/05/latex-basics.html

LaTeX basics
------------

Remember [last post](md_blog/2009/0521_AcaseforLaTeX.md)? I mentioned it's possible to create several type of documents. Even if the structure will, most likely, be different for different applications, there's a common ground which can be used for most LaTeX documents. I'd go as far as saying ALL of them, but in LaTeX it's possible to override everything and anything. Any reasonable package won't do it, so let's see some LaTeX basics you can use for any project.

### LaTeX documents

The first thing to understand about LaTeX, it's not [WYSIWYG](http://en.wikipedia.org/wiki/WYSIWYG). If you use a plain text editor you won't see any kind of format at all (LyX provides some sort of preview though). This confuses some people who, used to Word-like applications, tend to think in the structure and desing before the contents; LaTeX is different in the way to structure documents, a way which is called What You See Is What You Mean, [WYSIWYM](http://en.wikipedia.org/wiki/WYSIWYM), for short.

What does being WYSIWYM means? You just think about the content and structure and it gets formatted for you. Instead of saying you want "Centered, Arial 12px orange font with pink background" just say "this is a title". The format will be there, but not attached to the content - it'll be in a "stylesheet", the document's class (\*). Of course, these styles can be changed too.

WYSIWYM has a downside too: you'll have to "compile" the mark-up text into a pdf (or any other format) using **pdflatex**, for example. It may be a shock to some but it's not difficult, just write "*pdf2latex file.tex*" and let it work its magic. You can use the [makefile I'm attaching](https://example.net/brokenlink/2009/05/makefile.html) to this post too, if you feel comfortable with makefiles ([The makefile](https://example.net/brokenlink/2009/05/makefile.html) has a few cool tricks you can use too. I'll explain all of it in another entry).

### Seeing some examples

In GNU/Linux you can find lots of examples and templates in /usr/share/doc/texlive-doc/latex/ (no idea where may they be in Windows). Writing this article I found out lots of templates I didn't know about so go and take a look. Go on, I'll wait here. Done? Ok, let's move on.

### Preamble

In LaTeX there's a basic structure every document follows:

```
% Preamble
begin{document}
end{document}
```

What comes before the *begin*'ning is the preamble. There you can tell LaTeX:
* Which packages are you going to use - there are lots of packages, some examples include source code highlighting, including images, absolute positioning of figures and much more. Include them with the usepackage command

* The style - there are stylesheets you can use, just as you do with HTML, and the preamble is the place to define them. How to do it is package-dependent, Beamer, for example, uses a usetheme tag.
* Global declarations - You may declare an image which you'll use throughout the entire document, you're company's logo for example
* The author(s) - OK, this is a global declaration too, but there is certain meta-data which is declared in the preamble that's quite handy and author is one of them.
* The title - same as before, the title is very important in your document!
* Lots more - there are package dependent declarations so there's no way to create a comprehensive list, just remember it's a place to put global settings

This post is getting a little bit too large so I'll leave some basic commands for the next one; you should be able to start writing some basic documents anyway.

(\*)  Yeah, something like content and style separation but only a couple of decades before it was "invented" for the WWW.

