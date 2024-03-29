# LaTeX: LyX Revisited

@meta publishDatetime 2009-06-29T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/06/latex-lyx-revisited.html

Seeing I'm publishing a new LaTeX series it seems appropiate to review my old LyX article. This is just a copy & paste from <http://debaday.debian.net/2008/01/20/lyx-a-text-editor-that-stays-out-of-the-way/>
Did you ever get to struggle against your text editor’s random format feature while trying to write a document? Open Office may be a great project, but when you want to focus on the content, it can be annoying to have your editor format or unformat your text, seemingly at random.

Well there are good news for those of us using Vim to create content and then Abiword to format it: LyX is a text editor that produces beautiful documents, without the need of being a designer, and yet manages to stay out of the way. From the tutorial and the homepage (www.lyx.org):

> LyX is the first WYSIWYM (What You See Is What You Mean) document processor. The basic idea of LyX is that you do not need to handle style, or actually, you use a set of predefined styles and concentrate on your document content, This makes sure that your resulting document will be typographically correct and good looking visually. […] LyX uses Latex as its back end typesetting mechanism.

Sounds great already, doesn’t it?

### A first look into LyX

Upon start LyX looks more or less like any other graphical text editor in the universe:

[MISSING IMAGE]

Well, it’s logo may look nicer, but that’s about it. Anyway, the magic starts just as you start writing: you’ll notice most of the common format options seems missing, but you can define what you’re writing instead:

[MISSING IMAGE]

Note that we don’t tell it to center it or to make the font larger and bold. LyX takes care of all that automatically. Simply click on the format menu (below File, and it has the default value of “Standard”).

So instead of defining Times New Roman 12px bold centered, you say «Title». WYSIWYM, remember? In the homepage there is a «Graphical Tour» with all the basic functions, it’s quick and it’s great: www.lyx.org/LGT

### Some useful features

LyX also provides a great support for math formulas (and all the weird symbols you can think off). Just click the button «Insert Equation» and a box to enter math symbols will appear. No more struggle to align the dividend and the divisor!

Of course, LyX provides the usual features such as tables, spell checking, footnotes and many more. The tutorial of the application is more than complete, and easy to follow.

### LyX documents formats

LyX documents can be exported to a wide variety of formats, mainly because being based on Latex it takes advantage of the already existing conversion programs. Some of the possible export plugins installed by default are PS, PDF, DVI, Latex, HTML and Plain text, but custom ones may be defined.
What LyX isn’t for

Although LyX may be a valuable piece in anyone toolkit it’s worth noticing it isn’t exactly the Swiss army knife of the text editors. If you need to define a very customized layout or format, like slides for a presentation, this is the wrong tool for the job.

### Availability

According to it’s homepage, LyX 1.5.3 was released the 16 th of December, 2007. It’s available in Debian since Sarge (packages.debian.org/LyX). Lyx Version 1.5.1, released 4 th of August, 2007, is available in the repository of Ubuntu 7.10. Development is still active. There’s also a Windows version for those of us stuck with primitive a OS at work.

