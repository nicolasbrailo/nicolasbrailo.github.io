# cerr vs cout

@meta publishDatetime 2015-06-04T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/06/cerr-vs-cout.html

In C++, is there a difference between cerr and cout, other than using a different file descriptor? Turns out you can learn something new every day.

Whenever I just want to add a quick print statement because I'm too lazy to debug something, I used to use cout. All along I thought cout and cerr would be exactly the same for my use case, but turns out there's a slight difference: cout is buffered, cerr is not. This very small difference can have a huge impact, because you shouldn't need to flush cerr after a write to make sure the changes are visible, it should happen automagicaly. In turn cerr might be slightly slower, but you probably don't care about that when writing cerr << "I'm here!".


# Comments

---
## In reply to [this post](), [Monah Tuk](https://plus.google.com/+MonahTuk) commented @ 2016-03-15T04:26:19.000+01:00:

Hi Nicolas!

you forgot std::clog :-) clog = cerr + buffering. My selection:
cerr - for error logging (it name correspond :-))
clog - for any diagnostic loggings (with or without std::endl, that also flushes output)
cout - produce regular program output that can be used in the pipe with other programs.

In such way, piped application will work correct and diagnostic messages will not mixed to the regular output and will not confuse other programs in pipe. Also, you can redirect regular output to the file but observe diagnostic and error messages in terminal.

Original [published here](md_blog/2015/0604_cerrvscout.md).
