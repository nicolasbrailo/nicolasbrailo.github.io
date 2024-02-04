# Final classes in C++

@meta publishDatetime 2011-07-05T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/07/final-classes-in-c.html

Have you ever wondered what's the best way of having a class from which you can't inherit, say, like Java's final? Without any doubt, the best way is having a team capable of not doing things like inheriting from 'class NeverEverEverInheritFromThis'. The second best way involves some magic and lots of beer:

```c++
class Final {
    protected:
    Final() {}
};
```

So, what the hell does that evil device do? Easy, it defines a protected constructor, meaning only derived classes will be able to access it (i.e. no public construction of this object). How does this stop other classes from inheriting? It doesn't, unless we add one more keyword:

```c++
class Final {
    protected:
    Final() {}
};

class X : virtual Final {
};
```

The virtual inheritance is meant to be used to avoid the dreaded diamond in multiple inheritance designs. It does a lot of magic with the constructors and the memory layout of the object; amongst other things, it'll make any class which derives from X have only a single base class for Final and it'll also make this hypothetical class call Final's constructor without going through X first.

A complete explanation of virtual inheritance is beyond the scope of this article, but it's enough for our Final device to know that it forces the virtual base's constructors to be called first, thus now we can write this:

```c++
class Final {
    protected:
    Final() {}
};

class X : virtual Final {
};

class Y : public X {
};

int main() {
    X x;
    Y y;
    return 0;
}
```

Try it and watch it fail!

**Update 2011-07-08:** Amazing how time flies. This article has been written about a year before its publishing, and, believe it or not, it's already showing its age. What I would update on this article is the first paragraph: the best way of not having a problem with final classes is creating a design which doesn't have artificial restrictions to the growth and extensibility of the system (i.e: don't use final classes, they are usually a bad idea). I like that idea, I may write another article about it.

