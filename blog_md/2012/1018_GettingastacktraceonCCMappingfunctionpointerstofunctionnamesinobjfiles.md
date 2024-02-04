# Getting a stacktrace on C/C++: Mapping function pointers to function
names in obj files

@meta publishDatetime 2012-10-18T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/10/getting-stacktrace-on-cc-mapping.html

[Last time](/blog_md/2012/1016_GettingastacktraceonCCSomecallinginternals.md) we saw how to get a stacktrace in C++, yet we only had access to the list of function pointers and not to the function names. Still, pointers are not that useful. Can we get function names instead? Yes, we can but it's not easy. One option would be to read the elf specification. Boring. Let's tinker around with our test program, may be we can find something interesting:

```c++
    Caller *caller = (Caller*)sp;
    while (caller) {
        cout &lt;&lt; caller-&gt;addr &lt;&lt; endl;
        void** foo = (void**)caller;
        cout &lt;&lt; "\t" &lt;&lt; foo[0] &lt;&lt; "|" &lt;&lt; foo[1] &lt;&lt; endl;
        caller = caller-&gt;addr;
    }
```

On my machine I got something like this:

```c++
0xbfa25fd8|0x8048acb
0xbfa25ff8|0x8048aeb
0|0x40143113
```

The first address is the memory address of the stack to which we should return after executing this function. The second address looks interesting. It looks like the addresses we see when dissasemblying an object. Let's try running 'objdump -Sd ./a.out':

```c++
08048ac0 &lt;_Z3barif&gt;:
 8048ac0: 55                      push   %ebp
 8048ac1: 89 e5                   mov    %esp,%ebp
 8048ac3: 83 ec 08                sub    $0x8,%esp
 8048ac6: e8 e1 fe ff ff          call   80489ac &lt;_Z3foov&gt;
 8048acb: c9                      leave
 8048acc: c3                      ret

08048acd :
 8048acd:   55                      push   %ebp
 8048ace:   89 e5                   mov    %esp,%ebp
 8048ad0:   83 e4 f0                and    $0xfffffff0,%esp
 8048ad3:   83 ec 10                sub    $0x10,%esp
 8048ad6:   b8 00 00 00 40          mov    $0x40000000,%eax
 8048adb:   89 44 24 04             mov    %eax,0x4(%esp)
 8048adf:   c7 04 24 02 00 00 00    movl   $0x2,(%esp)
 8048ae6:   e8 d5 ff ff ff          call   8048ac0 &lt;_Z3barif&gt;
 8048aeb:   b8 00 00 00 00          mov    $0x0,%eax
 8048af0:   c9                      leave
 8048af1:   c3                      ret
```

And, indeed, 0x8048acb and 0x8048aeb are both there: they are the EIP after the ret call! Note that you may use c++filt if the mangled names are too confusing. Anyway, we can indeed get the function names, albeit in a rather contrived way. Is there a better way to get a backtrace and its symbols' names? Turns out there is and we'll see how to get a function's name during runtime, in the next article.

