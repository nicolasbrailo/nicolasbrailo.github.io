# I hate Berkeley

@meta publishDatetime 2010-03-25T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/03/i-hate-berkeley.html

Polymorphism taken to 11:

|  |  |
| --- | --- |
| **SQL Term** | **Oracle Berkeley DB Equivalent** |
| Database | Environment |
| Table | Database |
| Tuple/row | Key/data pair |
| Secondary index | Secondary database |

WTF ORACLE, WTF.


---
## In reply to [this post](), [Gregory Burd](http://oracle.com/) commented @ 2010-03-25T15:40:48.000+01:00:

Hey Nicolás,

Sometimes we say the same thing about those names internally. :) WTF?! Well, first off the names were set in stone back in the early 1990s when Sleepycat was just formed, long long before we were acquired by Oracle. You have to look at how the product grew in complexity and scope over the years to fully understand the naming. We've talked a few times about fixing this, changing the API in drastic ways to make it more terminology-friendly. We didn't because we were trying not to break existing applications. So, here we are with somewhat odd naming and we admit that. :)

How'd you get my cartoon picture?!

cheers,

-greg
Product Manager, Oracle Berkeley DB

Original [published here](/blog_md/2010/0325_IhateBerkeley.md).

---
## In reply to [this post](), [nico](/blog_md/youfoundadeadlink.md) commented @ 2010-03-25T16:21:00.000+01:00:

Hi Greg!

As a maintainer of legacy applications I agree, changing the API now would be a nightmare, and it's understandable that those names may have made sense when they were chosen. It's a little bit weird but I guess we can live with that.

I have been working a little bit with Berkeley DB for a new project and there are some more posts on the queue about things I found odd during my first tests with it, like having a DB and a Db datatype or the usage of sizeof operator in the manual. Hope you like those posts too (I may borrow your cartoon picture again, some people say it does look a lot like me)

Original [published here](/blog_md/2010/0325_IhateBerkeley.md).

---
## In reply to [this post](), [Gregory Burd](http://oracle.com/) commented @ 2010-03-29T18:26:21.000+02:00:

Nico,

Do you really hate "Berkeley" or just the ANSI C programming language? :)

"DB" is a type name for a struct and part of our ANSI C API while the "Db" is it's counterpart in C++. "Db" is a C++ Class name. You'll choose one or the other depending on the language you use. DB if you're programming in C, Db if you're programming in C++. Make sense?

The use of the ANSI C sizeof operator works perfectly in our manual, as you discovered, but I'll agree that it is hard to parse at first. You have to understand that sizeof is an operator and the precedence of it verses other C operators to fully get how that single line of code works. It's a bit obtuse and we are considering making the example code less complex in the next release.

I hope that helps.

-greg

Original [published here](/blog_md/2010/0325_IhateBerkeley.md).

---
## In reply to [this post](), [nico](/blog_md/youfoundadeadlink.md) commented @ 2010-03-29T18:59:07.000+02:00:

> “DB” is a type name for a struct and part of our ANSI C

> API while the “Db” is it’s counterpart in C++. “Db” is a C++

> Class name. You’ll choose one or the other depending on

> the language you use. DB if you’re programming in C, Db

> if you’re programming in C++. Make sense?

Sorry, it does not. Not using a namespace is by itself a bad thing but having two similar things which differ only by the capitalization of their name is error prone and leads to strange error messages, not to mention that it's one of the things
that you get told not to do in any first programming class.

You can live with it; it is a poor programming practice regardless.

> The use of the ANSI C sizeof operator works perfectly in our manual,
> as you discovered, but I’ll agree that it is hard to parse at first.

Again, I disagree: it's plain wrong to justify it saying it works that way when a much clear option (using parenthesis) exists, without any downside.

I can write C++ programs using only a big main. It works but it's wrong. I can use a sizeof operator to obfuscate my code, but I'd leave that for IOCCC, not for a public api manual.

> I hope that helps.

I find Berkeley to be a good product for what it was designed, but it has to many programming bad practices which force you to work with its manual right by your side, until you can hide it under an abstraction layer, and that's what I hate about Berkely.

Original [published here](/blog_md/2010/0325_IhateBerkeley.md).
