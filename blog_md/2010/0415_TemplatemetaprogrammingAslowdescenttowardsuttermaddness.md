# Template metaprogramming: A slow descent towards utter maddness

@meta publishDatetime 2010-04-15T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/04/template-metaprogramming-slow-descent.html

There have been some articles dealing with template metaprogramming over here. Things like *template <int n>*, which look really weird (but behave in an even more bizarre way). This post starts a series of articles following the contrived and tortuous path down insanity lane and into the mouth of the beast. When we are done things like *typedef typename* should be clearer than *i=i++*, should you dare to keep on reading.

### First things first: Why TF would I...

Instead of explaining why let's start backwards: assume you already want to start learning some template metaprogramming. Yeah, I'm sure there are many legitimate reasons, like job security or job security perhaps, but if you want to learn template metaprogramming the most likely explanation is you are nuts. Plain and simple.

Practical uses? Not really. Yeah, there are some (if you are a boost developer) and lets you write some neat stuff, but in your every day job you are most likely never going to use them. And that is a good thing (tm), for mere mortal programmers tend to like getting their jobs done. Having said that, let's learn some template metaprogramming!

### Metawhat?

First, we need to start with a little clarification: using *template*  to parametrize a class, something like std::vector does, is not template metaprogramming. That's just a generic class (Java-pun intended). That is indeed a useful case for templates, but it has little fun in it.

Template metaprogramming is much more fun than mere generic classes. The template processing in C++ is a language on it's own (no, really, like a Turing complete language and everything), though a language with very weird syntax and a very strange "design". Design between quotes because there was no design in its initial stages, template processing is a sub-language organically grown as a side effect of adding partial templates specialization (more on this later), so don't expect a nice language. Here, let me show you an example of another organically grown language: Microsoft's .bat scripting. You can imagine now what kind of beast this is if we are comparing it to bat scripts, right? (Nitpickers note. yup, I do know bat scripting is not a real language as it's not Turing complete. The comparison still stands though).

### First step

Enough chatter. Let's start with an empty program and work our way down from there:

```c++
template &lt;int N&gt; struct Factorial {
 static const int result = N * Factorial::result;
};

template &lt;&gt; struct Factorial&lt;0&gt; {
 static const int result = 1;
};

int main() {
 std::cout &lt;&lt; Factorial&lt;5&gt;::result &lt;&lt; "n";
 retrun 0;
}
```

Whoa. Lots of magic going on there, on the simplest of all template metaprogramming tricks. But I don't feel like explaining it right now, I'm too sleepy, so I will leave that for next post.

