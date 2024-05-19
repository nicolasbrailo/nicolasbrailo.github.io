#
@meta docType index
## sudo reboot

Post by Nico Brailovsky @ 2021-03-02 | [Permalink](md_blog/2021/0302_sudoreboot.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2021/0302_sudoreboot.md&body=I%20have%20a%20comment!)

Recently found out Wordpress had pretty aggressive ads on my blog. That worked as the encouragement I was needing to work on a task I'd been putting off for years: fix bit-rotted content! I took the opportunity to fix all (most) broken links and source code snippets from the last 14 years. It was supposed to be a short sed script, which of course ended up being 3 days of work - a lot of it manual. A few cool things I figured doing this:

* Even if I very sparingly add new posts, 14 years is still a lot of content. By the infinite monkey theorem, some of it should be good. Right?
* A new reason to dislike template metaprogramming: so many 'template & lt; class & gt;', so much broken code...
* I have 400+ posts and less than 10 images. While I quite like adding visual content, very little of it (except memes!) survived the successive blog migrations.
* I can estimate there have been at least 3 platform migrations since the first post. I can count the number of times that '<' gets html-encoded like the rings of a tree. '& amp;amp;lt;' was the longest encode sequence I found.





---

## Vimtip: Open path

Post by Nico Brailovsky @ 2020-05-08 | [Permalink](md_blog/2020/0508_VimtipOpenpath.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2020/0508_VimtipOpenpath.md&body=I%20have%20a%20comment!)

If you are editing a file which references another file (like, say, a cpp file #including a header file) then you can use Vim to open the referenced file in a new tab like this:

```c++
#include "foo/bar.h"
```

Place your cursor anywhere in "foo/bar.h" and press `gf` to open the referenced path. More interestingly, you can also do `C-w`, release and then `gf` to open in a new tab.

Today I learned you can also do this for arbitrary URLs. If you have a file like this:

```c++
#include "foo/bar.h"
// https://github.com/nicolasbrailo/Nico.rc/blob/master/README.md
...
```

Then you can do `C-w gf` on either of the first two lines! If needed, Vim will automatically fetch the referenced url for you and store it in a temp location. Magic!





---

## Weak symbols to mock c-APIs with gmock/gtest

Post by Nico Brailovsky @ 2020-03-15 | [Permalink](md_blog/2020/0315_WeaksymbolstomockcAPIswithgmockgtest.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2020/0315_WeaksymbolstomockcAPIswithgmockgtest.md&body=I%20have%20a%20comment!)

I recently worked with a c-style API interface which wasn't very open to mocking. The API in question looked something like this:

```c++
handle_t h = api_open();
api_foo(h, param1, param2);
api_foo2(h, 42);
api_close(h);
```

This \*almost\* looks like a C++ interface, with extra steps that make it really really hard to mock (and, thus, to test). If it were a c++ interface, it would be possible to "virtualize" the different methods from the, even if this required a bit of patching to the original library. While a c interface doesn't provide this facility, there is another feature that makes mocking such an API with gmock possible: linker weak symbols!

In the header, you can patch your target library to export its symbols like this:

```c++
handle_t api_open() __attribute__((weak));
void api_foo(handle_t h, int, float) __attribute__((weak));
void api_foo2(handle_t h, int) __attribute__((weak));
void api_close(handle_t h) __attribute__((weak));
```

The [weak attribute](https://gcc.gnu.org/onlinedocs/gcc-3.2/gcc/Function-Attributes.html) will tell the compiler to emit this symbol marked as 'w'. If you compile this library and inspect it with `nm`, you'll see the (possibly mangled) symbol name and a w next to it. In turn, this tells the linker that this symbol can be overridden.

Normally, if you define 'api\_open' in more than a single .object file, and then link them all in a single binary, you'll end up with a linker error. Something about "multiple symbol definition", which seems reasonable. If the symbols are instead marked as weak, then the compiler will simply override the symbol table with the last seen instance of that symbol.

Once all mock-able symbols are defined as week, creating a mock is "easy", albeit not necessarily pretty. Following the example:

```c++
// Mock definition
struct MockApi {
 public:
  MOCK_METHOD(handle_t, api_open, ());
  MOCK_METHOD(void, api_foo, (handle_t h, int, float));
  MOCK_METHOD(void, api_foo2, (handle_t h, int));
  MOCK_METHOD(void, api_close, (handle_t h));
};

MockApi mocked_api_instance;

// Override default symbols and forward to gtest
handle_t api_open() { return mocked_api_instance.api_open(); }
handle_t api_api_foo(handle_t h, int i) { return mocked_api_instance.api_open(h, i); }
// ...
```

Note how mocked\_api\_instance has to be a global singleton; since your test under code will probably expect to be able to call this API directly, it's necessary to rely on a global object that everyone can access - both your test and their overridden API symbols and the module under test. With all this scaffolding in place, you can now write almost-normal tests.

```c++
TEST(Foo, Bar) {
  EXPECT_CALL(mocked_api_instance, api_open).WillOnce(Return(nullptr));

  MyObject o;
  o.run_test();
}
```

This method has the (big) disadvantage of creating an invisible dependency between "mocked\_api\_instance" and the rest of the test. An out-of-order inclusion can make your test fail, unexpectedly, and people trying to write new tests will find it quite hard to understand what is going on with out some good docs. On the other hand, this technique will let you create very stable tests with few run-time dependencies, so I still believe they can add a lot of value for integration tests!





---

## jq: grep and prettify json

Post by Nico Brailovsky @ 2020-02-27 | [Permalink](md_blog/2020/0227_jqgrepandprettifyjson.md) | [3 comments](md_blog/2020/0227_jqgrepandprettifyjson.md) | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2020/0227_jqgrepandprettifyjson.md&body=I%20have%20a%20comment!)

If you don't use [jq](https://stedolan.github.io/jq/manual/), you are missing a very important utility in your bash toolset. jq let's you query and filter json files from a cli. Just like awk or sed, js's "language" is basically write only, meaning whenever you need to do something there's a 99% chance you'll just be copy-pasting recipes from Stackoverflow until you find the one that works for you. Here are a couple of recipes I found most useful:

**cat a json file - with pretty print**

```c++
jq . /path/to/json_file
```

**Select a single key**

```c++
jq '.path.to.key'
```

The command above will return "42" for a json that looks like "{path: {to: {key: 42}}}"

**Delete all entries in an object, except for one**

```c++
jq '.foo|=bar'
```

The command above will return "{foo: {bar:''}}" for a json that looks like "{foo: {bar:'', baz: ''}}"

This is probably not even enough to get started. Luckily there's plenty of docs to read @ <https://stedolan.github.io/jq/manual/>








---

## Mixin(ish) classes with parameter packs in C++

Post by Nico Brailovsky @ 2020-02-18 | [Permalink](md_blog/2020/0218_MixinishclasseswithparameterpacksinC.md) | [2 comments](md_blog/2020/0218_MixinishclasseswithparameterpacksinC.md) | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2020/0218_MixinishclasseswithparameterpacksinC.md&body=I%20have%20a%20comment!)

