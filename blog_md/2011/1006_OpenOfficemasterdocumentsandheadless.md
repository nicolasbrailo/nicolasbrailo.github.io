# Open Office, master documents and headless

@meta publishDatetime 2011-10-06T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/10/open-office-master-documents-and.html

I have been writing some documentation lately (crazy, I know) and needed due to some bizarre business requirements all the documentation for the application was supposed to be in a single .doc file. That's write, a single file for user manual, technical manual, administration manual and so on. And I had no LaTeX either (damn those MS Office files, I hate them) so using multiple tex files and including them together wasn't an option.

Choosing the least of all evils, I decided to use Open Office and master documents. With them you can create several different .doc files and then join them together in a single .odm file, which can then be exported to pdf (or .doc, if your boss says so). It's a nice feature, but for such a simple thing as having multiple documents #included in a single one you would expect it to work better. From OO manual:

> Yes, master documents do work in OOoWriter. However, their use is full of traps for inexperienced users[...]

Oh, thanks a lot OO.org (?). BTW, exporting an odm to pdf with a headless set == FAIL (i.e. don't even try to use this if you intend to [autogenerate some documentation with your makefile](/blog_md/2011/0913_Automagicdocumentconversionforyourmakefiles.md)).

