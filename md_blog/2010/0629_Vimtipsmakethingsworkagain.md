# Vim tips: make things work again

@meta publishDatetime 2010-06-29T01:00:00.009+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/vim-tips-make-things-work-again.html

Are you [using :make within vim](md_blog/2010/0629_Vimtipsmakethingsworkagain.md)? If you are, then you probably noticed that getting lots of compiler errors is not uncommon, and that vim has a tendency of jumping to the first error found... but what happens if you want to see subsequent errors too, because you're a really crappy programmer and need to find the 10 or 20 errors you just introduced with your single line edit?

Luckily Vim is always the anwser, just use **cnext** and **cprev** until you reach the error you are looking for.