For some reason I couldn't find many examples of how to use a parameter pack as a mixin, to enable different features with no runtime overhead. Here is a full example of you might implement this (be aware there are some nasal daemons in the code below!). The technique is really based on this one line:

```c++
 int dummy[sizeof...(Config)] = { (Config::apply(p), 0)... };
```

This idiom will unpack a parameter pack and call T::apply, for each T in the parameter pack. You can use this idiom to build very clean mixin-type interfaces with static dispatch, or to build job security.

Full example:

```c++
struct EnableFeatureA {
  template &lt;typename T&gt; static void apply(T *a) {
    cout &lt;&lt; a-&gt;a() &lt;&lt; endl;
  }
};

struct EnableFeatureB {
  template &lt;typename T&gt; static void apply(T *a) {
    cout &lt;&lt; T::b() &lt;&lt; endl;
  }
};

template &lt;typename Impl, typename... Config&gt;
struct Foo {
  Foo(){
    // Call apply() for each type in Config
    Impl *p = nullptr;
    int dummy[sizeof...(Config)] = { (Config::apply(p), 0)... };
  }
};

struct Bar;
using FwdFoo = Foo&lt;Bar, EnableFeatureA, EnableFeatureB&gt;;

struct Bar : FwdFoo {
   int a() { return 4; }
   static int b() { return 2; }
};
```








---

## Presenting tips: make your presentations suck a bit less

Post by Nico Brailovsky @ 2019-11-11 | [Permalink](md_blog/2019/1111_Presentingtipsmakeyourpresentationssuckabitless.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/1111_Presentingtipsmakeyourpresentationssuckabitless.md&body=I%20have%20a%20comment!)

I spent the last few years in a role that required a significant part in communicating with other people. Some of that in the form of slides and presentations, because not having slides isn't enterprisy. I'm far from being a great presenter, but I did learn a thing or two. All this is quite general, so it should apply to any kind of topic... as long as that topic is software engineering. I'm still a technical person and an engineer, so a lot of my assumptions about the audience may not hold true if you, for example, need to seriously consider fun things like workplace politics.

I hope these tips become useful for other people. At the very least I hope I'll remember to re-read this post the next time I have to present something.

Tip 1: Your audience wants you to succeed
-----------------------------------------

