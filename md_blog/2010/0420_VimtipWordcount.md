# Vim tip: Word count

@meta publishDatetime 2010-04-20T01:00:00.010+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/04/vim-tip-word-count.html

Trying to count words is a common task. Whenever you're writting a report for class, that is. There are some legitimate reasons but they don't matter now: it's a great chance to show off how great Vim is.

First method: Type ggVgY"\*p to copy the whole text. Then paste it into word and use word count.

Second method: Type %!wc -w, which executes wc on each line.
Third method: Type g^g (g, CTRL+g) and watch the bottom of your screen.

As ussual, Vim rocks.

