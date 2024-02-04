# Newsflash: C++ object commits sepuku

@meta publishDatetime 2011-04-04T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/04/newsflash-c-object-commits-sepuku.html

Check this out. Is it valid C++?

```c++
class X {
  void dispose() {
    delete this;
  }
};
```

Strange pattern, isn't it?. What happens if you try to dispose a heap object?

```c++
void f() {
   X x;
   x.dispose();
}
```

Indeed, nasal demons FTW, you're trying to free an invalid pointer. Yet if we change that a little bit...

```c++
void f() {
   (new X)-&gt;dispose();
}
```

Zomg now it works. It's weird, but it works. Why would anybody on earth do something like this? Can you guess when would this be useful?

Some times you launch a background job, and you don't really care when it's done. You may use a [callback](/blog_md/2009/0803_CMagiccallbackssolved.md) to be notified when the job is done, but if you don't really care then having an object which deletes itself is an option. You'll have to be very careful about it, though, because this is legal C++ too:

```c++
class X {
  void dispose() {
    delete this;
    std::cout &lt;&lt; "Hello worldn";
  }
};
```

Though "Hello world" will be printed, it will be running in a dead object. Which is fine, as far as the compiler cares, but if you do try to reference the this pointer, you'll be in a lot of trouble.

**Bonus reading**
For a much more interesting note than mine, go and check [When does an object become available for garbage collection?](http://blogs.msdn.com/b/oldnewthing/archive/2010/08/10/10048149.aspx) in The Old New Thing.


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Living on a null object](/blog_md/2011/0816_Livingonanullobject.md) commented @ 2011-08-16T09:05:04.000+02:00:

[...] Now, in this new “translated” code, what do you think? Will it crash? It won’t, since no one is going to dereference “this”. Crazy, huh? This crazy idiom also allows even crazier things, like C++ objects committing sepuku [...]

Original [published here](/blog_md/2011/0404_NewsflashCobjectcommitssepuku.md).
