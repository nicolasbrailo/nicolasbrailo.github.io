# C preprocessor: Just a simple replacer?

@meta publishDatetime 2013-08-20T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/08/c-preprocessor-just-simple-replacer.html

Lately, out of curiosity, I spent some time to better understand how the C preprocessor works. I admit it, I thought it was a very dumb copy-paste based replace mechanism, only capable of doing the simpler keyword matching and replacement. Boy, was I wrong. Turns out the preprocessor is actually an organically grown pseudo language (as opposed to a properly designed language feature) inside C, which later got standardized through an incredibly complex set of rules and definitions. Rules for recursion, expansion, pattern matching and crazy operators like # and ## are some of the things that I never before knew existed in the preprocessor.

During my time toying with the preprocessor I learned a few things about recursion, the different operators supported by it and some crazy things about the order of conditional evaluation. I'll summarize some of the things I learned in the next few posts: you might want to check 16.3 in the C++ standard, since the next few articles will be only explanations about different paragraphs on this section.
Disclaimer: if you find any real-world utility to these bits of preprocessor trivia, you are probably doing something horribly wrong or horribly evil!

