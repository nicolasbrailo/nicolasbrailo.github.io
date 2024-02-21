# Some new set operations in C++11 stl

@meta publishDatetime 2016-02-16T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/02/some-new-set-operations-in-c11-stl.html

The std header has a few cool additions that make life easier in C++11:

```c++
void f() {
  vector<int> v = {1, 2, 3, 4, 5, 60, 70, 80, 90};

  auto less_than_10 = [](int x){ return x < 10; };
  if (all_of(v.begin(), v.end(), less_than_10)) {
    cout << "Yay!";
  }
}
```

Besides all\_of, in you can also find any\_of and none\_of.

Bonus: do you find that initializer list hideous? Just use std::iota, from stl too:

```c++
vector<int> v(100, 0);
iota(v.begin(), v.end(), 0);
```


# Comments

## In reply to this post, [pauljurczak](md_blog/youfoundadeadlink.md) commented @ 2016-02-18T05:27:58.000+01:00:

Inequality symbols are rendered as < and > in your post. I checked with Chrome and Explorer.

Original [published here](md_blog/2016/0216_SomenewsetoperationsinC11stl.md).

---
## In reply to this post, [pauljurczak](md_blog/youfoundadeadlink.md) commented @ 2016-02-18T05:28:56.000+01:00:

I meant as & l t ; (without spaces) etc.

Original [published here](md_blog/2016/0216_SomenewsetoperationsinC11stl.md).

---
## In reply to this post, [nico](md_blog/aboutme.md) commented @ 2016-02-18T05:48:49.000+01:00:

Well, it's quite ironic that your coment was more successful than my post. Thanks for the heads up, I'll try to fix it as soon as I get a chance!

Original [published here](md_blog/2016/0216_SomenewsetoperationsinC11stl.md).
