# Template Metaprogramming XII: You Really Got a Hold on Me

@meta publishDatetime 2010-08-24T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/08/template-metaprogramming-xii-you-really.html

Remember our virtual template method problem, from the other time? (I know, I said the answer was scheduled for a week after that post, but then I just forgot about it). May be we could avoid the virtual part by keeping a list of all our caches... how would we know which one should we dispatch the message to? Easy, using templates.

Instead of a list let's keep two, for twice the fun. One for the rows cache, another for the PKs. We can use PK to know which ROW Cache should we choose. Let's try to write a pseudo code for it:

```c++
ROW get_row(PK id) {
    pos &lt;- Position of PK in pks_lst
    return cache[ pos ].get_row( id )
}

```

Doesn't look too hard. Building on our previous toolbox, let's use Eq, Position and the definition of a list:

```c++
struct NIL {
    typedef NIL head;
    typedef NIL tail;
};

template &lt; class H, class T=NIL&gt; struct LST {
    typedef H head;
    typedef T tail;
};

template &lt;class X, class Y&gt; struct Eq { static const bool result = false; };
template &lt;class X&gt; struct Eq&lt;X, X&gt; { static const bool result = true; };

template &lt;class Elm, class LST&gt; struct Position {
    private:
    typedef typename LST::head H;
    typedef typename LST::tail T;
    static const bool found = Eq&lt;H, Elm&gt;::result;
    public:
    static const int result = found? 1 : 1 + Position&lt;Elm, T&gt;::result;
};

template &lt;class Elm&gt; struct Position&lt;Elm, NIL&gt; {
    static const int result = 0;
};

class Facade {
    typedef LST&lt;int, LST&lt;char, LST&lt;float&gt; &gt; &gt; Lst;

    public:
    template &lt;class PK&gt; int find(PK) {
        return Position&lt; PK, Lst &gt;::result;
    }
};

#include &lt;iostream&gt;
using std::cout;

int main() {
    Facade f;
    std::cout &lt;&lt; f.find(1.0) &lt;&lt; "\n";
    return 0;
}

```

Great, now we can find an element on a list of types. The real virtual dispatch for the next entry :D

