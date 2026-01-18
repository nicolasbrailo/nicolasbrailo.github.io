# Thunks, correccion de offsets

@meta publishDatetime 2011-08-28T19:38:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl 

```c++
<br/>  1 struct Base0 {                                            |  1 struct Base0 {<br/>  2         int base0;                                        |  2         int base0;<br/>  3 };                                                        |  3 };<br/>  4                                                           |  4<br/>  5 struct Base1_0 : Base0 {                                  |  5 struct Base1_0 {<br/>  6         int base1_0;                                      |  6         struct Base0 parent;<br/>  7 };                                                        |  7         int base1_0;<br/>  8                                                           |  8 };<br/>  9 struct Base1_1 : Base0 {                                  |  9<br/> 10         int base1_1;                                      | 10 struct Base1_1 {<br/> 11 };                                                        | 11         struct Base0 parent;<br/> 12                                                           | 12         int base1_1;<br/> 13 struct Der : Base1_0, Base1_1 {                           | 13 };<br/> 14         int der;                                          | 14<br/> 15 };                                                        | 15 struct Der {<br/> 16                                                           | 16         struct Base1_0 p1;<br/> 17 int main() {                                              | 17         struct Base1_1 p2;<br/> 18         extern Der* getder();                             | 18         int der;<br/> 19                                                           | 19 };<br/> 20         Der *d = getder();                                | 20<br/> 21         Base1_0* b1_0;                                    | 21 int main() {<br/> 22         b1_0 = d;                                         | 22         extern struct Der* getder();<br/> 23                                                           | 23         struct Der *d = getder();<br/> 24         Base1_1* b1_1;                                    | 24         struct Base1_0* b1_0;<br/> 25         b1_1 = d;                                         | 25         b1_0 = &amp;d-&gt;p1;<br/> 26                                                           | 26<br/> 27         return 0;                                         | 27         struct Base1_1* b1_1;<br/> 28 }                                                         | 28         b1_1 = (d != 0)? &amp;d-&gt;p2 : 0;<br/> 29                                                           | 29<br/> 30                                                           | 30         return 0;<br/>~                                                             | 31 }<br/>~                                                             | 32<br/>~                                                             |~<br/>~                                                             |~<br/>~                                                             |~<br/>~                                                             |~<br/>~                                                             |~<br/>~                                                             |~<br/>~                                                             |~<br/>~                                                             |~<br/>~                                                             |~<br/>~                                                             |~<br/>cpp.cpp                                     21,1-8        Todo c.c                                         32,0-1        Todo<br/><br/><br/>
```





# Vectorization in gcc

@meta publishDatetime 2021-03-02T15:54:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl http://monkeywritescode.blogspot.com/p/vectorization-in-gcc.html

[WARNING: DRAFT VERSION, WORK IN PROGRESS]

Intro

What is vectorization? That much shouldn't be difficult to answer: whenever you perform the same operation to all elements of a vector you can either do it one by one, or in chunks. You could do it by splitting the chunks across different processors. You can also tell your processor to process a whole chunk at once (extra points if you noticed that these are orthogonal aspects, you could split your vector in chunks, send it to multiple processors and then tell each processor to work on a chunk of that chunk). If you opt to process by chunks on a single processor, you will then use a special set of instructions (SIMD, single instruction multiple data) that can work on several elements at the same time.

It doesn't seem like a conceptually hard topic to discuss, but looks can be deceptive. Let's toy around with gcc's vectorization capabilities and see what we can learn by telling gcc to vectorize this simple snipet:

```c++

#define SIZE (5)
long sum(int v[SIZE]) throw()
{
	long s = 0;
	for (unsigned i=0; i&lt;SIZE; i++) s += v[i];
    return s;
}

```

As usual, the empty throw is in there so we can get a cleaner assembly output. To compile this I'm using "g++ -S -c foo.cpp -o /dev/stdout | c++filt".

If you run that you will notice there isn't anything vectorized. Good, because vectorization is an optimization, and we didn't tell gcc we wanted to optimize our program. Vectorization is turned on by default on -O3, but that also triggers a bunch of other optimizations we don't want right now. Instead we can use "-O2 -ftree-vectorize". Just as a sanity check, you could compile with -O0 and -O2; for such a simple snippet there shouldn't be any major differences which could make the assembly harder to understand.

