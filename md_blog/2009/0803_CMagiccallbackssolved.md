# C++: Magic callbacks solved

@meta publishDatetime 2009-08-03T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/08/c-magic-callbacks-solved.html

Long post this time - and lots of code too. How fun iz that? Anyway, [remember where we left last time](md_blog/2009/0721_CMagicmembercallbacks.md)? We're supposed to make this work:

```c++
class Callee {
 Callback notify;
 public:
  Callee(Callback notify) : notify(notify) {}
  void finish(){ notify(this); }
};

class Caller {
  Callee c;
  public:
  Caller() : c(Callback(this, &amp;Caller::im_done)) {}
  void im_done(Callee*) { }
};
```

I'll write about the different solutions I've tried and the problem each of these solutions had:

* [Experiment 1: Templates](#experiment1templates)
* [Experiment 2: Template virtual method](#experiment2templatevirtualmethod)
* [Experiment 3: Callback Object](#experiment3callbackobject)
* [Experiment 4: Callback interface](#experiment4callbackinterface)
* [Experiment 5: Callback object bis](#experiment5callbackobjectbis)
* [Solution](#solution)
* [Conclusion](#conclusion)

### Experiment 1: Templates

We could to this the easy way, with a template:

```c++
template &lt;class Callback&gt;
class Callee {
  ...
};

class Caller {
 template &lt;class T&gt;
 void operator() (T p){ this-&gt;im_done(p); }
  ...
};
```

This has some drawbacks:
1. We need to change the definition of the Callee
2. The Caller can only have one callback (or overloaded one callback)
3. It's boring

### Experiment 2: Template virtual method

So, lets try another approach: the naive one is an interface:

```c++
class iCallback {
  public:
  template &lt;class T&gt; void operator () (T o) = 0;
};
```

Looks great, doesn't it? Too bad **it's not valid C++**, you can't have a virtual template method (what would the vtable size be?).
If we can't have a template method let's make a template class:

```c++
template &lt;class T&gt;
class iCallback {
  public:
  virtual void operator () (T o) = 0;
};

class Callee {
 iCallback&lt;Callee*&gt; *notify;
  public:
  Callee(iCallback&lt;Callee*&gt; *notify) : notify(notify) {}
 void finish(){ (*notify)(this); }
};

class Caller : public iCallback&lt;Callee*&gt; {
 Callee c;
  public:
  Caller() : c(this) {}
  void im_done(Callee*) {}
 void operator ()(Callee *o){ im_done(o); }
};
```

It may not be pretty but it works. Also, adding a callback means adding a new operator (). Lets try to improve it a little by removing the nasty inheritance (remember, *always prefer composition over inheritance*):

### Experiment 3: Callback Object

```c++
template &lt;class P&gt;
class iCallback {
 public:
  void operator () (P o) = 0;
};

template &lt;class T, class P&gt;
class Callback : public iCallback&lt;P&gt; {
 // Notice this typedef: we have an object of type T and a
  // function accepting a parameter P
  typedef void (T::*member_func) (P);
  T *cb_obj; member_func f;

 public:
  Callback(T* cb_obj, member_func f)
     : cb_obj(cb_obj), f(f) {}

 inline void operator() (P o){
    (cb_obj-&gt;*f)(o); // -&gt;* is the best voodoo operator
  }
};
```

This new object should help us to:
1. Implement different callback functions (not tied to an operator() nor a type overload) while staying type-safe
2. Delete the inheritance
3. Use the arrow-asterisk operator (!) which is way cool

How would this change leave our code?

```c++
class Caller;
class Callee {
 Callback&lt;Caller, Callee*&gt; *notify;
 public:
  Callee(Callback&lt;Caller, Callee*&gt; *notify) : notify(notify) {}
  void finish(){ (*notify)(this); }
};

class Caller {
 Callback&lt;Caller, Callee*&gt; cb;
  Callee c;
  public:
  Caller() : cb(this, &amp;Caller::im_done), c(&amp;cb){}
  void im_done(Callee*) {}
};
```

Oops, looks like we took one step back: now Callee MUST know the type of Caller. Not nice. Luckily it is an easy fix:

### Experiment 4: Callback interface

```c++
class Callee {
  iCallback&lt;Callee*&gt; *notify;
  public:
  Callee(iCallback&lt;Callee*&gt; *notify) : notify(notify) {}
 void finish(){ (*notify)(this); }
};
```

OK, we're back on track. We will solve that weird looking (\*notify)(this) later, don't worry.

We're almost there, but specifying the callback as  is ugly, Caller should be automagically inferred from the context by some template voodoo. Let's do it by implementing a wrapper:

```c++
template &lt;class R&gt;
class WraperCallback {
  iCallback&lt;R&gt; *cb;
  public:
    template &lt;class T, class F&gt;
    WraperCallback(T* cb_obj, F f)
       : cb( new Callback&lt;T, R&gt;(cb_obj, f) ) {}

    ~WraperCallback() {
      delete cb;
   }

   inline void operator()(R o){
     (*cb)(o);
    }
};
```

Now we no longer need to specify the Caller type. There's still a nasty issue about pointer-vs-object passing. Using (\*notify)(this) is very ugly so let's do it like this:

### Experiment 5: Callback object bis

```c++
class Callee {
  WraperCallback&lt;Callee*&gt; notify;
  public:
  Callee(WraperCallback&lt;Callee*&gt; notify) : notify(notify) {}
 void finish(){ notify(this); }
};

class Caller {
  Callee c;
  public:
  Caller() : c(WraperCallback&lt;Callee*&gt;(this, &amp;Caller::im_done)) {}
 void do_it(){ c.finish(); }
  void im_done(Callee*) { }
};
```

Nice, this time it should work as expected. Only it does not, **there is something horribly wrong about it**. Can you see what it is? Take a second, I'll wait... OK, back? Right, it **segfaults**! Why? Easy, take a look at this:

```c++
  Callee(Callback&lt;Callee*&gt; notify) : notify(notify) {}
```

We are using a copy constructor here, and what does our wrapper store?

```c++
    WraperCallback(T* cb_obj, F f)
       : cb( new Callback&lt;T, R&gt;(cb_obj, f) ) {}
```

Indeed, the copied WrapperCallback ends up pointing to a deleted Callback when the cb field of the original object gets copied and then destructed. We should have all the pieces to fix it now: we just need to implement the copy operator to make it work. How does the final version looks like?

### Solution

```c++
template &lt;class P&gt; class iCallback {
  public:
    virtual void operator()(P) = 0;
    virtual iCallback&lt;P&gt;* clone() const = 0;
};

template &lt;class T, class P&gt;
class RealCallback : public iCallback&lt;P&gt; {
  typedef void (T::*member_func) (P);
  T *cb_obj; member_func f;

 public:
  RealCallback(T* cb_obj, member_func f)
     : cb_obj(cb_obj), f(f) {}

 /**
   * The clone operator is needed for the copy ctr of
   * the Callback object
  */
  inline iCallback&lt;P&gt;* clone() const {
   return new RealCallback&lt;T, P&gt;(cb_obj, f);
  }

 inline void operator() (P o){
    (cb_obj-&gt;*f)(o); // -&gt;* is the best vodoo operator
 }
};

template &lt;class R&gt;
class Callback {
  iCallback&lt;R&gt; *cb;
  public:
    template &lt;class T, class F&gt;
    Callback(T* cb_obj, F f)
       : cb( new RealCallback&lt;T, R&gt;(cb_obj, f) ) {}

    Callback(const Callback&amp; cpy)
        : cb( cpy.cb-&gt;clone()) {}

    ~Callback() {
      delete cb;
   }

   inline void operator()(R o){
     (*cb)(o);
    }
};
```

### Conclusion

Now we have a nice callback object which can link two objects without them knowing each other. There is room for future improvement, of course:
1. Got any ideas to implement a generic callback to a function with an unknown number of params? I don't (variadic templates == cheating!)
2. I'm quite sure the param type for the callback could be inferred in some magical template way, but I don't know how.
3. Think of anything else to add? Let me know in the comments!


---
## In reply to this post, [Nicolás Brailovsky » Blog Archive » Template metaprogramming XI: Hidden Agenda](md_blog/2010/0720_TemplatemetaprogrammingXIHiddenAgenda.md) commented @ 2010-07-20T14:10:19.000+02:00:

[...] for every table; something like this: See the problem? To do something like that we’d need a virtual template method, and you can’t have that. After seeing that I thought to myself “Hey, I’ll use [...]

Original [published here](md_blog/2009/0803_CMagiccallbackssolved.md).

---
## In reply to this post, [Nicolás Brailovsky » Blog Archive » Newsflash: C++ object commits sepuku](md_blog/2011/0404_NewsflashCobjectcommitssepuku.md) commented @ 2011-04-04T09:30:53.000+02:00:

[...] you launch a background job, and you don’t really care when it’s done. You may use a callback to be notified when the job is done, but if you don’t really care then having an object which [...]

Original [published here](md_blog/2009/0803_CMagiccallbackssolved.md).
