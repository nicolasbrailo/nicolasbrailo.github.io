# Ruby-style digit separator for C-98?

@meta publishDatetime 2015-04-07T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/04/ruby-style-digit-separator-for-c-98.html

A silly, and not very useful tip: I love how ruby allows you to write numbers like 1000000 as 1\_000\_000. Very useful to write benchmarking tests.

Until we get to C++14 we don't have a nice alternative, but we have an ugly hack we can use: instead of writing 1000000 write "1 ## 000 ## 000".

It works, '##' is the preprocessor's token pasting operator, and it will paste two tokens together. Looks ugly, breaks the GUI highlighting, but at least you can count how many zeros you've got.

Nitpicker's corner: multiplying by 10 is easier, but there is no job-safety involved in that.

Nitpicker's corner II: The evaluation order of a chain of '##' is not defined, but I don't expect this to cause any problems; any order of evaluation should result in the same result for this case.

