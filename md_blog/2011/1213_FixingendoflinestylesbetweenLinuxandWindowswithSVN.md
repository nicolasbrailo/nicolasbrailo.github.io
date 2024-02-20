# Fixing end of line styles between Linux and Windows with SVN

@meta publishDatetime 2011-12-13T07:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/12/fixing-end-of-line-styles-between-linux.html

Quite a mouthful for such an easy thing. Don't you just hate when half the people in a project use CR/LF and the other half just LF?

Luckly this is easy to fix, assuming you are using svn. You can use something called [auto-props](http://www.mediawiki.org/wiki/Subversion/auto-props) to setup the eol style for different file types.

Set it once for the project, never worry again. Anyone knows its git counterpart?

