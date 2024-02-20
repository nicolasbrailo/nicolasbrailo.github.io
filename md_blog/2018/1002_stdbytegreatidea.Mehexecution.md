# std::byte - great idea. Meh execution?

@meta publishDatetime 2018-10-02T13:54:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2018/10/stdbyte-great-idea-meh-execution.html

I love the idea of C++17's [std::byte](https://en.cppreference.com/w/cpp/types/byte). A data-type that makes it explicit we're dealing with ugly low-level details? What's there not to love! One thing only, turns out.

First, the good part: separating character (human) representation from binary (low-level) representation is brilliant. No implicit conversion between the two separates the domains very well and creates a much clearer interface.

The bad part: std::byte is really really strict. It only accepts other std::bytes as operands(\*). You'd hope this would work

```c++
auto f() {
  byte b{42};
  return b &amp; 0b11;
}
```

It doesn't. std::byte only accepts other std::byte's as operands. The design goal behind it is good, sure. In practice, I've noticed this means casts are not limited to the interface between low-level and rest-of-the-world: casts and explicit byte's get sprinkled all over the place.

My prediction: most people will dislike the boilerplate std::byte adds and fall back to unsinged char's, until the type restrictions in std::byte are relaxed. I hope I'm wrong though!

(\*) Yes, with the exception of shift operations. That was a good design decision!

