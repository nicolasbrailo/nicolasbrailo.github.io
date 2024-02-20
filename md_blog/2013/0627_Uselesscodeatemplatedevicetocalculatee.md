# Useless code: a template device to calculate e

@meta publishDatetime 2013-06-27T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/06/useless-code-template-device-to.html

Recently I needed to flex a bit my template metaprogrammingfooness, so I decided to go back and review [and old article](/md_blog/youfoundadeadlink.md) I wrote about it (C++11 made some parts of those articles obsolete, but I'm surprised of how well it's aged). To practice a bit I decided to tackle a problem I'm sure no one ever had before: defining a mathematical const on compile time. This is what I ended up with, do you have a better version? Shouldn't be to hard.

```c++
template <int N, int D> struct Frak {
	static const long Num = N;
	static const long Den = D;
};

template <class X, int N> struct MultEscalar {
	typedef Frak< N*X::Num, N*X::Den > result;
};

template <class X1, class Y1> struct IgualBase {
	typedef typename MultEscalar< X1, Y1::Den >::result X;
	typedef typename MultEscalar< Y1, X1::Den >::result Y;
};

template <int X, int Y>	struct MCD {
	static const long result = MCD<Y, X % Y>::result;
};
template <int X> struct MCD<X, 0> {
	static const long result = X;
};

template <class F> struct Simpl {
	static const long mcd = MCD<F::Num, F::Den>::result;
	typedef Frak< F::Num / mcd, F::Den / mcd > result;
};

template <class X, class Y> struct Suma {
	typedef IgualBase<X, Y> B;
	static const long Num = B::X::Num + B::Y::Num;
	static const long Den = B::Y::Den; // == B::X::Den
	typedef typename Simpl< Frak<Num, Den> >::result result;
};

template <int N> struct Fact {
	static const long result = N * Fact<N-1>::result;
};
template <> struct Fact<0> {
	static const long result = 1;
};

template <int N> struct E {
	// e = S(1/n!) = 1/0! + 1/1! + 1/2! + ...
	static const long Den = Fact<N>::result;
	typedef Frak< 1, Den > term;
	typedef typename E<N-1>::result next_term;
	typedef typename Suma< term, next_term >::result result;
};
template <> struct E<0> {
	typedef Frak<1, 1> result;
};

#include <iostream>
int main() {
	typedef E<8>::result X;
	std::cout << "e = " << (1.0 * X::Num / X::Den) << "\n";
	std::cout << "e = " << X::Num <<"/"<< X::Den << "\n";
	return 0;
}
```

