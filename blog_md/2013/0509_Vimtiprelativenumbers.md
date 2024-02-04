# Vim tip: relative numbers

@meta publishDatetime 2013-05-09T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/05/vim-tip-relative-numbers.html

Knowing the line number in Vim is crucial: you might need to jump to a specific line to fix a compiler error, you might want to check your current line to tell someone else where they broke something, or you might need to know a line number, and the diff to your current line, so you can delete N lines.

You can "**set number**" to get the line number in a bar at the left, and that's fine for most things but also quite unnecessary:

* You can jump to a line by typing ":"
* You can see your current line by checking it on the lower right status box
* ... but what if you need a delta from your current position?

That's even easier: just "**set relativenumber**" and the numbers on the left will turn into a relative position from the position of your cursor.

Now you won't have to count the lines you want to delete: you can instantly know the N on dNd!

Bonus: watch vim newies struggle with the changing line numbers