Adding the new flags needed to tell gcc to vectorize:

```bash

g++ -O2 -ftree-vectorize -S -c foo.cpp -o /dev/stdout | c++filt

```

Did you run that? Quite disappointing, isn't it? Nothing was vectorized. Why? Let's ask gcc: there's an option called "-ftree-vectorizer-verbose". Let's set it to 7 and see what gcc can tell us about the vectorization pass:

```bash

&gt; g++ -O2 -ftree-vectorize -ftree-vectorizer-verbose=7 -S -c foo.cpp -o /dev/stdout | c++filt
vec.cpp:7: note: Alignment of access forced using peeling.
(... A bunch of stuff we don't care about right now ...)
  Calculated minimum iters for profitability: 11

vec.cpp:7: note:   Profitability threshold = 10

vec.cpp:7: note: not vectorized: vectorization not profitable.
vec.cpp:3: note: vectorized 0 loops in function.

```

That's interesting information: we'll talk about peeling later on, that's important but not right now. What is critical right now is the last message we got for line 7: "vectorization not profitable".

Using SSE is not free, some special registers in the CPU need to be enabled and then some housekeeping needs to be done to keep them working, so they are not available unless you actually request them. If you will "invest" time into setting SSE up, you want to make sure it eventually pays off. And in this case, for a meager 10-iterations loop, it doesn't.

To enable vectorization you could increase the number of iterations. GCC also has an option called min-vect-loop-bound, you could probably fiddle around with this to force the vectorization of our example but it's probably not worth it.

---

Peeking at a vectorized function

