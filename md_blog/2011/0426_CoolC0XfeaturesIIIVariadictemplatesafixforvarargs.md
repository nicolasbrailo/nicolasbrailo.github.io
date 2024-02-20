# Cool C++0X features III: Variadic templates, a fix for varargs

@meta publishDatetime 2011-04-26T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/04/cool-c0x-features-iii-variadic.html

[Last time](md_blog/2011/0419_CoolC0XfeaturesIIVariadictemplatesWhat39swrongwithvarargs.md) we saw why a function with varargs may bring lots of problems. Then we saw how to solve it, but never explained why that last solution doesn't have the problems the varargs solution had, nor how does it work. Let's start by copying the solution here:

```c++
// Stop condition
void println() {}

// General case
template <typename H, typename... T>
void println(H p, T... t)
{
   std::cout << p;
   println(t...);
}

int main() {
   println("Hola", " mundo ", 42, 'n';);
   return 0;
}

```

It certainly looks much better than the varargs function, even though some new strange syntax has been introduced. Keep in mind some [template-foo](md_blog/youfoundadeadlink.md) is required, not only because of the syntax but because we'll be talking about functional programming too.

With all that intro (the last 2 articles were just an intro!) now we are in a good shape to ask what a variadic template really is. In its easiest form, it's just a list of template arguments, like this:

```c++
template <typename... T> void foo(T... t) {}
```

That simple template can accept as many parameters as you need, of any type. This is much safer than a vararg because:

* Doesn't require the user to specify the number of args passed to foo, so it just can't get out of sync
* It's typesafe; since C++ templates are type-safe, variadic templates are type safe too. You won't be able to request an int where a char is required, you'll just get a compiler error.
* Compile time check: you get type safety just because this is all compiled code. If it doesn't compile, you get an error (albeit a little cryptic).
* [POD types](md_blog/2010/0407_PODtypesinC.md) support
* Better performance; small gain, but a gain indeed. Since this is all done in compile time there's no need to handle the stack dynamically, nor of having a loop getting the args. It's all known when you compile, thus the compiler can just optimize the hell out of everything

Pretty neat, huh? But how does it work? Variadic templates are actually very similar to how Haskell handles lists, you get all the arguments as a list of types in which you can either get the head or the tail. To do something useful, get the head and continue processing the tail recursively.

```c++
template <typename H, typename... T>
void do_something(H h, T... t)
{
	// Do something useful with h
	really_do_something(h);
	// Continue processing the tail
	do_something(t...);
}

```

Of course, you'll eventually need a condition to stop processing: (we'll explain the new syntax later)

```c++
void do_something()
{
	// Do nothing :)
}

```

When the list is completely processed the empty do\_something function will be called. Easy, right? But it does have a lot of weird syntax. Let's see what each of those ellipses mean:

* When declaring typename... T you are saying "here goes a list of types". That is, when you use ellipses after the typename (or class) declaration but before the name of the type, then you are expecting a list of types there.
* When declaring T... t you are saying t is a list of objects with different type. That is, you declared T... as a type which holds a list of types, therefore t, of type T, is an instance of a list of objects, each of different type
* When you write t..., you are saying "expand the list of arguments". You declared t as a list of objects, but you have no way of accessing each of those objects, just to the list as a whole. When you write the name of the object followed by ellipses, you are saying expand these types and their instance for the called function

With all that in mind, let's put together our typesafe printf:

```c++
// Condition to stop processing
void println() {}

// Println receives a list of arguments. We don't know it's type nor
// how many there are, so we just get the head and expand the rest
template <typename H, typename... T>
void println(H p, T... t)
{
	// Do something useful with the head
	std::cout << p;
	// Expand the rest (pass it recursively to println)
	println(t...);
}

int main() {
	// See how it works even better than varargs?
   println("Hola", " mundo ", 42, 'n');
   return 0;
}

```

Next time, we'll see a more complex (and fun) example of variadic templates.

