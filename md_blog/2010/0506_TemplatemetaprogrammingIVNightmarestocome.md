# Template metaprogramming IV: Nightmares to come

@meta publishDatetime 2010-05-06T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/05/template-metaprogramming-iv-nightmares.html

By now you should have noticed the warnings were not in vain: we are exploring a bizarre side of C++ here, a side many people prefer to, wisely, ignore. Luckily it probably is too late for you, there is no way back. Only a long spiraling way down into the arms of despair and cryptic compiler error messages... mwahahahaha. But now, let's see where we are.

In previous entries we learned how to return values, how to define recursive devices and how to provide a partial specialization. Let's see know how can we use partial specialization and complex return type definitions for some more fun template metaprogramming tricks. We had a fraction and a ScalarMultiplication operation for Frak:

```c++
template &lt;int N, int D&gt; struct Frak {
static const long Num = N;
static const long Den = D;
};

template &lt;int N, class X&gt; struct ScalarMultiplication {
static const long Num = N * X::Num;
static const long Den = N * X::Den;
};
```

Let's try to add an operation to simplify a Fraction. Simplify< Frak<2, 4> > should return 1/2. Mph... simplifying a fraction means dividing it by the MCD. A quick trip to Wikipedia reveals a nice recursive way to implement an MCD device:

```c++
template &lt;int X, int Y&gt;	struct MCD {
static const long result = MCD&lt;Y, X % Y&gt;::result;
};
template &lt;int X&gt; struct MCD&lt;X, 0&gt; {
static const long result = X;
};
```

I won't get into much detail as the link explains it a lot better than whatever I could try, but do take a look at the definition of MCD: that's a partial specialization. No magic there. Back to our simplifying device, we now have all the parts for it. Going back to it's definition we can see that simple(fraction) = fraction / mcd(fraction). Then:

```c++
template &lt;class F&gt; struct Simpl {
static const long mcd = MCD&lt;F::Num, F::Den&gt;::result;
static const long new_num = F::Num / mcd;
static const long new_den = F::Den / mcd;
typedef Frak&lt; new_num, new_den &gt; New_Frak;
typedef typename New_Frak::result result;
};
```

Quite a mouthful, but a lot simpler than what you think as there is a lot of unnecessary code there. Until new\_num and new\_den, no surprises. Typedeffing a Frak is not new, either. typedef typename is something new: typename tells the compiler you're referring to a name inside a template class, otherwise it'd try to refer to a static variable inside said class (\*). Knowing what each thing does we can simplify it:

```c++
template &lt;class F&gt; struct Simpl {
static const long mcd = MCD&lt;F::Num, F::Den&gt;::result;
typedef typename Frak&lt; F::Num / mcd, F::Den / mcd &gt;::result New_Frak;
};
```

It is a matter of style really. In this case I'd rather use the second one because it matches better its colloquial definition, but if you think the first one is more readable go with it... it doesn't really matter though, no one will ever even try to read this kind of code if you intend to use it in a real application.

Next time: a "useful" (\*\*) and complete template metaprogramming device, using the complete toolset we've been learning in this crazy templating series.

(\*) Think of it this way:

```c++
struct Foo {
   typedef int Bar;
   Bar bar;
};
```

In a template you don't know if Bar is a typename or varname because there's no access to the specific template definition. As a rule of thumb, if the compiler complains then add typenames.

(\*\*) Results may vary according to your definition of useful.