This is perhaps the most groundbreaking revelation. When you present something, people are giving you their time. Instead of browsing memes they are sitting down, listenning to what you have to say (at least until their limited attention span runs out). Nearly all of your audience will want to learn something, have fun, or at least be entretained. In a large enough crowd, the majority will be there voluntarily. There is just one logical conclusion: they want you to succeed! Few will go there with the expectation that your presentation will suck; that would be wasted time for them too.

Tip 2: Your audience wants you to succeed. Except for \*that person\*.
----------------------------------------------------------------------

Ok, tip #1 needs a caveat: \*that person\*. Most people will want to enjoy your presentation as much as they can and move on to the next thing. Except there will always be that person. You know who; might just be schadenfreude, or maybe they like showing off "they know best". Whatever the reason, they'll have a nitpick, an impossible question or an "actually" to add. There's good news, though: everyone dislikes him!

Whenever the annoying person of the group raises their hand, there's usually a collective sigh and a lot of eye-rolling in the audience. Don't invest most of your energy in dealing with that person. Do pay attention to the issues this person raises; they may in fact be good objections. Just learn how to defer. 99% of the time it suffices to say "good observation, let's pick it up one-on-one after this presentation". The audience is happy, the person raising the question feels heard and you may actually learn something new from the interaction.

Tip 3: Understand your medium
-----------------------------

A long time ago I thought slides were slides were slides. And a presentation is the decoration on top. Big mistake! The first thing I learned -the hard way- is that presentations, and in particular slides, need to be tailored to your delivery medium. Doing an online webcast presentation is very different than doing a presentation in person. It's even harder if you have a mixed audience, with some people online and some people in person. I personally try to avoid this situation like hell, as the end result tends to be a session that's not quite good for anyone. I prefer to have two sessions, one in person only and one just online. Some people are capable of having a successful presentation with a mixed audience. I'm not that skilled.

Tip 4: Give your audience a break
---------------------------------

You know your presentation. You've practiced, know the material, understand every nook and cranny of your talk. However, for your audience it's (hopefully) all new knowledge. And it's hard to absorb new knowledge with a person talking non stop, all the time. Give your audience a pause. Let them think. \*Stay silent\*.

It sounds scary: being on the spotlight, standing up and not saying anything for \*minutes\*. Well, it may seem like minutes, but it's usually just a few seconds you need: that's usually enough for people to think through a new idea. Learn to be comfortable with a bit of silence.

Tip 5: Silence for emphasis
---------------------------

Silence is important, so it gets two tips. People need silence to think, sure. But also consider this: while you shut up, people think of what you last said (or dinner, depending on the talk). That means, if you need to emphazise a particular aspect of your talk don't repeat it over and over again; present it, then make a pause. Just 5 seconds. If you quickly move on it becomes another bit of information in a sea of new knowledge. Stop for emphasis.

Tip 6: Questions?
-----------------

In light of all the praise of silence, here's an extra beneffit of shutting up: people get to ask questions. Yes, that's also scary, but interaction is great to help people understand. Invite questions with your silence!

Yes, an open conversation is scary. Besides the job of presenting you're now also a moderator. It can derail the whole timing and it makes presenting that much harder. So what? Your presentation may be good but it's not \*that good\*: if your audience engages you're doing something right. Follow their lead.

The difficult part is learning when to stop a runaway discussion. As a general rule, if you see engagement from different people across the room you're doing fine. If you only see a small group of people nitpicking over a detail, it's time to stop (remember tip #2!)

Tip 7: Most important slide? Last one
-------------------------------------

The last slide will be shown the longest. While you get closing questions from the audience (or akwardly stand in a corner while saying "no questions?", whichever happens) the final slide will be on screen. People will now either stare at their phones or ar this final slide. Make it count! Don't use a "Questions?" clipart (please don't use clipart). Make the last slide a summary of the most relevant point of your talk. Add some followup links and contact information.

If there is only one slide your audience will remember (and you may not even get that) it will probably be the last one.

Tip 8: Paper drafts
-------------------

Some times a computer is too limiting. Start with a paper draft to organize your ideas. Maybe you can also draw a mock of a few important slides. You don't need to design the entire thing on paper but by not having to fight your tools (is this image \*really\* aligned with that text?) you can focus on content, then on "UX" and only then on the implementation. If you run out of time battling powerpoint you can still have good content. If you run out of time battling powerpoint while designing your third slide, you may have a brilliant presentation with 10% of the content you wanted to show.

Tip 9: Know your audience \*and yourself\*
------------------------------------------

Some presentations are good for jokes and an informal tone. Some are to present quarterly financial numbers to your board of directors. It's pretty clear in which one you can use cat memes (and if it's not, maybe you need to start smaller!) - but you should also know to which style of presentation you naturally lean.

