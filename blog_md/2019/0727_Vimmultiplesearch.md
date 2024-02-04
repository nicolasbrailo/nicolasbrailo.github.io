# Vim multiple search

@meta publishDatetime 2019-07-27T13:51:00.001+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2019/07/vim-multiple-search_27.html

I keep forgetting about this one. Maybe writing it down will help me remember: Vim can search for (and highlight) multiple patterns at the same time. Just start your search with \v and split the patterns with |. Eg:

:/\vfoo|bar

