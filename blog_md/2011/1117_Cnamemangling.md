# C++ name mangling

@meta publishDatetime 2011-11-17T05:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/11/c-name-mangling.html

There is a topic I have referred to several times on this blog, yet in four years I still haven't explained what it is. I plan to correct this by explaining a little bit about C++ name mangling, and although I won't expect to write anything you couldn't learn by reading [Wikipedia](http://en.wikipedia.org/wiki/Name_mangling), I'll try to have a more practical approach.

Whenever you compile and link something, there is a lot of information the compiler deduces that you don't really care about. Things like calling conventions, overloads or namespaces. Yet this information is crucial for other stages of the compiler (or linker) to work. For this reason, the compiler will create a decorated version of any object's or function's name.

In its most simple case, it would be something like this:

```c++
void overloaded_function(int);
void overloaded_function(string);

```

Which would then be translated to something like:

```c++
void fastcall_int_overloaded_function(int);
void fastcall_string_overloaded_function(string);

```

Of course, for more complex functions (like class methods) the mangling is much more complicated. Also, remember that's just a mangling convention I just invented, and most likely not used by any compiler in existence.

Although for the most part we can just ignore name mangling, this has a couple of consequences of which we should be aware:

### Creating a name for anonymous objects/functions

I will not explain much about this, it might be the topic of another post, but there are certain cases in which you can have a struct or a function defined inside another object anonymously. In these cases, the mangler will assign some sort of denomination for this anonymous object.

### Linking with C symbols

C has no mangling. It just doesn't need it. This has a very important consequence, whenever you use C code in C++ you need to specify that your doing so, by using an extern "C" declaration.

### Debugging

gdb already takes care of this so it may be transparent to you, but if you are using a debugger not aware of how your compiler mangles names, you may end up with a lot of very difficult to understand names.

### Bonus: Demangling C++ names

If you find yourself in the last case, for example when running an nm to get the names defined in a (compiled) object, you can use c++ filt. Like this:

```c++
nm foo.o | c++filt
```

