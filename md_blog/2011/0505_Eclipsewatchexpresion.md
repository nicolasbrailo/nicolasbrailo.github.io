# Eclipse watch expresion

@meta publishDatetime 2011-05-05T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/05/eclipse-watch-expresion.html

So, now that I'm working for the dark side: did you know Eclipse had watch expressions which shows a variable's value on real time? I bet you did, gdb has that too. Did you know a watch expression can evaluate a method call too? Neat, huh? Well, gdb has that too.

Anyway, someone on the team was having weird issues. A switch would jump to unexpected places. The state of an object would change between method calls. WTF?

After some debugging then it downed on me: I once (a long time before this strange behavior) saw this person using watch expressions to evaluate a method's return value. You now have enough information to troubleshoot this problem.

Ready? It's easy. A watch expression of a method call has the ability to alter an object's status. So, if you have something like this:

```c++

class Foo {
   int a;
   public:
   Foo() : a(0) {}
   void sumar(){ a++; }
};

int main() {
   Foo bar;
   /* do something */
   return 42;
}

```

and then add a watch expression over bar.sumar(), then bar.a's value will be undefined for the execution of this program. Nice!

