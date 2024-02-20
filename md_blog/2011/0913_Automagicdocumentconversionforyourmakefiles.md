# Automagic document conversion for your makefiles

@meta publishDatetime 2011-09-13T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/09/automagic-document-conversion-for-your.html

So, now you have [a common makefile](md_blog/2011/0818_Makefiles.md), ready to be used for a TDD project and for [code coverage report automagic generation](md_blog/2011/0830_AMakefileforcodecoveragereportwithC.md). Not only that, but it even [speaks to endlessly annoy your team](md_blog/2011/0906_Atalkingmakefile.md). What else can we add to this makefile? Well, automatic documentation generation, clearly.

> You want to batch convert .doc to .pdf using the command line on a server without a GUI? Or you need automated .ppt to .swf conversion through cron, a sysvinit service, or a remote web server? Online conversion services such as Zamzar.com and Media-convert.com not working for you? Whichever formats you need to batch convert, PyODConverter is a simple Python script for just this purpose.

-- <http://www.oooninja.com/2008/02/batch-command-line-file-conversion-with.html>


# Comments

---
## In reply to [this post](), [Nicolás Brailovsky > Blog Archive > Open Office, master documents and headless](md_blog/2011/1006_OpenOfficemasterdocumentsandheadless.md) commented @ 2011-10-06T09:06:58.000+02:00:

[...] Oh, thanks a lot OO.org (?). BTW, exporting an odm to pdf with a headless set == FAIL (i.e. don't even try to use this if you intend to autogenerate some documentation with your makefile). [...]

Original [published here](md_blog/2011/0913_Automagicdocumentconversionforyourmakefiles.md).
