# LaTeX!

@meta publishDatetime 2009-05-12T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/05/latex.html

Some time ago I wrote a review about [LyX](http://debaday.debian.net/2008/01/20/lyx-a-text-editor-that-stays-out-of-the-way/) for [DPOTD (recommended link)](http://debaday.debian.net) and now I think it's time for an update: what can you do when LyX is not enough?

I'll quote myself; the original article ends (almost) like this:

> **What LyX isn’t for**
>
> Although LyX may be a valuable piece in anyone toolkit it’s worth noticing it isn’t exactly the Swiss army knife of the text editors. If you need to define a very customized layout or format, like slides for a presentation, this is the wrong tool for the job.

After having prepared several presentations with LyX (even my CV!) I'd like to write some more on this last part. Even if I thought that my original comment was mistaken I write once again the same: when you have to create a presentation LyX is not the tool for the job, LaTeX is.

As I explained in that article, LyX is a front-end for LaTeX but at the same time it's only a small part of LaTeX. Doing several presentations in LyX (using Beamer, a package I'll talk about in another post) I noticed that most of my documents where "ERT", evil red text, which is nothing else than plain TeX code: that means, each time more, I was using LaTeX functionality not available from LyX. This is the reason I've decided to write a how-to LaTeX, a small survival guide for those want to start using with the tips and tricks I've learned in this time.

The target for these posts series will be, mainly, programmers or other advanced users, without fear of working a little bit in the console, markup languages and maybe a makefile.

Soon the first part :)

