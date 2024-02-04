# C preprocessor III: Token pasting

@meta publishDatetime 2013-09-02T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/09/c-preprocessor-iii-token-pasting.html

A stringify operator is good but the token pasting operator goes off the awesomeness chart (if you're working on an ioccc entry, that is). Actually, what token pasting does is conceptually simple: it will paste together two tokens to form a new one. So, for example, PASTE(foo, bar) would result in the "foobar" token. Looks simple enough, doesn't it? The token pasting operator is invoked via '##'. For example:

```c++
#define PASTE(x, y) x ## y
#define FOOBAR 42
int main() { return PASTE(FOO, BAR); }
```

The previous code would just return 42. So what's the usefulness of a paste operator? Other than obfuscating stuff, you can use it to create classes with similar interfaces but different method names (I'm not saying it's a good idea, I'm saying you can). For example:

```c++
#define MAKE_GET_SET(x, T) \
               void set_ ## x (T o) { this->x = o; } \
               T get_ ## x () { return this->x; }
class Foo {
  MAKE_GET_SET(foo, int);
```

The token pasting operator doesn't have the limitation of being applicable only to a macro parameter, so code like "12 ## 34" is a perfectly valid operation which results in "1234". It does have a catch: if the resulting token is not valid the behavior is undefined. This means that, for example, pasting "12" and "foo" together produces "12foo", which is not a valid token. Being the operation undefined means that a compiler might reject this operation (I'm pretty sure gcc does) or that it might do a completely different thing (it could choose to ignore the token pasting operator and it would still be standard compliant).

Nasal demons FTW!

