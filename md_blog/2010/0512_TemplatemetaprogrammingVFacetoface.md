# Template metaprogramming V: Face to face

@meta publishDatetime 2010-05-12T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/05/template-metaprogramming-v-face-to-face.html

By now we have learned the basics for a nice template metaprogramming toolkit:

* **Loops** with recursive template definitions
* **Conditionals** with partial template specializations
* **Returns** using typedefs

Unfortunately that's all you need for a Turing complete language, meaning now we have the power, bwahahaha! Mph, I'm sorry, back on topic, it means we can now create a fully functional and useful template metaprogramming device... for approximating e, nonetheless. Oh, you think that's not useful? Well though luck, that's all you get for now:

```c++
template &lt;int N, int D&gt; struct Frak {
    static const long Num = N;
    static const long Den = D;
};

template &lt;class X, int N&gt; struct ScalarMultiplication {
    static const long Num = N * X::Num;
    static const long Den = N * X::Den;
    typedef Frak&lt;Num, Den&gt; result;
};

template &lt; class X1, class Y1 &gt; struct SameBase {
	typedef typename ScalarMultiplication&lt; X1, Y1::Den &gt;::result X;
	typedef typename ScalarMultiplication&lt; Y1, X1::Den &gt;::result Y;
};

template &lt;int X, int Y&gt; struct MCD {
	static const long result = MCD&lt;Y, X % Y&gt;::result;
};

template &lt;int X&gt; struct MCD&lt;X, 0&gt; {
	static const long result = X;
};

template &lt;class F&gt; struct Simpl {
	static const long mcd = MCD&lt;F::Num, F::Den&gt;::result;
	static const long new_num = F::Num / mcd;
	static const long new_den = F::Den / mcd;
	typedef Frak&lt; new_num, new_den &gt; result;
};

template &lt; class F1, class F2 &gt; struct Sum {
	typedef SameBase&lt;F1, F2&gt; B;
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
	typedef typename Sum&lt; term, next_term &gt;::result result;
};

template &lt;&gt; struct E&lt;0&gt; {
	typedef Frak&lt;1, 1&gt; result;
};

int main() {
    cout &lt;&lt; (1.0 * E&lt;8&gt;::result::Num /  E&lt;8&gt;::result::Den) &lt;&lt; endl;
    return 0;
}
```

Looking nice, isn't it? You should have all what's needed to understand what's going on there. Even more, almost everything has been explained in previous articles, with the exception of EqBase. But that's left as an exersice for the reader because the writer is too lazy.

If you think any part of the code requires clarification ask in the comments. Next, a long overdue topic: lists using template metaprogramming. Guaranteed to blow your mind into little pieces!

