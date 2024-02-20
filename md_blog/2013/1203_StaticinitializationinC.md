# Static initialization in C++

@meta publishDatetime 2013-12-03T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/12/static-initialization-in-c.html

Let's analyze this seemingly simple code sample:

```c++
struct X {
    X();
};

void foo() {
    static X a;
}

X b;
void bar() {
    foo();
    X c;
}
```

Do you know what the order of initialization will be for a, b and c? b is rather easy: it's a plain global variable and it should be initialized first of all, even before main runs. c is also easy, it will be initialized only when the execution reaches the line where it is defined. How about a?

a is static, so just like b it should be initialized only once. Unlike b, though, it belongs to foo's scope, and it will only be initialized the first time foo is executed. Let's see how that happens in gcc by taking an even simpler example:

```c++
struct X {
    X() throw();
};

void foo() throw() {
    static X x;
}
```

Note: the throw()'s are in there only to tell the compiler we don't want any kind of exception handling code, that will make the assembly inspection a bit easier. Let's compile, disassemble and c++filt this. You should see something very interesting in the first few lines:

```c++
    .file    "foo.cpp"
    .local    guard variable for foo()::x
    .comm    guard variable for foo()::x,8,8
    .text

# Skipping the actual foo definition, we'll see that later

.LFE0:
    .size    foo(), .-foo()
    .local    foo()::x
    .comm    foo()::x,1,1
```

Inside the definition for foo gcc reserved some space for our static variable; interestingly, it also reserved 8 bytes for something called "Guard variable for foo()::x" (when demangled, of course). This means that there is a flag to determine whether foo()::x was already initialized, or not.

Let's analyze now the assembly for foo() to understand how the guard is used:

```c++
foo():
    movl    guard variable for foo()::x, %eax
    movzbl    (%rax), %eax
    testb    %al, %al
    jne    .L1
    movl    guard variable for foo()::x, %edi
    call    __cxa_guard_acquire
    testl    %eax, %eax
    setne    %al
    testb    %al, %al
    je    .L1
    movl    foo()::x, %edi
    call    X::X()
    movl    guard variable for foo()::x, %edi
    call    __cxa_guard_release
.L1:
    # Rest of the method (empty, in our example)
```

This is also interesting: initializing a static variable depends on libcpp (which is dependant on the compiler's ABI). We could translate the whole thing to, more or less, the following pseudocode:

```c++
void foo() {
    static X x;
    static guard x_is_initialized;
    if ( __cxa_guard_acquire(x_is_initialized) ) {
        X::X();
        x_is_initialized = true;
        __cxa_guard_release(x_is_initialized);
    }
}
```

(Note: exception safety ignored, which of course is not the case for a proper libcpp)

Eventually, \_\_cxa\_guard\_acquire will check if this object was already initialized or if anyone else is trying to initialize this object, and then it will signal the calling method to run x's constructor if it's safe to do so.

There's another bit of information in here which is not immediately obvious: in case X's constructor fails (ie an exception is thrown within this method), x\_is\_initialized won't be set to true. Assuming the exception is caught somewhere else, if foo() is called again the initialization for foo()::x will be attempted to run once again.


# Comments

---
## In reply to this post, [jeff hill](http://www.aps.anl.gov/epics/) commented @ 2014-02-11T20:21:47.000+01:00:

It seems that thread safe atomics would be used for this type of synchronization, but even in very recent g++ I see calls to \_\_cxa\_guard\_acquire in the assembly. I don't claim to fully understand what goes on behind that curtain, but when single stepping the assembly the run time support code appears to be doing some heavy lifting in \_\_cxa\_guard\_acquire which does not point to an thread safe atomics based implementation. This is with a very recent mingw build of gcc which admittedly might not be optimally configured.

Original [published here](md_blog/2013/1203_StaticinitializationinC.md).

---
## In reply to this post, [nicolasbrailo](/md_blog) commented @ 2014-02-12T09:56:09.000+01:00:

> It seems that thread safe atomics would be used for this type of synchronization, but even in very recent g++ I see calls to \_\_cxa\_guard\_acquire in the assembly.

\_\_cxa\_guard\_acquire is actually part of the ABI, so I expect no compiler should ever optimize this away (ie you could provide your own version of \_\_cxa\_guard\_acquire, if you wish to do so).

> This is with a very recent mingw build of gcc

You might want to look at libc++ instead. Here's a good implementation of this function: https://llvm.org/svn/llvm-project/libcxxabi/trunk/src/cxa\_guard.cpp

Original [published here](md_blog/2013/1203_StaticinitializationinC.md).

---
## In reply to this post, [Static initialization in C++ | SKZ 81 // it&#39;s about boards and codes](md_blog/2016/0602_CWhyisundefinednessimportant.md) commented @ 2016-06-02T11:55:45.000+02:00:

[…] Here is a great article on advanced C++ mecanisms. I also liked the investigation method : Static initialization in C++ […]

Original [published here](md_blog/2013/1203_StaticinitializationinC.md).

---
## In reply to this post, [[Из песочницы] Реализация горячей перезагрузки С++ кода в Linux – CHEPA website](md_blog/youfoundadeadlink.md) commented @ 2019-01-06T16:04:05.000+01:00:

[…] При перезагрузке в динамическую библиотеку с новым кодом, кроме veryUsefulFunction, попадет и статическая переменная static Singleton ins;, и метод Singletor::instance. Как следствие, программа начнет вызывать новые версии обеих функций. Но статическая ins в этой библиотеке еще не инициализирована, и поэтому при первом обращении к ней будет вызван конструктор класса Singleton. Мы этого, конечно, не хотим. Поэтому реализация переносит значения всех таких переменных, которые обнаружит в собранной динамической библиотеке, из старого кода в эту самую динамическую библиотеку с новым кодом вместе с их guard variables. […]

Original [published here](md_blog/2013/1203_StaticinitializationinC.md).
