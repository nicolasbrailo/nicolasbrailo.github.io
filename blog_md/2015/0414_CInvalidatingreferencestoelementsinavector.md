# C++: Invalidating references to elements in a vector

@meta publishDatetime 2015-04-14T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/04/c-invalidating-references-to-elements.html

Is this valid C++?

```c++
void do_something(const int&amp;);
#include <vector>

void foo() {
    std::vector<int> v = {1,2,3,4,5};
    const int &num = v.at(1);
    v.push_back(42);
    do_something(num);
}
```

Doesn't seem quite right, does it? push\_back will most likely trigger a resize for the vector, and that will invalidate references to elements in the vector. num will end up pointing anywhere and so using it to call do\_something is not valid C++. Or is it? What happens if we reserve some space for v?

```c++
void do_something(const int&amp;);
#include <vector>

void foo() {
    std::vector<int> v = {1,2,3,4,5};
    v.reserve(40);
    const int &num = v.at(1);
    v.push_back(6);
    do_something(num);
}
```

It again might seem wrong, but this in fact is valid C++ code. Common sense might tell us that a call to push\_back automatically invalidates references to elements in the vector, and it only works because most implementations will do the reasonable thing (ie not to invalidate references unless they must). Turns out the standard makes a special prevision for this case in section 23.3.6.5: a resize for a vector is guaranteed to be triggerd if, and only if, the capacity of the vector is not enough, and references to elements in the vector are guaranteed to be valid unless resize is triggered.

A bit of language laweyering shows that what seems like an error is in fact allowed by the standard, but even if this is valid C++ code you should always keep in mind that assuming that the capacity of a vector will be enough is a VERY big assumption, it's very easy to break and you won't get any warning when it happens (maybe a core dump, if you're lucky).

