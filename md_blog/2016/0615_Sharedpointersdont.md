# Shared pointers: don't

@meta publishDatetime 2016-06-15T01:00:00.004+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/06/shared-pointers-dont.html

Ahh, shared pointers! A nice, magical pointer type that will make all of your memory problems go away. Sprinkle some shared\_ptrs here and there and, voilà, Valgrind is now happy. Sounds like a silver bullet, doesn't it? That should be your first clue that something's up with the promise of getting Java-like memory management in your c++ application.

Java and C(++) have a very different concept of memory management. My Java-foo, obviously enough to anyone reading this blog, is not that great, but, from experience, memory management is seen as a chore better left to the bowels of your system, something you don't need (nor want) to care about. Sure, you can tweak and somewhat manage memory allocations if you really want to; the default mindset, however, is to ignore those concerns. The garbage collector will, eventually, find any unused resource and deal with it accordingly.

C++ programs, at least those that have been more or less successfully designed as opposed to organically grown, tend to have a radically different approach. Memory management is an integral part of a program's design and it can't be left to some automagic memory manager. This leads, again, for those more or less successful designs, to programs with a tree-like hierarchy in which a child or dependent object must live at least as long as its parent scope. This hierarchy leads to easier to understand programs. Some idioms (RAII!) depend on this hierarchy. Some tools (like scoped and unique pointers) make its implementation much simpler. I've seen that Rust really builds on this idea (and seems to take it to 11! I'm still trying to figure out if that's a good or a bad thing, but so far I quite like it).

The tree-like structure of the scopes in C++ also implies single ownership (again something Rust seems to be very idiosyncratic about). While you may "use" someone else's objects (for example, via a reference) there is always one single owner. If this owner goes away while someone holds a reference to one of its children... well, you get a bug. But sure enough this bug is clear as long as you can visualize the tree scope structure of your program. Shared pointers completely obliterate this tree.

A shared pointer means an object can have multiple owners. Whoever goes out of scope last needs to clean it. Why is that bad? In my (highly subjective but experience based) opinion:

* It becomes harder to reason about your program. You never know if all the "pieces" you need are in scope. Is an object already initialized? Who is responsible for building it? If you call a method with side effects, will any of the other owners be affected by it?
* It becomes harder to predict whether going out of scope is trivial, or an operation that can take a minute. If you're the last one holding a reference to an object through a shared pointer, you may be stuck running its destructor for a long time. That's not necessarily a bad thing, but not being able to predict it can lead to all sort of obscure bugs.

There are also many ways to avoid shared pointer usage:

* Try restructuring your code. This will usually yield the biggest benefits, you'll end up with a clearer structure and less clutter.
* Try to use scoped pointers from boost or unique pointers if you can. Way too often shared pointers are used when a scoped pointer would be enough.
* Don't be scared of copies! Sometimes you can just copy your object and end up with cleaner (and maybe even faster) code. Are you really sure you need to share state?

Does that mean you should never ever use shared pointers? Of course not. In some cases it's unavoidable. Some algorithms are probably impossible to implement without them (or even impossible without GC). A shared pointer is just one more tool. Just like gotos. And, just like gotos - although not quite as dangerous - they have some appropriate use cases. Just try not to make it your default goto (lol) tool for memory management.

// TODO: There is a very good reason I found to use shared pointers: to create weak\_ptr's. Is there a good solution without actually using shared\_ptr's? I don't know!

