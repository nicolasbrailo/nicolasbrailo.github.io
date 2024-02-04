# Vimcrypt

@meta publishDatetime 2016-12-14T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/12/vimcrypt.html

Have you ever been working on your plans for world domination but got scared someone else might find them? It happens to me all the time. Or maybe you are so paranoid that you need to encrypt your grocery list. Perhaps you are sharing a semi-private text file through a public service? Good news, Vim has you covered. Just type ":X". Vim will ask you for a password. Save your file again and voila, your file is now encrypted. Open the same file with Vim to decrypt it. Your plans for world domination are now safe!


---
## In reply to [this post](), [Anonymous]() commented @ 2017-04-10T23:45:03.000+02:00:

You should use ":set cm=blowfish2" to use the not broken Blowfish implementation, the old one is still the default for backwards compatibility.

Original [published here](/blog_md/2016/1214_Vimcrypt.md).