If we just compile and check the assembly for the snippet we used before, we'll have a frankenstein full of assembly. Let's slightly alter our snipet with a few magic words for now (we'll see what they mean later on) to get a cleaner assembly, and then we'll start inspecting that.

```c++

#define SIZE (100)

struct Foo { int v[100]; } __attribute__ ((aligned (__BIGGEST_ALIGNMENT__)));
long sum(Foo __restrict__ * v) throw()
{
	long s = 0;
	for (unsigned i=0; i&lt;SIZE; i++) s += v-&gt;v[i];
    return s;
}

```

Unimportant note: \_\_restrict\_\_ is not actually needed here, but until we discuss what that keyword does you should be using it, it will (in most cases) make your assembly much cleaner.

If you compile this with "g++ -O2 -ftree-vectorize -ftree-vectorizer-verbose=7 -S -c" you'll now see a big difference in the analysis gcc gives us:

```

(...)
vec.cpp:8: note: Cost model analysis:
  Vector inside of loop cost: 5
  Vector outside of loop cost: 4
  Scalar iteration cost: 3
  Scalar outside cost: 0
  prologue iterations: 0
  epilogue iterations: 0
  Calculated minimum iters for profitability: 3
vec.cpp:8: note:   Profitability threshold = 3
vec.cpp:8: note: LOOP VECTORIZED.
vec.cpp:5: note: vectorized 1 loops in function.

```

Whatever those magic incantations mean, they seem to improve the vectorization process: now the profitability threshold is much lower. You can probably imagine why already, but since we'll cover that later on for now let's just keep it in the TODO list. For now, just check out the assembly you get. Shouldn't be to hard to interpret once you know that xmm\* are the simd registers, just like R\*X registers but for vector operations. The code itself is quite straightforward, it's the usual algorithm you'd have written in assembly but using special vector operations (all those punpck\*dq ops).

---

C's abstract machine

Remember all those weird things we had to tell the compiler to get gcc to properly vectorize our code? Well, turns out vector operations have a catch: they don't play nicely with unaligned data and aliasing pointers (what does that mean? be patient!).

In a way, C and C++ describe a "virtual machine" that kind of resembles an old single thread mono-processor architecture, and the compiler needs to map instructions in this simple architecture to a much more complex design, a modern architecture full of multi level caches, multiple processors, multiple threads per processor and complex instruction sets like SIMD. To do that, it needs to analyze the code to guarantee certain constrains are met.

An example of how the C virtual machine constraints a program: signed integers aren't supposed to overflow, if they do then that's a (programmer) error and the compiler is free to assume it will never happen. Unsigned integers, on the other hand, are free to overflow as much as needed, they just wrap around. Keeping this in mind and for code like this:

```c++

template &lt;typename T&gt;
bool foo(T x) {
    return (x &gt; x+1);
}

```

It looks really simple, but there's a catch. From a math perspective, foo should always return true. From a C virtual machine perspective, foo should always return true iif x+1 can't overflow. Just try and see what happens if you compile the above code for T=unsigned int and for T=int. A C virtual machine can assume that a signed integer will never overflow (because the standard says so) and thus will just produce code similar to "return true", at least for -O2. Unsigned ints, on the other hand, may wrap around to 0 so the compiler can't assume this: try it out and you'll see that even with optimizations on, there will be some kind of check performed.

Where are we going with this long explanation? Aligned data and aliasing pointers, that's where. Now that you know how C can apply optimizations according to what it can "prove" for the code being analyzed we'll see next time what we need to prove about our code to make it vectorizable.

---

Vectorization constraints: Aliasing pointers

Knowing a little bit more how our C "virtual machine" restricts what we can say about our program, let's talk about pointer aliasing with this example:

```c++

#define SIZE (100)
void test(int v1[SIZE], int v2[SIZE])
{
	for (unsigned i=0; i&lt;SIZE; i++) v1[i] = 2*v2[i];
}

```

If you compile that with something like "g++ -O2 -ftree-vectorize -ftree-vectorizer-verbose=7 -S -c vec.cpp" you'll probably get the following out of the vectorizer:

```

vec.cpp:15: note: versioning for alias required: can't determine dependence between *D.2078_11 and *D.2077_7
vec.cpp:15: note: mark for run-time aliasing test between *D.2078_11 and *D.2077_7
(... A lot more of output we don't care about right now ...)

```

That's a funny little message. And if you now check the assembly output, you'll see it's much more complex than what you could have expected. What's going on?

Let's start by figuring out what "dependence between \*D.2078\_11 and \*D.2077\_7" means. Where do those strange names come from? If you spend some time digging through gcc assembly, you'll soon notice that those are the kind of names gcc's backend uses to referr to variables. In fact, you can compile with "-fverbose-asm" and a comment will be placed for each variable access: D.2078 and D.2077 refer to the two input parameters that test receives. And gcc is telling us that it can't determine whether there is a dependency between them or not, so it got marked for "run-time aliasing test".

Pointer aliasing is what happens if two pointers may overlap. For example:

```c++

int sum(int *x, int  *y) {
    for (unsigned i=0; i&lt;3; ++i) {
        int n = x[i];
        x[i] = n + y[i];
    }
}

```

That looks like a simple function. Until we call it like this:

```c++

int main() {
    int x[] = {1, 2, 3, 4, 5, 6};
    int *x1 = &amp;x[1];
    int *x3 = &amp;x[3];
    sim(x1, x3);
    return 0;
}

```

Here it's quite clear that for "sum", x and y might overlap. If the elements are processed one by one (like C's abstract machine says it should be done) all is quite clear and we don't care too much whether the elements overlap or not, their result will always be the same and will always be defined. If, however this changes and we intend to vectorize this function, a problem arises: if we process by chunks, instead of processing by elements, the behavior of sum would suddenly change!

The vectorizer must ensure no behavior changes are introduced, so one of the steps needed to vectorize a function is to ensure there's no overlap between pointers (or, to use the proper terms, no pointer aliasing), and C99 has a keyword to tell the compiler "these two pointers will never alias" called restrict. Unfortunately there's no such keyword for C++, so a compiler extension will have to be used instead:

```c++

#define SIZE (100)
void test(int * __restrict__ v1, int * __restrict__ v2)
{
	for (unsigned i=0; i&lt;SIZE; i++) v1[i] = 2*v2[i];
}

```

Doing this takes care of the messages saying that the compiler can't prove there's no dependency between the two parameters to our test function. Don't waste too much time trying to analyze the assembly right now, though. You'll probably see this message somewhere on the vectorizer's output: "Vectorizing an unaligned access". This means more problems for our test program, but we'll leave that for later.

