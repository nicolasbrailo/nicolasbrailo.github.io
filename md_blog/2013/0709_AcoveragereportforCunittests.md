# A coverage report for C++ unit tests

@meta publishDatetime 2013-07-09T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/a-coverage-report-for-c-unit-tests.html

A lot of tools and metrics which are pretty much given for some dynamic languages are quite esoteric in C++ land. Unit testing is one of these tools, and so code coverage metrics is even more obscure in C++. Turns out it's not impossible. I have uploaded an [example C++ project with unit tests and code coverage report generation](https://github.com/nicolasbrailo/gcov_gtest_sample). Shouldn't be to hard to adapt this code to your own project.

Let's analyze some of the core concepts of this example.

### Unit testing

A coverage report only makes sense if you have a suite of unit/integration tests. gtest and gmock have worked the best for me but I guess anything that can run a suit of tests will be good to get a coverage report.

### Getting some coverage

gcov is a simple utility you can find on Linunx to generate coverage reports. gcc has support for it, you just need to compile with "-fprofile-arcs -ftest-coverage --coverage" and link with "--coverage -lgcov". If you see the [line 10 on the makefile for the example project](https://github.com/nicolasbrailo/gcov_gtest_sample/blob/master/Makefile#L10), you'll see I define a new build type, special for coverage report.

Once the project is built with support for gcov, [running the tests](https://github.com/nicolasbrailo/gcov_gtest_sample/blob/master/Makefile#L49) will generate a bunch of stats for lcov to pick up. The makefile includes [a target](https://github.com/nicolasbrailo/gcov_gtest_sample/blob/master/Makefile#L67) that takes care of all these steps, compiling the program with gcov support, running the tests and then collecting the results into a nice html report.

### Getting it running

Unfortunatelly, generating a coverage report has a lot of dependencies in C++. For the example on my github repository you'll have to install lcov, cppcheck, gtest, gmock and vera++ (a code style checker for C++ which is now discontinued... you should probably search for a replacement). Once you have it running, though, you can easily integrate this with your jenkins setup.

