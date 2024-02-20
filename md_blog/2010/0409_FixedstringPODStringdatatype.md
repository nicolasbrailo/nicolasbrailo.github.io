# Fixed string: POD String datatype

@meta publishDatetime 2010-04-09T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/04/fixed-string-pod-string-datatype.html

We saw in [POD types in C++](md_blog/2010/0407_PODtypesinC.md) the difference between a POD and a non-POD type but the question of how to apply this knowledge to persist an std::string-like object remained open. This problem is a specific version of how to persist an object from which you know the size but has internal buffers using the heap instead of using only stack memory.

The best example for this case is, perhaps, a column from a table. You know the upper limit of the string's length but using std::string is clearly much better (easier) than a char[N]. Yet you'd be loosing the ability to persist this object in a generic way (i.e. copying memory instead of knowing the object's internal structure).

Well, there's an easy solution (though more than a solution I'd call it an acceptable trade-off) in which you can create a char[N], a char buffer, with std::string-like behaviour and yet POD-safe (almost POD safe actually, as we'll see now).

### What's a POD?

POD datatypes, though informally explained in "[POD types in C++](md_blog/2010/0407_PODtypesinC.md)" have a formal definition which you can look in Google. For practical terms a POD is a trivial object: no custom constructors, no virtual functions, nada of the fun stuff C++ can give you (or a native type, obviously).

Although this definition gives us quite a hard constraint we can create a quasi POD object (!) that does not conform to the standard definition of POD, yet has all the properties of one. This is the kind of struct we'll be creating. It would crash our program if used in a printf, but resides completly on the stack.

### Implementing a POD string

A word of warning: ignore for now the "template " part; that's a template metaprogramming technique which we'll discuss some other day.

```c++
template  &lt;int N&gt; struct FixedString {
   mutable char str[N];
   FixedString() { str[0] = 'X'; }
   FixedString(const char* rid){ memcpy(str, rid, sizeof(str)); }
   FixedString(const FixedString &amp;rid){ memcpy(str, rid.str, sizeof(str)); }
   operator const char*() const { return str; }
};
```

You can see now why I called it a trade-off: it works as we intend it to work but it does have its rough edges (most notably the const char/mutable part). It'll allow you to use a char[N] with some behaviour of an std::string; use it with caution.

