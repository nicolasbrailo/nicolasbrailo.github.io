# I hate Berkeley

@meta publishDatetime 2010-03-25T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/03/i-hate-berkeley.html

Polymorphism taken to 11:

```
|  |  |
| --- | --- |
| **SQL Term** | **Oracle Berkeley DB Equivalent** |
| Database | Environment |
| Table | Database |
| Tuple/row | Key/data pair |
| Secondary index | Secondary database |
```

WTF ORACLE, WTF.


---
## In reply to this post, [Gregory Burd](http://oracle.com/) commented @ 2010-03-25T15:40:48.000+01:00:

Hey Nicolás,

Sometimes we say the same thing about those names internally. :) WTF?! Well, first off the names were set in stone back in the early 1990s when Sleepycat was just formed, long long before we were acquired by Oracle. You have to look at how the product grew in complexity and scope over the years to fully understand the naming. We've talked a few times about fixing this, changing the API in drastic ways to make it more terminology-friendly. We didn't because we were trying not to break existing applications. So, here we are with somewhat odd naming and we admit that. :)

How'd you get my cartoon picture?!

cheers,

-greg
Product Manager, Oracle Berkeley DB

Original [published here](md_blog/2010/0325_IhateBerkeley.md).

---
## In reply to this post, [nico](md_blog/youfoundadeadlink.md) commented @ 2010-03-25T16:21:00.000+01:00:

Hi Greg!

As a maintainer of legacy applications I agree, changing the API now would be a nightmare, and it's understandable that those names may have made sense when they were chosen. It's a little bit weird but I guess we can live with that.

I have been working a little bit with Berkeley DB for a new project and there are some more posts on the queue about things I found odd during my first tests with it, like having a DB and a Db datatype or the usage of sizeof operator in the manual. Hope you like those posts too (I may borrow your cartoon picture again, some people say it does look a lot like me)

Original [published here](md_blog/2010/0325_IhateBerkeley.md).


