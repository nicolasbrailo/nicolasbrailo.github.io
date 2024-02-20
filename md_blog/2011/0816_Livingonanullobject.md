# Living on a null object

@meta publishDatetime 2011-08-16T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/08/living-on-null-object.html

Check this out:

```c++
struct S {
   int f(){ return 42; }
};

int main() {
   S *x = (S*) NULL;
   return x->f();
}
```

What does this do? Does it compile? Does it crash? I'll give you a second.

Ready? It does compile, OK

But it doesn't crash.

Why, you may ask

Think about it, you must.

The compiler will mangle S::f and translate this into something like:

```c++
struct S {};

int mangled_S_f(struct S *this){
   return 42;
}

int main() {
   S *x = (S*) NULL;
   mangled_S_f(x);
}
```

Now, in this new "translated" code, what do you think? Will it crash? It won't, since no one is going to dereference "this". Crazy, huh? This crazy idiom also allows even crazier things, like [C++ objects committing sepuku](/md_blog/2011/0404_NewsflashCobjectcommitssepuku.md)

