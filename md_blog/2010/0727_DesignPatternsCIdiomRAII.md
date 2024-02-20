# Design Patterns: C++ Idiom RAII

@meta publishDatetime 2010-07-27T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/07/design-patterns-c-idiom-raii.html

Ohh design patterns. I love buzzwords. Who doesn't? To increase my buzzword count I will be writing about a topic most people programming C++ should already know: RAII, resource acquisition is initialization.

### Patterns everywhere

Knowing that Gamma et al didn't list all the known patterns in the universe does come as a surprise to some, not sure why though. The twenty some patterns they write about in their now famous book are (arguably, perhaps) some of the most common design patterns, but the list hardly finishes there.

Some patterns only have meaning in a very specific context; a reactor is a nice pattern for handling asynchronous events yet most applications would never need it. Sometimes "the context" means a specific domain in which the application must work, like a web application, a real time application or a distributed application, sometimes the context is the language itself. RAII falls in this last domain, it only makes sense for C++ applications (actually there are others, but thinking what kind of languages would support this idiom is left as an exercise for the reader).

### No, really. What is RAII?

If you made it past that long intro you are probably really interested in knowing what RAII is, and don't know how to search it in Wikipedia. OK, I'll explain it the best I can then: RAII means that a resource acquisition is the initialization.

Seriously. That is all the secret there is to RAII. Talking in code:

```c++
template
class RAII_Wrapper {
   T *resource;

   public:
      RAII_Wrapper (T *resource)
            : resource(resource)
      {
         resource-&gt;open();
      }

      ~RAII_Wrapper ()
      {
         resource-&gt;close();
      }
};
```

### An example

Compare that to a visitor pattern. It's just too simple to be of any use, isn't it? Well, contrary to what Java fanboys tend to believe you can do lots of nice things without writing a bazillion lines of code.

```c++
int foo() {
	Expensive_Resource x;
	x.open();

	try {
		if (not bar()) {
			x.close();
			return -1;
		}
	} catch (...) {
		x.close();
		throw "up";
	}

	int ret;
	try {
		ret = baz();
	}catch(...) {
		// We don&#x27;t care, we&#x27;re closing x anyway
	}

	x.close();
	return ret;
}
```

Wow... a whole lot of code just for calling bar and baz. And as I wrote that without even compiling I'm sure there are too many hidden bugs, lots of code-paths my simple programmer's mind can't even begin to imagine which will cause my Expensive\_Resource to be leaked!

Let's rewrite that using RAII:

```c++
void foo() {
	Expensive_Resource x;
	RAII_Wrapper release(&amp;x);

	if (not bar()) return -1;
	return baz();
}
```

A lot nicer, isn't it? But, what happened to all the try/catch if's and closes there?

### Where's the magic?

The magic of RAII lies in how C++ handles exceptions. When we have a built object ([can an object be in an unbuilt state?](/md_blog/2010/0225_CCompositeobjectsandthrowingconstructors.md)) it means it's constructor has correctly ran. It also means it's destructor will run when it goes out of scope, doesn't mater HOW it goes out of scope.

See how brilant that is? Doesn't matter if a function we're calling throws, or if we need to return before reaching the end of the function: the destructor will be called and thus our Expensive\_Resource will be free!

### Why is this C++ specific?

This is an easy one: think how would you implement this in Java: right, you can't. Not knowing when is your object going to be destroyed means you can't do anything useful in its destructor, therefore RAII is deeply rooted within the memory management in C++ and it's pretty much a language specific pattern (or is it?). But, is that so good?

### Not everything is so great...

You are probably thinking this is the best discovery since ice cream was invented. Well, not so fast, RAII has it's detractors too.

The first problem in RAII, it doesn't have a graceful way of handling resource acquisition failure. If Expensive\_Resource is a database, and it's connection fails, we have [a throwing constructor](/md_blog/2010/0225_CCompositeobjectsandthrowingconstructors.md).

Even if throwing constructors are acceptable, throwing destructors may even be a worst idea: throwing while an exception is already active is a cause for concern (tip: it'll crash your application, doesn't matter how many try/catch blocks you use, due to stack unwinding issues).

And then, even if we don't care about throwing destructors you have the issue of a release failure: how do you notify the user that a release failure has occurred? And what do you do, should it happen?

So, RAII is a great idea indeed, and it has it's uses, but you should be careful when choosing this C++ specific pattern.

