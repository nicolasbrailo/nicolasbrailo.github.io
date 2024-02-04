# Extending the life of a temp variable in C++

@meta publishDatetime 2014-01-07T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2014/01/extending-life-of-temp-variable-in-c.html

Take a look at this code: what does it do?

```c++
struct X {
    X() { cout &lt;&lt; "X"; }
    ~X() { cout &lt;&lt; "~X"; }
};

void foo() {
    X x;
}
```

It's not hard to see this code will print "X", then "~X" immediately after it: X() is created as a temporary variable which gets constructed and then immediately destructed. Any side effects this object may have should happen in the constructor or the destructor.

Now that we know a bit more about the lifetime of temp objects, is this valid C++?

```c++
struct X {
    int y;
    X(int y) : y(y) {}
};

int foo() {
    const X &amp;ref = X(42);
    return ref.y;
}
```

It looks a bit strange: ref is a reference to a temporary object. Temporary objects get destroyed as soon as they are created, so ref.y should be an undefined data access. Right? Not quite, the C++ standard has a special consideration for const references using a temporary object: according to 12.2.3 this is a valid read, as long as ref is a "const X&". Even more interesting, in this case the lifetime of the temporary object "X(42)" gets extended until ref goes out of scope: only when the reference is gone the destructor for X will be run!

