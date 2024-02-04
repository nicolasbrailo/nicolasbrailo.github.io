# Useless code: a template device to calculate e

@meta publishDatetime 2013-06-27T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/06/useless-code-template-device-to.html

Recently I needed to flex a bit my template metaprogrammingfooness, so I decided to go back and review [and old article](/search/label/Series%3A Template Metaprogramming) I wrote about it (C++11 made some parts of those articles obsolete, but I'm surprised of how well it's aged). To practice a bit I decided to tackle a problem I'm sure no one ever had before: defining a mathematical const on compile time. This is what I ended up with, do you have a better version? Shouldn't be to hard.

```c++
template &lt;int N, int D&gt; struct Frak {
	static const long Num = N;
	static const long Den = D;
};

template &lt;class X, int N&gt; struct MultEscalar {
	typedef Frak&lt; N*X::Num, N*X::Den &gt; result;
};

template &lt;class X1, class Y1&gt; struct IgualBase {
	typedef typename MultEscalar&lt; X1, Y1::Den &gt;::result X;
	typedef typename MultEscalar&lt; Y1, X1::Den &gt;::result Y;
};

template &lt;int X, int Y&gt;	struct MCD {
	static const long result = MCD&lt;Y, X % Y&gt;::result;
};
template &lt;int X&gt; struct MCD&lt;X, 0&gt; {
	static const long result = X;
};

template &lt;class F&gt; struct Simpl {
	static const long mcd = MCD&lt;F::Num, F::Den&gt;::result;
	typedef Frak&lt; F::Num / mcd, F::Den / mcd &gt; result;
};

template &lt;class X, class Y&gt; struct Suma {
	typedef IgualBase&lt;X, Y&gt; B;
	static const long Num = B::X::Num + B::Y::Num;
	static const long Den = B::Y::Den; // == B::X::Den
	typedef typename Simpl&lt; Frak&lt;Num, Den&gt; &gt;::result result;
};

template &lt;int N&gt; struct Fact {
	static const long result = N * Fact&lt;N-1&gt;::result;
};
template &lt;&gt; struct Fact&lt;0&gt; {
	static const long result = 1;
};

template &lt;int N&gt; struct E {
	// e = S(1/n!) = 1/0! + 1/1! + 1/2! + ...
	static const long Den = Fact&lt;N&gt;::result;
	typedef Frak&lt; 1, Den &gt; term;
	typedef typename E&lt;N-1&gt;::result next_term;
	typedef typename Suma&lt; term, next_term &gt;::result result;
};
template &lt;&gt; struct E&lt;0&gt; {
	typedef Frak&lt;1, 1&gt; result;
};

#include &lt;iostream&gt;
int main() {
	typedef E&lt;8&gt;::result X;
	std::cout &lt;&lt; "e = " &lt;&lt; (1.0 * X::Num / X::Den) &lt;&lt; "\n";
	std::cout &lt;&lt; "e = " &lt;&lt; X::Num &lt;&lt;"/"&lt;&lt; X::Den &lt;&lt; "\n";
	return 0;
}
```

