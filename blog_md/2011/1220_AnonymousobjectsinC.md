# Anonymous objects in C++

@meta publishDatetime 2011-12-20T07:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/12/anonymous-objects-in-c.html

There are not many cases in which you can have an anonymous \*anything\* in your code, yet there's an idiom in C++ which lets you use an object with an anonymous type. Like this:

```c++
void foo()
{
   struct {
      int x;
   };
}
```

Why would this be useful, you may ask. That's a valid question. This idiom can be very useful to write callbacks, like this:

```c++
struct Interface {
   void callback() = 0;
};

void bar(Interface &amp;c);

void foo()
{
   struct : public Interface {
      /* ... */
   } x;

   bar(x);
}
```

I am not aware of many other uses for an anonymous type. Even more considering this idiom can now be replaced with a much cleaner lambda. But hey, it looks cool!


# Comments

---
## In reply to [this post](), [Daniel]() commented @ 2019-02-20T23:47:19.000+01:00:

An anonymous object
An anonymous object is essentially a value that has no name.
Because they have no name, there's no way to refer to them beyond the point where they are created. Consequently, they have “expression scope”, meaning they are created, evaluated, and destroyed all within a single expression.
Here's an add() function written using an anonymous object:

```
#include

int add(int x, int y)
{
 return x + y; // an anonymous object is created to hold and return the result of x + y
}

int main()
{
 std::cout << add(5, 3);

return 0;

}
```

Original [published here](/blog_md/2011/1220_AnonymousobjectsinC.md).