---

Pointer aliasing in C++

TODO // C99 vs C++11 / valarray

---

Runtime checking of pointer aliasing

---

Vectorizing unaligned accesses

Remember our example?

```c++

#define SIZE (100)
void test(int * __restrict__ v1, int * __restrict__ v2)
{
	for (unsigned i=0; i&lt;SIZE; i++) v1[i] = 2*v2[i];
}

```

Compiling that should probably give you a message like this one:

```

vec.cpp:9: note: vect_model_load_cost: unaligned supported by hardware.
(...)
vec.cpp:9: note: Alignment of access forced using peeling.
vec.cpp:9: note: Vectorizing an unaligned access.
(...)

```

What does that mean? Remember our long explanation about how the abstract machine C defines constraints on the program analysis, and how that meant the compiler couldn't be sure that two pointers won't alias? Turns out vectorization also has a problem with unaligned accesses too. If your list of ints starts somewhere accross alignment accesses, SSE will have problems. Luckily that's not a deal breaker for gcc: it detected our architecture supports "unaligned accesses" so it does something called "peeling" to align the access.

Peeling means that because the access is not guaranteed to be aligned, gcc will implement a short loop to "peel" a few iterations out of the main loop, so the main loop's accesses can be aligned. How? Imagine your vector of ints starts at 0xF123 and you need 0x10 alignment; gcc will create a short loop that will iterate, element by element, 12 times, until 0xF130. Then the main loop can start from 0xF130 and all its accesses will be aligned.

You may have also noticed a message like this:

```

vec.cpp:9: note: cost model: epilogue peel iters set to vf/2 because peeling for alignment is unknown .

```

Like you can imagine, there's a prologue peel loop (the one we've already discussed) and an epilogue peel loop; since we're processing by chunks of N elements per loop, then our iteration must end at some multiple of N. This means we might have up to N-1 elements that can't be processed by the main loop; these get taken care of by the epilogue peel loop. Of course you might choose to take a simpler path and wrap your vector like this:

```

struct Foo { int v[100]; } __attribute__ ((aligned (__BIGGEST_ALIGNMENT__)));

```

// TODO: add alignas example

---

Using intrinsics

```c++

#define SIZE (100)

struct Foo { int v[100]; } __attribute__ ((aligned (__BIGGEST_ALIGNMENT__)));
long sum(Foo __restrict__ * v) throw()
{
	long s = 0;
	for (unsigned i=0; i&lt;SIZE; i++) s += v-&gt;v[i];
    return s;
}

```

// TODO
https://software.intel.com/sites/landingpage/IntrinsicsGuide/
http://gcc.gnu.org/onlinedocs/gcc/Vector-Extensions.html
http://stackoverflow.com/questions/7156908/sse-intrinsic-functions-reference

---

Some closing thoughts

Vectorization is not easy, specially if you care about portability. Luckily the compiler does an amazing job on handling the complexity and freeing you of all the nitty-gritty problems around vectorizing a function. You don't really need to check if you'r pointers alias or not, or whether your reads are properly aligned: you just need to write your loop and let the compiler do its magic, it will evaluate if it's worth optimizing or not, and if it is it will take care of creating helper code to make vectorization work properly.

The downside to all the black-box magic the compiler does on loop-vectorization is quite big, though: you loose all visibility into how your code actually works. It might work wonderfully one day and then the next it might become the slowest part of your program, because a small change made gcc miss the chance of vectorization.

If (or when) gcc looses the ability to vectorize one of your loops, you'll be digging around a lot of compiler logs to try and figure out what went wrong. If you were to write the vectorized loop yourself using intrinsics you'd be certain that the loop works and it's vectorized (duh!) but you'd have to manage the portability, alignment and aliasing yourself. That's not a trivial task if you are aiming for a portable program.

If you plan to write a portable vectorized program, your best bet is to check your compiler's manual to see exactly which vectorization types are supported (that means, which types of plain looks can be transformed into vectorized loops). For a full list of all transformations available in gcc, check http://gcc.gnu.org/projects/tree-ssa/vectorization.html#using.

