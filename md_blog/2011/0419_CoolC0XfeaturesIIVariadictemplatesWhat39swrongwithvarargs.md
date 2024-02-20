# Cool C++0X features II, Variadic templates: What&#39;s wrong with varargs

@meta publishDatetime 2011-04-19T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/04/cool-c0x-features-ii-variadic-templates.html

[Last time](md_blog/2011/0418_CoolC0XfeaturesIIntro.md) we explained what variadic templates are. We'll see what they can do now. We mentioned that solving the problem of having a type-safe varargs is one of the best ways of applying variadic templates, but what's varargs?

Varargs functions (from C world, not even from C++!) are functions which have a variable number of arguments, just like printf. These are usually very dangerous functions, since they are not typesafe. Let's see how they are implemented with an example:

```c++
#include <stdarg.h>
#include <iostream>

// My god, it's full of bugs
void va_println(int args_left, ...) {
   va_list arg_lst;
   va_start(arg_lst, args_left);

   while(args_left--) {
      const char *p = va_arg(arg_lst, const char*);
      std::cout << p;
   }

   va_end(arg_lst);
}

int main() {
   va_println(3, "Hola ", "mundo", "n");
   return 0;
}

```

This implementation of a function with variable arguments is, more or less, the best C can give us, yet it riddled with bugs and hidden problems. Let's go one by one:

* **Arg num will get out of sync**: You need to specify the list of args as well as how many you have. That WILL get out of sync. Trust me, it's just a mater of time. And when it does, you'll have a coredump.
* **Type-unsafe**: You just tell varargs "Hey, get me an int". And it will give you an int, no warranties included. If it was supposed to be a short instead, though luck, you end up with a coredump.
* **No, really, coredump**: Where are so many coredumps coming from, you may ask. Easy, varargs it's just a way of handling the stack. Calling va\_arg just moves the stack pointer by the sizeof the datatype you requested. That means no compile-time checks are included.
* **No pod types**: Remember POD types? Try running this code:

```c++
#include <stdarg.h>

struct X { virtual ~X(){} };

void va_println(int args_left, ...) {
   va_list arg_lst;
   va_start(arg_lst, args_left);

   while(args_left--) {
      X *p = va_arg(arg_lst, X*);
   }

   va_end(arg_lst);
}

int main() {
   X x, y, z;
   va_println(3, x, y, z);
   return 0;
}

```

### And how do we fix it?

The fix is easy. Too easy. You just need C++0X. We will discuss why this is better next time, but just as a sneak peak:

```c++
void println() {}
template <typename H, typename... T> void println(H p, T... t) {
   std::cout << p;
   println(t...);
}

int main() {
   println("Hola", " mundo ", 42, 'n');
   return 0;
}

```

Remember to compile using -std=c++0x in gcc.

**(Thanks Hugo Arregui for correcting the POD example)**

# Comments

---
## In reply to [this post](), [Matthew Fioravante]() commented @ 2015-09-03T22:38:03.000+02:00:

"Type-unsafe: You just tell varargs “Hey, get me an int”. And it will give you an int, no warranties included. If it was supposed to be a short instead, though luck, you end up with a coredump."

While the concept is true in general, your exact example is not exactly right. Variadic functions perform integral promotion on all of the arguments. So if you pass a short you have to read it back out using va\_arg(vl, int).

If however you pass a short and then do va\_arg(vl, short), you could be triggering undefined behavior.. Similarly with char and the unsigned variants which all get promoted to int.

More reasons not to use variadic functions...

Original [published here](md_blog/2011/0419_CoolC0XfeaturesIIVariadictemplatesWhat39swrongwithvarargs.md).
