# Detecting and ignoring third party memory problems with Valgrind

@meta publishDatetime 2013-06-20T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/06/detecting-and-ignoring-third-party.html

Lot's of people seem to give up on Valgrind after they see the dreaded "More than ### errors detected, go and fix your program". If the bulk of these errors are caused by crappy code in third party libraries there's very little to be done to fix them, other than creating a ticket for the library maintainer (and if the bulk of these errors are caused by your own code... well, don't write a watchdog please, do fix your program!). And that's assuming the reported error is not even a false positive, since Valgrind can report problems for crazy optimizations -O3 might have or for weird operator arithmetic.

If these spurious memory errors are there for too long most people will start ignoring Valgrind's output. Luckily, ignoring errors we can't fix is a possibility too, using Valgrind's ignore files.

* Check if someone else has already found this issue. Many times libraries do have an "official" ignore file for the lib
* If you find no ignore file, make really really sure the problem is not on your code. Preferably write a minimal unit test that triggers the warning on Valgrind. Make sure you're not misusing the library.
* Add whatever warnings you found which were not on your application to a new ignore file
* Share your ignore file with the world! Other people will either find it useful or tell you that what you thought was a bug on a lib is actually a problem on your code. That happens more often than not.

