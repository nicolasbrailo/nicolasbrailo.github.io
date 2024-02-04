# Cool C++0X features V: Templates and angle brackets, a short interlude

@meta publishDatetime 2011-05-10T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/05/cool-c0x-features-v-templates-and-angle.html

In the heart of C++ template metaprogramming and code obfuscation, lies the (ab)use of angle brackets. This seemingly innocent token can turn the most clean looking code into the mess that template-detractors like so much to complain about.

C++0x doesn't do much to clean up this mess, it's probably impossible, but it does offer a subtle feature to improve the legibility of C++ template code, a nifty little feature we have (inadvertently) used.

Up to C++0x, having two angle brackets together (>>) was parsed as the shift operator (like the one cout uses), meaning that if you had nested templates a lot of compiler errors ensued. C++0x corrects this, meaning that code which in C++ would be like this:

```c++
Reduce<Sum, Lst<Num<2>, Lst<Num<4>, Lst<Num<6>, Lst< Num<8> > > > > >
```

Can now be written like this:

```c++
Reduce<Sum, Lst<Num<2>, Lst<Num<4>, Lst<Num<6>, Lst< Num<8>>>>>>
```

Aaand, back to the normal schedule...

