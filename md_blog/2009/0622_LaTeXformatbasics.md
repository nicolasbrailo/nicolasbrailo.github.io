# LaTeX: format basics

@meta publishDatetime 2009-06-22T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/06/latex-format-basics.html

### Basic structure

So, what's the most basic structural elements for any document you write? **Paragraphs**, of course. I ussualy use LyX for writing paragraph-based documents (i.e. most of them) and presentations don't have many, so perhaps this is the structural element I use the least. Oh, wait, there's no element, just a "nn". Point for LaTeX (take that, HTML).

You'll also need to put titles, sections, subtitles and all that stuff to give your document a nice structure. Well, that's easy too, just use

* section{name}
* subsection{name}
* subsubsection{name}

Easy, right? Check the example at the end of the post.

There are some other commands you'll use in any LaTeX document:

* **Footnotes**:

```
footnote{ Footnote text }
```

Just write your text, it'll be there when you compile the document

* **Vertical skip**:

```
bigskip
```

Because, some times, LaTeX default formatting won't be enough.

* **Align text** Center:

```
begin{center}TEXTend{center}
```

Right:

```
begin{flushright}TEXTend{flushright}
```

Again, some times you may need it. Not too often, though.

You should now be able to write your first LaTeX document, starting from a template (always start with a template... it's easier). I'm attaching to this post an example document in LyX, LaTeX and its compiled pdf, in case you're wondering what does it look like in the end. For the next entry: some "advanced" tips and tricks, now let's see an example LaTeX document:

```
documentstyle[11pt]{article}
title{LaTeX Example}
author{Nicol'as Brailovsky}
setlength{topmargin}{-.5in}
setlength{oddsidemargin}{.125in}
setlength{textwidth}{6.25in}

begin{document}

maketitle
This is just a LaTeX kick off, with some basic commands.

section {Section one}
For example, this is a paragraph.
begin{quotation}
{ em Lorem ipsum dolor sit amet, consectetur adipiscing elit.}
Donec porta, enim eget tempus tempor, eros sem dapibus diam, vitae lacinia mauris metus id nulla.
end{quotation}

subsection{Subsection}
You can have subsections too ldots

subsection{Subsection'}
ldots as many as you want

subsection{Random stuff}
You can even create a shopping list in LaTeX, if you wish
begin{center}
begin{itemize}
item Beer
item Beer
  begin{itemize}
    item (Another brand of beer)
  end{itemize}
item Pizza
item Beer
end{itemize}
end{center}

Or even better, use it to do the homework. \
Math is a breeze in LaTeX: $x_n = sqrt{a + b}$ can be typeset inline.
end{document}

```

You can download the compiled document from [this link.](/md_blog/youfoundadeadlink.md) May be it doesn't look too useful (I'd use [LyX](http://www.lyx.org) instead) but soon we'll start doing some cool stuff LyX can't handle. Keep tuned for the next LaTeX article.

