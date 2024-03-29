# Bebugging / Fault injection

@meta publishDatetime 2013-02-21T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/02/bebugging-fault-injection.html

Releasing any software with a degree of confidence on its quality can be a difficult task. A way to improve this confidence is adding test. Easy enough, but then how do you know if you are actually testing what needs to be tested? Metrics like code coverage are very helpful but they also provide a false sense of security that can be even worse than having no unit testing at all.

One way of determining how reliable your testing suit is, is to test your testing suit. No, not by writing more tests but by writing more bugs!

The idea is simple: give your code to someone who is not a programmer on the project, someone who can know nothing about the implicit assumptions and preconditions you and your team mates already have about the code, the same assumptions and preconditions necessary to make stuff don't crash. Ask him to break things. Nothing too fancy, only subtle stuff; a memory leak over there, a sign vs unsigned comparison over here, an equal changed by a non-equal in an if (and please do it in a branch!).

Once you get a faulty branch of your project, try to see how many of the bugs you can detect using your testing suite (yes, valgrind should probably be part of your testing suit, albeit not a unit-test). No diffs, please.

Seeing how many bugs go unnoticed on a fault injection session can give you an idea of how comprehensive your unit tests are. It can be a very humbling experience, too.

You can find more information about bebugging in [Wikipedia](http://en.wikipedia.org/wiki/Fault_injection).

