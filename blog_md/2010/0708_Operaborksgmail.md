# Opera borks gmail

@meta publishDatetime 2010-07-08T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/07/opera-borks-gmail.html

Ubuntu sucks, but less than windows. Gmail sucks, but less than hotmail. Opera rocks, but it tends to fuck up gmail every once in a while. After a lot of research and having found no help on the interweb I traced the problem to having a lot of tabs open for a lot of time (weeks, not hours).

In Firefox this shouldn't be a problem as having a FF browser open for a week should hog all the memory on its host computer, forcing you to reboot. In Opera, being a little bit better behaved browser, this may actually be a problem.

Luckly the fix is simple: open a [Vim](/blog_md/youfoundadeadlink.md) editor or take out pencil and paper, make a list of all your open tabs, close opera and using your favourite console type "rm -rf ~/.opera/sessions" (i.e. delete the sessions folder in your .opera dir). Restart Opera and restore your tabs from your backup list. Problem should be gone.

