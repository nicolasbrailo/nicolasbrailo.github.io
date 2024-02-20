# Vim Tip: Rot 13

@meta publishDatetime 2009-09-15T01:01:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2021/02/vim-tip-rot-13.html

Are you still puzzled by [last week's C++ question](/md_blog/2009/0910_Cincrediblyuselessstuff.md), yet you are too lazy to actually search for a Rot13 decoder OR use gcc to check if it works? Well, Vim can do the trick, just use g? to convert text to Rot13

You may combine it with block selection or you can just convert the whole damn thing using "ggg?G". gg goes to the beggining, g? converts to rot13, G goes to the end.

This is all very nice but I'm still trying to figure out a way to convert back from rot13 to normal text, can anyone provide a clue?

