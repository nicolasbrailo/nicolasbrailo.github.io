# A C++ template device to obtain an underlying type

@meta publishDatetime 2013-10-15T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/a-c-template-device-to-obtain.html

What happens when you need to get the underlying data type of a pointer or reference? You can write some crazy metaprogram to do it for you. Like this:

```c++
template <typename T> struct get_real_type      { typedef T type; };
template <typename T> struct get_real_type<T*>  { typedef T type; };
template <typename T> struct get_real_type<T&amp;>  { typedef T type; };

template <class T>
int foo() {
    return get_real_type<T>::type::N;
}

struct Bar {
    static const int N=24;
};

#include <iostream>
using namespace std;
int main() {
    cout << foo<Bar*>() << endl;
    cout << foo<Bar&amp;>() << endl;
    cout << foo<Bar>() << endl;
}
```

Incidentally, this is also the basis for the implementation of std::remove\_reference. Actually you'd be better of using std::remove\_reference, for your own sanity.

