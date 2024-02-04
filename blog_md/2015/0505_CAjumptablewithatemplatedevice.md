# C++: A jump table with a template device

@meta publishDatetime 2015-05-05T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/05/c-jump-table-with-template-device.html

A [few articles ago](/blog_md/2015/0421_gccOptimizationlevelsandtemplates.md) we saw how gcc might need some help when mixing template instanciation (pure compile time data) with function calls (deducible compile time information, but not available to the template expander). Now we'll go one step further and combine all three types: pure compile time data, deducible compile time data and pure run time data (\*). Just to annoy the compiler, and to see how gcc is able to optimize the results.

Let's build a simple example, similar to what we used last time: an object that will determine the range of an integer and then invoke a callback with the closest range. Something like this could be used, for example, to allocate a buffer.

```c++
void boring(int x, func f) {
    if (x &lt; 2) {
        f(2);
    } else if (x &lt; 4) {
        f(4);
    } else if (x &lt; 8) {
        f(8);
    } else if (x &lt; 16) {
        // You get the idea...
    }
}
```

Can we build a prettier template version of this code, without any overhead? Let's try:

```c++
typedef void (*func)(int);

template &lt;int My_Size&gt;
struct Foo {
    void bar(size_t size, func callback) {
        if (size &gt; My_Size) {
            callback(My_Size);
        } else {
            next_foo.bar(size, callback);
        }
    }

    Foo&lt;My_Size/2&gt; next_foo;
};

// Stop condition
template&lt;&gt; struct Foo&lt;0&gt; {
    void bar(size_t, func) { }
};

void wrapper(int x, func f) {
    Foo&lt;512&gt; jump_table;
    jump_table.bar(x, f);
}
```

And now, let's compile like as "g++ -fverbose-asm -S -O0 -c foo.cpp -o /dev/stdout | c++filt". You'll see something like this:

```c++
wrapper(int, void (*)(int)):
    call    Foo&lt;512&gt;::bar(unsigned long, void (*)(int))

Foo&lt;512&gt;::bar(unsigned long, void (*)(int)):
    cmpq    $512, %rsi    #, size
    jbe    .L4
    call    *%rdx    # callback
    jmp    .L3
.L4:
    call    Foo&lt;256&gt;::bar(unsigned long, void (*)(int))    #
.L3:
    leave

Foo&lt;256&gt;::bar(unsigned long, void (*)(int)):
    cmpq    $256, %rsi    #, size
    jbe    .L4
    call    *%rdx    # callback
    jmp    .L3
.L4:
    call    Foo&lt;128&gt;::bar(unsigned long, void (*)(int))    #
.L3:
    leave

# You get the idea, right?

Foo&lt;0&gt;::bar(unsigned long, void (*)(int)):
    # Stop condition, do nothing

```

That doesn't look too good, does it? We don't need to worry: we already learned that gcc needs help from the optimizer to handle template expansion and non static function calls. Let's move to O1:

```c++
rapper(int, void (*)(int)):
.LFB14:
    cmpq    $512, %rdi    #, D.2974
    jbe    .L2    #,
    movl    $512, %edi    #,
    call    *%rsi    # f
    jmp    .L1    #
.L2:
    cmpq    $256, %rdi    #, D.2974
    jbe    .L4    #,
    movl    $256, %edi    #,
    call    *%rsi    # f
    jmp    .L1    #

# Again, it should be clear what&#x27;s going on...

.L11:
    cmpq    $1, %rdi    #, D.2974
    .p2align 4,,2
    jbe    .L1    #,
    movl    $1, %edi    #,
    .p2align 4,,2
    call    *%rsi    # f
.L1:
```

It's better than last time, but it doesn't look great either: gcc managed to inline all calls, but it stopped there. Let's move to O2 and see what happens:

```c++

wrapper(int, void (*)(int)):
    movslq    %edi, %rdi    # x, D.2987
    cmpq    $512, %rdi    #, D.2987
    ja    .L13    #,
    cmpq    $256, %rdi    #, D.2987
    ja    .L14    #,
    [ .... ]
    cmpq    $2, %rdi    #, D.2987
    ja    .L21    #,

.L13:
    movl    $512, %edi    #,
    jmp    *%rsi    # f

.L14:
    movl    $256, %edi    #,
    jmp    *%rsi    # f

[ .... ]

.L21:
    movl    $2, %edi    #,
    jmp    *%rsi    # f

.L1:
    rep
    ret
    .p2align 4,,10
    .p2align 3

```