Slides are boring but safe. Q&A's are good to let people understand a topic at their own pace. Videos are a safe back up, but hard to seamlessly integrate in a presentation. Jokes are great, but really hard if you're not familiar with the audience. Know which style works for you and rely on it; but also try to mix in some new skill you are trying to develop. You may be surprised.

Tip 10: Why are you there? Why are they there?
----------------------------------------------

Before even planning a presentation, ask yourself: why? What's the purpose, what do \*I\* want to get out of it? More importantly: what do other people get out of it? The first reaction is usually "sharing information!". Unless you are a particularly skilled presenter, the information you had to share can probably be better understood by writing down a whitepaper, or maybe just an email.

There are many reasons to present something, from getting people to sit-down-and-pay-attention to "listen to my amazing sales pitch". In the end most of them boil down to some form of entertainment. Yes: most (successful) presentations are just some form of amusement. If you also have a useful message to deliver with it, all the better!





---

## Bash tip: Default value for a variable

Post by Nico Brailovsky @ 2019-11-04 | [Permalink](md_blog/2019/1104_BashtipDefaultvalueforavariable.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/1104_BashtipDefaultvalueforavariable.md&body=I%20have%20a%20comment!)

In my Bash scripts, I used to hack my way around default values for variables. Turns out there is a very simple way to give your variables a default value while also letting other override them if they want to:

```
FOO=${BAR-bar}
```

If someone export's BAR, then FOO will equals the already exported value of $BAR, if $BAR doesn't exist then FOO will have the value of the literal 'bar'.





---

## std::is_constant_evaluated: make debugging a little bit harder for yourself!

Post by Nico Brailovsky @ 2019-08-03 | [Permalink](md_blog/2019/0803_stdis_constant_evaluatedmakedebuggingalittlebitharderforyourself.md) | [2 comments](md_blog/2019/0803_stdis_constant_evaluatedmakedebuggingalittlebitharderforyourself.md) | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0803_stdis_constant_evaluatedmakedebuggingalittlebitharderforyourself.md&body=I%20have%20a%20comment!)

Let's pretend you find this:

```c++
const int a = foo();
int b = foo();
```

Would you be tempted to assume that a==b, always? I would. What if 'foo' actually depends on a global variable, and its return value depends on that global setting? Suddenly the code above will raise a few eyebrows in a code review session.

Coming to your friendly c++20 standard now:

```c++
constexpr int foo() {
    return (std::is_constant_evaluated())? 42 : 24;
}

bool a() {
    const int x = foo();
    return x == foo();
}
```

I'm sure with careful usage, is\_constant\_evaluated will allow library writers to create much more performant code. I'm also sure I'll lose a lot of hair trying to figure out why my debug code (`cout << foo()`, anyone?) prints different values than my `production` code.








---

## Vim multiple search

Post by Nico Brailovsky @ 2019-07-27 | [Permalink](md_blog/2019/0727_Vimmultiplesearch.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0727_Vimmultiplesearch.md&body=I%20have%20a%20comment!)

I keep forgetting about this one. Maybe writing it down will help me remember: Vim can search for (and highlight) multiple patterns at the same time. Just start your search with \v and split the patterns with |. Eg:

```
:/\vfoo|bar
```





---

## Bash: Color in command line prompt PS1

Post by Nico Brailovsky @ 2019-07-18 | [Permalink](md_blog/2019/0718_BashColorincommandlinepromptPS1.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0718_BashColorincommandlinepromptPS1.md&body=I%20have%20a%20comment!)

I'm lately dealing with lots of hosts in different environments (eg local, dev, test, etc). Some actions are safe to perform in some of these hosts, in others not so much. To help quickly figure out which hosts are safe, I wanted to add a color to my Bash prompt (PS1) - for example green for dev, where it's unlikely I'll break anything other than my stuff, red for hosts where carelessness might result in a weekend spent at the office.

The first result I get in Google when trying to set Bash's PS1 to use colors seems to be wrong (or, rather, I wasn't smart enough to make it work). An escape sequence seems to be missing, resulting in weird behavior with new lines; colors work, but line wrapping gets broken. Took me a while to associate broken \n's with colors, but once I did the fix was easy. Check out here for the [proper way to escape color commands in Bash](https://stackoverflow.com/questions/342093/ps1-line-wrapping-with-colours-problem).

And here's my current setup:

```c++
export COLOR_SET='\[\e['$THIS_HOST_COLOR'm\]'
export COLOR_RESET='\[\e[0m\]'

# Example:
export PS1='\A '$COLOR_SET'\h'$COLOR_RESET':\w$ '
```





---

@meta extraNav [Prev](md_gen/index1.md)