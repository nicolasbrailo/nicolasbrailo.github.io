# LaTeX: including documents

@meta publishDatetime 2009-07-07T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/07/latex-including-documents.html

This is a post from my LaTeX series - [check the others too](/search/label/LaTeX)!

So far we've seen some of LaTeX advantages, and a few basic commands to get you started. Let's see a trick to be more proficient with it:

### Including other tex files

You should be able to write some simple documents now, some in LyX, some in LaTeX, but you'll soon start to notice that using a single text file to create a large document becomes cumbersome. Even more so if you need to split the work between several people in a team.

There's an easy way to keep a main file and then several, smaller, files in which you can work more comfortably:
```
include{file.tex}
```

Easy, right?

Beware, you can't use an include inside an include. Why? No idea, but there's a way around this:
```
input{file.tex}
```

### Quick preview

Using includes has another advantage: you can have a quick preview while working with a chapter at a time. I usually keep the following structure within my projects:

```
% Header declarations
% Include packages
% Document preamble
% ...

%input{chapter1.tex}
%input{chapter2.tex}
input{chapter3.tex}
% input{chapter4.tex}
```

Just uncomment the chapter you're working with. In big documents this has a very noticeable effect, as compiling a large LaTeX file into an enormous pdf document (several MBs) may be quite slow.

Of course, I use "input" in my main file so I can use include in the chapters themselves. I won't usually need to include other documents inside the chapters, it'd get quite messy, but it's necessary to work with embedded documents, as we'll see in another post.

