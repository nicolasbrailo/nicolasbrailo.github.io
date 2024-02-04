# Vim tip: autocommands

@meta publishDatetime 2016-02-25T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/02/vim-tip-autocommands.html

Whenever you find yourself thinking "I wish Vim could do this automagically for me", you probably are thinking about autocommands. With autocommands, autocmd for short or au for lazy people, will let you tell Vim, "Hey, use this callback when an event occurs".

The basic structure is pretty simple: "autocmd Event FileType Action". So, for example, "autocmd BufEnter \*.txt call Rot13()" would tell vim to set a callback on BufEnter, that is whenever you change buffers, for all \*.txt files, which will rot13 your text. Feel free to use this for actually useful things, like spell checking or auto indenting.

