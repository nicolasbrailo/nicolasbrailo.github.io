# More preprocessor wizardy: strings

@meta publishDatetime 2009-08-25T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/08/more-preprocessor-wizardy-strings.html

No preprocesor wizard should go out of his house without the always useful string maker. Let's say you're trying to create a class with some sort of pseudo type-system (\*):

```c++
class FooBar {
   public:
   const char* get_name(){ return "FooBar"; }
};
```

Why would you type ALL that when you can make a simple macro, MK\_CLASS, like this:

```c++
MK_CLASS( FooBar )
   /* Other methods */
};
```

Problem is, this will only print "Name":

```c++
#define MK_CLASS( Name )
      class Name { public:
            const char *get_name(){ return "Name"; }
```

Well, it's an easy fix, just prepend # to your string, like this:

```c++
#define MK_CLASS( Name )
      class Name { public:
            const char *get_name(){ return #Name; }
```

Or use this nice string maker:

```c++
#define MK_STR(str) #str
```

As usual, use the preprocesor at your own risk.

(\*) Yeah, I know, OO purists will try to beat me to death for this, but it actually has some uses. I've found it to be a specially good solution when working with low level protocols.

