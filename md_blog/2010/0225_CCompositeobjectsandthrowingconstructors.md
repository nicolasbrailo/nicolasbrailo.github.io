# C++: Composite objects and throwing constructors

@meta publishDatetime 2010-02-25T10:29:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/02/c-composite-objects-and-throwing.html

Check out the following code:

```c++

struct Foo {
        struct Foobar{ Foobar(){ throw "foobar&#x27;d"; } };
        Foobar baz;

        Foo() try : baz() {
                cout &lt;&lt; "Ctr 1n";
        }catch(...){
                cout &lt;&lt; "Ctr 2n";
        }
};

int main() {
        Foo bar;
        cout &lt;&lt; "End!n";
        return 0;
}

```

Nice, isn't it? Without using a compiler answer the following questions:

* Does it compile?
* If it does, does it abort or does it return 0?
* What does it print?

Did you think about it? Come on, I'll wait... ready? OK, lets go.

First we should think about something else: what the fuck is that thing? I would surely be horrified if I found something like that was lurking in one of my projects' code. It's hideous. And it's called a "Constructor function-try-block" (yes, answering the first question, it does compile and it indeed is valid C++ code).

A constructor function-try-block exists only to catch exceptions thrown while constructing a composite object. This may tempt us to answer the second question: it should return 0, as we're catching Foobar's exception on Foo's ctr. But that's not how these things work , otherwise this would have been a very boring entry: the program aborts.

To understand why does this program abort you should think what does it mean to have a composite object; there is no meaning in having a Foo without a Foobar. baz, of type Foobar is a part of Foo, just like a head is a part of a person and there's no person without a head (though many act as if they didn't have a working head, but that is a topic for another day).

Now, what does it mean to throw (regardless wheter this is a good or a bad practice) in a constructor? It is like saying "There's been a horrible error and I have no idea how to recover. Man, I give up". Throwing in a ctr means there's no point in trying to fully construct that object: it leaves a half-built thing. What can you do with that half object? Nothing, throw it away.

Now that we know what does it mean to throw in a constructor we can answer why does the program abort: there is no point in building a composite object when one of its constituting parts can NOT be constructed, thus it must throw as well.

The last point, why do we have function try blocks if we can't catch exceptions? Well... you can't catch it but you may rethrow a different one, or use the constructor to clean up the mess you would otherwise leave behind. Or you could write a snippet of code, post it on your blog and confuse a whole lot of people (all 3 of them reading this block. Hi grandma).

Oh, we had a third question, but you should be able to answer that one yourself.

PS: You may get a better explanation at [GotW #66: Constructor Failures](http://gotw.ca/gotw/066.htm)


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Design Patterns: C++ Idiom RAII](md_blog/2010/0727_DesignPatternsCIdiomRAII.md) commented @ 2010-07-27T12:05:41.000+02:00:

[...] magic of RAII lies in how C++ handles exceptions. When we have a built object (can an object be in an unbuilt state?) it means it’s constructor has correctly ran. It also means it’s destructor will run [...]

Original [published here](md_blog/2010/0225_CCompositeobjectsandthrowingconstructors.md).

---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Throwing destructors](md_blog/2011/0920_Throwingdestructors.md) commented @ 2011-09-20T10:45:36.000+02:00:

[...] already know what happens when you throw from a constructor. Ending up with a half built object is not good, but suppose we do manage to build one correctly. [...]

Original [published here](md_blog/2010/0225_CCompositeobjectsandthrowingconstructors.md).
