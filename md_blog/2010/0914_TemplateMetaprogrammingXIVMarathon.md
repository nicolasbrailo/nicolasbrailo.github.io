# Template Metaprogramming XIV: Marathon

@meta publishDatetime 2010-09-14T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/09/template-metaprogramming-xiv-marathon.html

If you remember previous entry, we got our evil device to the point of getting a specific instance using only a type hint. Now we need to put all the code together. I won't add much to the code, you should be able to parse it yourself.

```c++
/***********************************************/
struct NIL {
    typedef NIL head;
    typedef NIL tail;
};

template &lt;class H, class T=NIL&gt; struct LST {
    typedef H head;
    typedef T tail;
};
/***********************************************/

/***********************************************/
template &lt;class X, class Y&gt; struct Eq { static const bool result = false; };
template &lt;class X&gt; struct Eq&lt;X, X&gt; { static const bool result = true; };
/***********************************************/

/***********************************************/
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
/***********************************************/

/***********************************************/
template &lt;typename LST, int N&gt; struct Nth {
	typedef typename LST::Tail Tail;
	typedef typename Nth&lt;Tail, N-1&gt;::result result;
};

template &lt;typename LST&gt; struct Nth&lt;LST, 0&gt; {
	typedef typename LST::head result;
};
/***********************************************/

/***********************************************/
template &lt;typename Lst&gt; struct Instances {
    typedef typename Lst::head Elm;
    Elm instance;
    Instances&lt;typename Lst::tail&gt; next;
};
template &lt;&gt; struct Instances&lt;NIL&gt; {};
/***********************************************/

/***********************************************/
template &lt;int N, typename TypeLst&gt; struct NthInstance {
    // This one isnt easy...

    // This is the next type in the list
    typedef typename TypeLst::tail TypeNext;

    //  * Nth::result is the Nth type in Lst (i.e. char, int, ...)
    typedef typename NthInstance&lt;N-1, TypeNext&gt;::NthInstanceType NthInstanceType;

    //  * typename Nth::result &amp; is a reference to said type and the ret type
    template &lt;typename InstancesLst&gt;
    static NthInstanceType&amp; get(InstancesLst &amp;instances_lst) {
        return NthInstance&lt;N-1, TypeNext&gt;::get(instances_lst.next);
    }
};

// Remember, just for fun we choose a 1-based system (wtf..)
template &lt;typename TypeLst&gt; struct NthInstance&lt;1, TypeLst&gt; {
    typedef typename TypeLst::head NthInstanceType;

    template &lt;typename InstancesLst&gt;
    static NthInstanceType&amp; get(InstancesLst &amp;instances_lst) {
        return instances_lst.instance;
    }
};
/***********************************************/

class Facade {
    typedef LST&lt;int, LST&lt;char, LST&lt;double&gt; &gt; &gt; Lst;
    Instances&lt;Lst&gt; instances;

    public:
    template &lt;typename PK&gt; int find(PK) {
        return Position&lt;PK, Lst&gt;::result;
    }

    template &lt;typename PK&gt;
    // This is a difficult one... it should be parsed like this:
    //  1) Get the desired instance position using Position::result
    //  2) Get the type @ the desired position with NthInstance::Type
    //  3) Define said type as a return type (with an &amp; at the end, i.e. make
    //      it a reference to the return type)
    typename NthInstance&lt; Position&lt;PK, Lst&gt;::result, Lst &gt;::NthInstanceType&amp;
    get_instance(PK) {
        const int idx_position = Position&lt;PK, Lst&gt;::result;
        typedef typename NthInstance&lt;idx_position, Lst&gt;::NthInstanceType IdxType;
        IdxType &amp;idx = NthInstance&lt;idx_position, Lst&gt;::get( instances );
        return idx;
    }
};

#include &lt;iostream&gt;
int main() {
    Facade f;
    int &amp;a = f.get_instance(1);
    char &amp;b = f.get_instance('a');
    double &amp;c = f.get_instance(1.0);
    a = 42; b = 'n'; c = 4.2;
    std::cout &lt;&lt; f.get_instance(1) &lt;&lt; "\n";
    std::cout &lt;&lt; f.get_instance('a') &lt;&lt; "\n";
    std::cout &lt;&lt; f.get_instance(1.0) &lt;&lt; "\n";
    a = 43; b = 'm'; c = 5.2;
    std::cout &lt;&lt; f.get_instance(1) &lt;&lt; "\n";
    std::cout &lt;&lt; f.get_instance('a') &lt;&lt; "\n";
    std::cout &lt;&lt; f.get_instance(1.0) &lt;&lt; "\n";
    return 0;
}
```

The only thing missing now is a map, to convert a primitive type to an index type, but that's trivial and so it will be left as an exercise for the reader (?). We just implemented the most evil code in the whole world. Next time, the conclusions.

