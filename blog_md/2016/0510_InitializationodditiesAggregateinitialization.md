# Initialization oddities: Aggregate initialization

@meta publishDatetime 2016-05-10T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/05/initialization-oddities-aggregate.html

Do you know the quickest way to create a constructor that initializes the elements in this struct?

```c++
#include &lt;string&gt;
struct MyStruct {
    int x;
    std::string y;
    const char *z;
};
```

If you answered "by typing really fast", you may be interested in knowing that the fastest way to create this constructor is to not write it at all!

```c++
MyStruct a = {42, "Hello", "World"};
```

Yes, the line above works and it's perfectly legal C++. It's event C++ 98! This language feature is called aggregate initialization and it says the compiler should be smart enough to initialize MyStruct using each value successively. Of course C++11 has made this syntax somewhat simpler and a lot more uniform:

```c++
MyStruct a{42, "Hello", "World"};
```

There are some caveats when using this initialization, namely that the initialized type must be an aggregate. An aggregate, in standard lingo, is a type that has some restrictions. No virtuals, no privates, etc. You can say it's a POD and in most cases you'd be right.

Now, is this also legal?

```c++
MyStruct a = {42, "Hello"};
```

You'd be tempted to say that's a syntax error. It's not, now z will just be default-initialized. What about this, then?

```c++
MyStruct a = {42, "Hello", "World", "Extra!"};
```

According to the standard, that's an error. Or... is it? Let's try out this example:

```c++
struct A {
    int x;
};

struct B {
    A a;
    std::string y;
};

struct C {
    B b;
    const char *z;
};

C o = {42, "Hello", "World"};
```

Yes. Believe it or not, the object o will now contain three members: o.b.a.x, o.b.y and o.z. All three will be properly initialized with their respective value.

Aggregate initializations should, according to the standard, be smart enough to initialize aggregate objects and use any "spill over" to continue initializing other values/aggregate objects recursively.

### Bonus I:

Aggregate initialization is also what makes this idiom valid:

```c++
char x[] = {1, 2, 3}
```

In this case, x will be of length 3 because that's the length of its aggregate initializer.

### Bonus II:

I'm sure anyone trying to get up to date with C++11 will have played around with variadic templates. One of the first exercises I'd recommend for this would be a compile-time list of different types. Knowing about aggregate initializations now, how would you write a constructor for this type?

```c++
template &lt;typename H, typename... T&gt;
struct Multilist&lt;H, T...&gt; {
    H x;
    Multilist&lt;T...&gt; next;
};

Multilist&lt;int, string, float&gt; foo{42, "XXX", 1.23};
```

