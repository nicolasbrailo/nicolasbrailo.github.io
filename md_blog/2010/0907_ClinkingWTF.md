# C++ linking WTF

@meta publishDatetime 2010-09-07T09:07:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/09/c-linking-wtf.html

It is a commonly accepted fact that a succesfuly compiled application serves as enough proof of its correctness, but common wisdom doesn't say a thing about linking. If you like linker WTF moments, you'll love this snippet. Can you guess why won't it compile?

```c++
struct Foo {
    static const int x = 0;
    static const int y = 1;

    int z(bool x){
        return (x)? Foo::x : Foo::y;
    }
};

int main() {
    Foo z;
    std::cout &lt;&lt; z.z(true);
    return 0;
}

```

Well, it does compile (gotcha!) but it just won't link. Yet it seems so simple... let's add some more mistery to this WTF moment, try this change:

```c++
    int z(bool x){
        int t = Foo::x;
        return (x)? t : Foo::y;
    }

```

Holy shit, now it compiles? WTF? Some more strangeness:

```c++
    int z(bool){
        return (true)? Foo::x : Foo::y;
    }

```

And again, now it compiles. WTF? I'll make a final change, this one should give you a clue about why it won't compile. Revert all changes back to the original code but add this two lines after Foo:

```c++

const int Foo::x;
const int Foo::y;

```

Though weird at first, now you should have a clear picture:
* The first case doesn't compiles: x and y are declared in struct Foo, yet the linker doesn't know in which translation unit they should be allocated.
* The second and third cases... well I'm not sure why does this compiles but it's probably because the linker can asume in which translation unit x and y should be allocated. I'm to lazy to check.
* In the last case we explicitly say where should x and y be. According to standard, this is how these two ints should be declared.

So, some linker strangeness. Beware, it's easy to get trapped by this one.


---
## In reply to [this post](), [Matthew Fioravante]() commented @ 2015-09-03T22:47:03.000+02:00:

"The second and third cases… well I’m not sure why does this compiles but it’s probably because the linker can asume in which translation unit x and y should be allocated. I’m to lazy to check."

The difference probably has to do with the optimizer. If the optimizer reduces all references to the static variable to a compile time constant then there are no references to the non-existant variable for the linker to complain about.

You can see these kinds of linker bugs happen often in debug builds but not in release builds because of different optimization levels.

Original [published here](/md_blog/2010/0907_ClinkingWTF.md).
