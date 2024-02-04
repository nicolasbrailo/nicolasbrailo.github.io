# Cool C++0X features XV: Initializer lists for custom (non-std) objects

@meta publishDatetime 2011-10-18T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/10/cool-c0x-features-xv-initializer-lists.html

Last time we saw how you can use C style array-initialization for C++ objects, like this:

```c++
	std::vector<int> v = {1,2,3,4};
```

We also saw this works for may types of objects, like maps and pairs. How about custom developed objects? Yes, that's right, you can have initilizer lists for your own objects too, and it's quite easy. C++0x offers initializer\_lists which you can use on your constructors (or any other methods, for that mater) to have C-style initialization. Let's see an example. We already know how to sum a list of numbers using template lists and variadic templates, so let's try adding an initializer consisting of numbers:

Let's start by creating a class which can accept an initializer list:

```c++
#include <initializer_list>
using namespace std;

struct Add_List {
	Add_List(initializer_list<int> lst) {
	}
};

int main() {
	Add_List x = {1, 2, 3};
	return 0;
}
```

That's interesting, as you can see an initializer list is actualy a template class, meaning that nested initializers can easily be defined too. Now, we have the interface, how can we access each element of the list? Let's do the same thing I did when I found out about initilizers, let's search for the header file.

```c++
  template<class _E>
    class initializer_list
    {
    public:
      typedef _E 		value_type;
      typedef const _E& 	reference;
      typedef const _E& 	const_reference;
      typedef size_t 		size_type;
      typedef const _E* 	iterator;
      typedef const _E* 	const_iterator;

    private:
      iterator			_M_array;
      size_type			_M_len;

      // The compiler can call a private constructor.
      initializer_list(const_iterator __a, size_type __l)
      : _M_array(__a), _M_len(__l) { }

    public:
      initializer_list() : _M_array(NULL), _M_len(0) { }

      // Number of elements.
      size_type
      size() const { return _M_len; }

      // First element.
      const_iterator
      begin() const { return _M_array; }

      // One past the last element.
      const_iterator
      end() const { return begin() + size(); }
  };
```

Looks surprisingly easy (note that this is for G++ 4.something only). And it is, most of the magic happens in the compiler, so the userland code is quite straight forward. According to that header file, we could build something like this:

```c++
#include <iostream>
#include <initializer_list>
using namespace std;

struct Add_List {
	Add_List(initializer_list<int> lst) {
		int sum = 0;
		for (auto i = lst.begin(); i != lst.end(); ++i)
			sum += *i;

		cout << sum << "n";
	}
};

int main() {
	Add_List x = {1, 2, 3};
	return 0;
}
```

As you can see, the initializer lists can be used in any place an iterable container is required, as long as it's const. There's not much more magic to it, but we can use some more C++0x devices to make our list-adding device much more cool, for example to support different actions and not only addition. Next time, though.

PS: An important lesson from this article: don't be afraid to look into the system headers, they won't bite. You should never ever change them, but taking a peek can only improve your C++ knowledge.

