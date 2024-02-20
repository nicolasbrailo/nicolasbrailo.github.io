# Know where your objects live

@meta publishDatetime 2010-09-27T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/09/know-where-your-objects-live.html

If you work in an environment where memory management is part of your responsibility then you should be aware of the corner cases in which memory management may come and bite you in the ass. Object ownership is one of those areas.

If you are going to take ownership of an object you need to be very explicit about it. A common (and mostly wrong) pattern is taking ownership of an object, by default. Things work great until you end up with a production coredump after trying to free an invalid pointer.

```c++
Foo f1;
Foo *f2 = new Foo;

class BadList {
  Foo *f1, *f2;
  BadList(Foo *f1, Foo *f2) :f1(f1), f2(f2) {}
  ~BadList(){ delete f1; delete f2; }
}
```

Seen like that it's more than obvious, but I have seen even experieced programmers fall in this caveat.

**Related reading:** [Oh shit the stack](/md_blog/2010/0601_Ohshitthestack.md).

