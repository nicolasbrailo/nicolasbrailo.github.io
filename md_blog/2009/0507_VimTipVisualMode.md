# Vim Tip: Visual Mode

@meta publishDatetime 2009-05-07T18:44:00.002+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/05/vim-tip-visual-mode.html

There's normal mode, command mode and a third, less known to the beginners, visual mode. What's this mode about?

Using Vim on visual mode can make some rather complex tasks and regex operations go away with a couple of keystrokes and it's as easy as selecting the text you want with the cursor.

Move your cursor over the first part of the text you're trying to select and press Ctrl + V to set Vim to visual mode, then move the cursor to the last part of the text you're trying to select (it works in blocks, not character by character nor line by line... try it, it's easier than it may seem).

What can you do after selecting text this way? Pretty much anything else you'd do with normal text, like cut (x) and paste (p). This is specially useful when working with formatted text (i.e. programming).

Visual mode can also work with lines (use Shift + V instead. Notice the uppercase V) and with other modes; check the manual for more information.

