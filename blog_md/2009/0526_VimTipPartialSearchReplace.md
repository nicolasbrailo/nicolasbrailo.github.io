# Vim Tip: Partial Search & Replace

@meta publishDatetime 2009-05-26T01:00:00.005+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/05/vim-tip-partial-search-replace.html

So, you have a paragraph, or any kind of text, and need to replace a substring without altering other paragraphs. You could write :set number and then :A,Bs/what to search/what to replace/g, being A and B the start and end of the paragraph, or you could just use [visual mode](/blog_md/2009/0507_VimTipVisualMode.md).

Enter line selection mode (Shift + V) and then select a block of text. Without moving the cursor any further type :s/SEARCH/REPLACE and the search string in the selected block will be replaced without altering any other part of the document.

