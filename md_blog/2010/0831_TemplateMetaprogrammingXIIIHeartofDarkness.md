# Template Metaprogramming XIII: Heart of Darkness

@meta publishDatetime 2010-08-31T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/08/template-metaprogramming-xiii-heart-of.html

Last time we had a virtual template dispatch problem... we got to the point of knowing which was the index of the cache we were searching for, now we need to actually retrieve an instance of that cache. That's a problem. Why? To begin with, there are no instances, only types!

The next logical step would be to create a Map device, to map a list of types to a list of instances... let's see how can we do that, in pseudocode

```
instances( H|T ) <- [ create_instance(H), instances(T) ]
instances( NIL ) <- NIL

```

Looks easy. How can we map that to c++?

```c++
template &lt;class Lst&gt; struct Instance {
    typedef typename Lst::head Elm;
    Elm instance;
    Instance&lt; typename Lst::tail &gt; next;
};
template &lt;&gt; struct Instance&lt;NIL&gt; {};

#include &lt;iostream&gt;
using std::cout;

int main() {
    typedef LST&lt;int, LST&lt;char, LST&lt;float&gt; &gt; &gt; Lst;
    Instance&lt;Lst&gt; lst;
    lst.instance = 1;
    lst.next.instance = &#x27;a&#x27;;
    lst.next.next.instance = 3.1;
    std::cout &lt;&lt; lst.next.instance &lt;&lt; "n";
    return 0;
}

```

All those next.next.next.instance look ugly. Let's use some more meta-magic to get the Nth instance (why not a [] operator? several reasons, you can't mix non-const ints with templates nicely, there would be problems to define the return type... all those options are workable but it's easier if we do this in another device.

```c++
template <typename LST> struct Nth {
	typedef typename LST::tail Tail;
	typedef typename Nth::result result;
};
template <typename LST> struct Nth {
	typedef typename LST::head result;
};

```

Remember that one from the toolbox? Now we know how to get a specific index position, yet getting the instance is a different problem (the Nth device returns a type, not an instance). We should do something different, the problem is knowing the return type. What's the return type for the Nth instance of the Instances list?

```
   type <- Nth(TypesLst, Type)
   type var <- NthInstance(InstancesLst, N)

```

Not so easy, right? This is the translated C++:

```c++

template &lt;int N, typename TypeLst&gt; struct NthInstance {
    // This one isnt easy...

    // This is the next type in the list
    typedef typename TypeLst::tail TypeNext;

    //  * Nth::result is the Nth type in Lst (i.e. char, int, ...)
    typedef typename NthInstance&lt;N-1, TypeLst&gt;::NthInstanceType NthInstanceType;

    //  * typename Nth::result &amp; is a reference to said type and the ret type
    template &lt;InstancesLst&gt;
    static NthInstanceType&amp; get(InstancesLst &amp;instances_lst) {
        return NthInstance::get(instances_lst.next);
    }
};

// Remember, just for fun we choose a 1-based system (wtf..)
template &lt;typename TypeLst&gt; struct NthInstance&lt;1, TypeLst&gt; {
    typedef typename TypeLst::head NthInstanceType;

    template &lt;InstancesLst&gt;
    static NthInstanceType&amp; get(InstancesLst &amp;instances_lst) {
        return instances_lst.instance;
    }
};

```

And the code from fetching the instance itself is even more difficult, so I'll leave that for next time.

