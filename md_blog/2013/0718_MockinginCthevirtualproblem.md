# Mocking in C++: the virtual problem

@meta publishDatetime 2013-07-18T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/mocking-in-c-virtual-problem.html

Mocking objects is crucial for a good test suite. If you don't have a way to mock heavy objects you'll end up with slow and unreliable tests that depend on database status to work. On the other hand, C++ mocking tends to be a bit harder than it is on dynamic languages. A frequent problem people find when mocking are virtual methods.

What's the problem with virtual methods? C++ has the policy of "not paying for what you don't use". That means, not using virtual methods is "cheaper" than using them. Classes with no virtual methods don't require a virtual dispatch nor a vtable, which speeds things up. So, for a lot of critical objects people will try to avoid virtual methods.

How is this a problem for mocking? A mock is usually a class which inherits from the real class, as a way to get the proper interface and to be compatible with code that uses the real implementation. If a mock inherits from the real thing you'll need to define all of its methods as virtual, even if you don't need to, just so you can actually implement a mock.

### A possible solution

The problem is clear: we need some methods to behave as virtual, without defining them as virtual.

A solution to this problem, the one I personally choose, is using a TEST\_VIRTUAL macro in the definition of each mockeable method for a class; in release builds I just compile with -DTEST\_VIRTUAL="", and for testing builds I compile with -DTEST\_VIRTUAL="virtual". This method is very simple and works fine but has the (very severe) downside of creating a different release code than the code you test; this might be acceptable, but it's a risk nonetheless.

Other possible solutions I've seen in the past are:

* Making everything virtual, even if not strictly necessary. Quite an ugly solution, in my opinion, it can affect performance and the code is stating that a method can be overridden, even if this don't make sense.
* Using some kind of [CRTP](http://en.wikipedia.org/wiki/Curiously_recurring_template_pattern) for static dispatching: probably one of the cleanest solutions, but I think it adds too much overhead to the definition of each class.
* Don't make the mock inherit from the real implementation, make the user code deduce the correct type (eg by using templates). It's also a clean solution, but you loose a lot of type information (which might or might not be important) and it might also severely impact the build time

To conclude, I don't think there's a perfect solution to the virtual problem. Just choose what looks better and accept we live in an imperfect world.


# Comments

---
## In reply to this post, [Bas]() commented @ 2013-07-18T22:35:08.000+02:00:

std::function to the rescue?

Original [published here](md_blog/2013/0718_MockinginCthevirtualproblem.md).

---
## In reply to this post, [nicolasbrailo](/md_blog) commented @ 2013-07-20T13:28:20.000+02:00:

I don't think I understand how would you use it... how exactly would you use std::func to have an implementation you want to test accept (ie be injected with) a mock of an object with no virtual methods?

Original [published here](md_blog/2013/0718_MockinginCthevirtualproblem.md).

---
## In reply to this post, [Patrick]() commented @ 2013-07-22T21:53:01.000+02:00:

I use the CRTP solution rather extensively in my work. I find that I use it most often when the class performs IO of some form - to the console, via a file or database or network, etc. That pattern not only allows me to test classes that were previously difficult to test, but it also forces me to decompose the classes into two parts - one that performs the computation and one that does the IO. Since the IO code is usually the more complex and error-prone, it helps to keep it all together in one place.

Original [published here](md_blog/2013/0718_MockinginCthevirtualproblem.md).

---
## In reply to this post, [Peter Bindels]() commented @ 2013-07-23T09:57:38.000+02:00:

That's like using virtual everywhere, except worse.

Original [published here](md_blog/2013/0718_MockinginCthevirtualproblem.md).

---
## In reply to this post, [nicolasbrailo](/md_blog) commented @ 2013-07-23T10:09:30.000+02:00:

Thanks for the input Patrick, I've never actually seen this technique used "in the wild". Would you say it adds too much overhead to a simple class declaration? How about bringing up to speed new team members, does it take them a while to get used to it?

Original [published here](md_blog/2013/0718_MockinginCthevirtualproblem.md).

---
## In reply to this post, [Patrick Moran]() commented @ 2013-07-23T16:26:44.000+02:00:

That depends pretty heavily on how much overhead you consider to be "too much". I find that by naming the CRTP something like "TCRTP", I can make it really clear what is going on in the code. Also, if the class without is named Foo, then I put most of Foo's functionality in Foo\_Base, and make Foo inherit from Foo\_Base.

We find this to be completely worth it for us. As an added bonus, it often makes for better integration testing as well. If your Foo class would normally write to a multicast socket, it can be cleaner to use another child of Foo\_Base that writes to a file instead. Then the output can be compared against expected output with a simple diff.

As for bringing new team members up to speed - where I work we worry a lot about latency. So we are all already accustomed to using CRTP for static dispatching. Seeing CRTP for DI is just one more application of a familiar principle. But we might be an atypical workplace.

Original [published here](md_blog/2013/0718_MockinginCthevirtualproblem.md).

---
## In reply to this post, [Todd Greer]() commented @ 2013-08-01T22:58:28.000+02:00:

If you take the TEST\_VIRTUAL approach, you need to also disable copy and move operations. Otherwise you're at risk of getting a mock object copied or moved to a real object. Of course, for the types of classes we're talking about, that's probably already been done.

Separating out the part that depends on external state (as Patrick seems to be suggesting) is also a good idea.

Original [published here](md_blog/2013/0718_MockinginCthevirtualproblem.md).

---
## In reply to this post, [Todd Greer]() commented @ 2013-08-01T23:01:37.000+02:00:

Also remember that this won't work with any methods that are called from ctors and dtors, since they won't be virtually dispatched. With luck, your compiler will warn you if you get that wrong.

Original [published here](md_blog/2013/0718_MockinginCthevirtualproblem.md).