Now, that looks much better. And we can now see that gcc generates the same code at -O2 for both versions of our code.

(\*) Just for the sake of completion:
* Pure compile time data is information directly available during compilation time, like a constant.
* Deducible compile time data means something that can easily be deduced, like a function call to a non virtual method.
* Run-time only data means something that a compiler could never deduce, like a volatile variable or the parameter of a function called from outside the current translation unit.


---
## In reply to [this post](), [ploxiln](/blog_md/youfoundadeadlink.md) commented @ 2015-05-06T05:33:48.000+02:00:

Maybe I'm being dumb, but I don't think

 if (size > My\_Size) {
 callback(My\_Size);

is the same logic as boring(). it would have to be something like

 if (size >= My\_Size/2) {
 callback(My\_Size);

(or refactored more significantly)

Original [published here](/blog_md/2015/0505_CAjumptablewithatemplatedevice.md).

---
## In reply to [this post](), [Anonymous]() commented @ 2015-05-06T08:11:12.000+02:00:

This is not a jump table --- the resulting code still contains a chain of conditional jumps. A jump table uses an array of function pointers and a given value is used as an index into this array. In general, your approach will need N comparisons for N if cases whereas a true jump table will just do a one memory access and a jump to a register value regardless of a number of cases.

Original [published here](/blog_md/2015/0505_CAjumptablewithatemplatedevice.md).

---
## In reply to [this post](), [Rob G]() commented @ 2015-05-06T13:33:36.000+02:00:

I really don't see how anyone sane could regard the template version as "prettier".

Original [published here](/blog_md/2015/0505_CAjumptablewithatemplatedevice.md).

---
## In reply to [this post](), [robdesbois](/blog_md/youfoundadeadlink.md) commented @ 2015-05-07T10:20:11.000+02:00:

For interest's sake: is there a particular reason to prefer power-of-2 buffer sizes over exponentially growing from a non-power? I.e. if initial x is 3, is it really better to calculate the next power so you can allocate 4,8,16, 32... than just 3,6,12,24...?

Original [published here](/blog_md/2015/0505_CAjumptablewithatemplatedevice.md).

---
## In reply to [this post](), [ploxiln]() commented @ 2015-05-09T00:00:27.000+02:00:

Re: why power-of-2:

A natural checkpoint in the sizing is 4KiB (which is a power of 2), because that's a memory page size (for most architectures) (because they can just mask the lower 12 bits to identify the page). The OS actually allocates memory to a process at the finest granularity of 4KiB. That's also a good point to switch allocation strategies, maybe use mmap() to get a stand-alone chunk of memory, instead of something like sbrk() to extend the old-style heap region.

Original [published here](/blog_md/2015/0505_CAjumptablewithatemplatedevice.md).

---
## In reply to [this post](), [nicolasbrailo](/blog_md) commented @ 2015-05-27T11:46:56.000+02:00:

Nothing more to add to ploxiln's comment. I initially worked on this snippet because I had to do some bucketing similar to what jemalloc does (I'm not sure how jemalloc implements their buckets, though)

Original [published here](/blog_md/2015/0505_CAjumptablewithatemplatedevice.md).

---
## In reply to [this post](), [nicolasbrailo](/blog_md) commented @ 2015-05-27T11:49:07.000+02:00:

It is very much a matter of personal opinion, but your point of view can change rapidly once you discover that someone typo'd a 32 for a 23 and you had to spend a day trying to figure out why some of the buckets are broken :)

Original [published here](/blog_md/2015/0505_CAjumptablewithatemplatedevice.md).

---
## In reply to [this post](), [robdesbois](/blog_md/youfoundadeadlink.md) commented @ 2015-05-27T13:03:46.000+02:00:

Ahh that makes sense, thanks for the info.

Original [published here](/blog_md/2015/0505_CAjumptablewithatemplatedevice.md).
