# Retrofitting unit tests for legacy code

@meta publishDatetime 2009-10-23T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/10/retrofitting-unit-tests-for-legacy-code.html

Some time ago I saw a discussion at [google test](http://code.google.com/p/googletest/) mailing list which made me ask myself how would I go about implementing TDD for a legacy codebase project, based from previous experiences. I came up with a list, open to discussion, which may be useful as a guideline for someone in this situation.

### Start with integration tests

Integration tests are ugly and won't give you a lot of information about what went wrong when something does, but you have no chance of running real unit tests in [non-injectable](http://en.wikipedia.org/wiki/Dependency_injection) code.

Use the integration tests as a safenet to refactor the critical methods, those which will be changed the most during the projects lifetime, which leads me to the next point;

### Test as you refactor (or implement new functionality)

If you plan to stop the business and write a kabillion tests for your legacy codebase you're out of luck. Not only you'll fail because the lack of value but you'll spend weeks writing tests and never see the ROI - you'll quickly grow tired.

With integration tests in place take your time to write real unit tests as needed, that is when you implement new functionality or when you plan to refactor something - which should be to implement new functionality or to fix a bug.

### KISS

Can't stress this enough: keep your tests simple. You'll notice you end up with 80% boilerplate code, setting up mocks, creating test objects, etc. When that test fails you'll have no clue why was it there in the first place.

This happens a lot with legacy codebases, where stagnant code tends to get quite coupled and messy. If you plan to write a big mega test to cover every use case with a single test, the day it fail you'll quickly know it's not production ready but you'll have no clue why is that.
### Mock layers

If you have a project divided in components (even the ugliest legacy code tends have some sort of layers separation, even if coupled with other components) try to create mocks for a whole layer of the application (I ended up with a complete mock of a DB, for example). This will help you in the long run to isolate troublesome modules.

### Have a team commitment

If you're working on your own or with a team, make it mandatory to run the tests for each commit. Even better if you can implement a continuous integration server.

