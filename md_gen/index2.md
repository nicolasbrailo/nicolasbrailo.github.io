#
@meta docType index
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

## The bestest autocomplete for Vim

Post by Nico Brailovsky @ 2019-06-11 | [Permalink](md_blog/2019/0611_ThebestestautocompleteforVim.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0611_ThebestestautocompleteforVim.md&body=I%20have%20a%20comment!)

TL;DR: I like [YouCompleteMe](https://github.com/Valloric/YouCompleteMe)
A [post in Hacker News](https://news.ycombinator.com/item?id=19529557) drew me to look at autocompletion in Vim. After trying a few plugins years before, I settled for the available-by-default autocomplete in Vim. It's pretty dumb, but pretty dumb covers 90% of what I need: autocompletionForReallyUglyOrLongNames.

Vim's omnifunc completer is enough if no fancy features are necessary: fast, available, trivial to setup. I have successfully used omnifunc in fairly large projects, and while it requires familiarity with the codebase, some may argue that's a feature and not a bug.

Now I confess: I don't understand Vundle, Pathogen or any other Vim plugin handler. Second extravagant opinion in this post: I don't see the point of a plugin manager for Vim. I like knowing the source code of every plugin I use well enough so I can troubleshoot it when it breaks (\*). I prefer to #include (or, rather, source) them manually. Keeping [everything in Github](https://github.com/nicolasbrailo/Nico.rc), I rarely need to set up a plugin twice. The effort to install and configure a plugin is usually not a lot more than learning how to use that plugin in the first place.

While being Vundle illiterate may have made my experience a bit more complicated than necessary, I still found the experience of installing autocompletion plugins quite horrible (#). [Deoplete](https://github.com/Shougo/deoplete.nvim) had me chasing dependencies all over the place and Conquer of Completion seems to require such specific setup of version and plugins that I didn't even attempt to install it.

YouCompleteMe, though, was a pleasant surprise: its documentation explained how to install in three steps, and it is a mostly self-contained plugin. While YCM has a compiled dependency, setting it up is pretty trivial. It just works out of the box.

Took me years but I'm very happy to finally find an autocomplete plugin that "just works" for my basic Vim setup.

(\*) For some reason, I only feel this way about Vim

(#) Disclaimer: Re-reading my own text, it may appear as I'm somewhat belittling Deoplete, CoC, Vundle, Pathogen, etc. That's not my intention. I have the maximum respect for these projects. The engineering effort in them is amazing, and I know for a fact they make life easier for a lot of people. I'm just not one of them.





---

## Howto: shutdown a TV with HDMI CEC Chromecast

Post by Nico Brailovsky @ 2019-05-28 | [Permalink](md_blog/2019/0528_HowtoshutdownaTVwithHDMICECChromecast.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0528_HowtoshutdownaTVwithHDMICECChromecast.md&body=I%20have%20a%20comment!)

That's a long title just to say "how to turn off your TV". Only I want to show how to do it even if you lost your remote control.

Chromecast can turn your TV on and off, as long as it supports something called HDMI CEC. Of course the Chromecast itself needs to be powered, i.e. you can't plug it to a USB port in your TV.

The "on" part is easy: you just start casting something ([your pictures, for example](md_blog/2019/0405_ChromecasticSlideshow.md)) and Chromecast automagically turns your TV on. The off part is a bit harder.

Turning off is, obviously, an implemented feature, as the Google assistant can do it. After some Wireshark sniffing, I couldn't find any URL you can call in a Chromecast to turn off the TV. Some [people invested more time on this than me](https://github.com/balloob/pychromecast/issues/196), so I assume there's just no simple way to directly use a Chromecast for this. Luckily you can use the Google assistant.

I wrote "simple way". The following maybe doesn't quite qualify as "simple", but it's not too time consuming. It's certainly not elegant, but hey (as of the date I'm writing this article) it works.

How to turn a TV off using a Chromecast
---------------------------------------

### Part 1: Set up the Google assistant SDK

There's no easy way to make a Chromecast turn off a TV, so instead we'll interface with a Google assistant, then ask the assistant to do it for us. There's also no easy way to do this with an API, but the assistant's voice recognition is actually quite good. Let's start by installing the SDK:

1. Follow the setup instructions for the [Google Assistant library](https://developers.google.com/assistant/sdk/guides/library/python/embed/setup), with the changes described below.
2. The assistant examples need a microphone present, but we're not going to use it. If you don't have one and you're doing this in a RaspberryPi, just fake one by putting this in ~/.asoundrc:

```c++
pcm.!default {
  type asym
  capture.pcm "mic"
}
pcm.mic {
  type plug
  slave {
    pcm "null"
  }
}
```

3. The same may be needed for a speaker.
4. Continue the setup guide: create a project in the Actions console. Register also a dummy model to download the json credentials.
5. Follow the "Install the SDK and Sample Code" instructions. In May 2019, they work fine in a RaspberryPI 3 with Raspbian.
6. Try running the sample code. googlesamples-assistant-hotword segfaults but googlesamples-assistant-pushtotalk works fine.

### Part 2: Hack the sample to turn off a TV

You should now have the samples from the SDK running. At least those that don't crash. If you have a microphone, you can ask anything you normally ask the Google assistant like... the weather?

The assistant can turn off your TV if you say "Turn off $Chromecast\_Name". But what if you don't like talking to your phone?

I'm sure you expect I'll reveal a nice, clean way to invoke the assistant and make it turn off your Chromecast. Sorry, that would take too long. There is a text interface for the assistant but I wasn't able to have it running in less than 15 minutes, so these are your options:

* Use festival. echo "$Google assistant command" | text2wave -o cmd.wav will generate a command that (often) the assistant can understand. If you don't have such luck:
* Just record yourself. Hackish? Sure, but if all you need is to shut down a TV, that's enough. **Important note**: Record yourself in mono 16KHz. Otherwise the assistant may not understand the wav file. If you run "file command.wav" it should look like this:

```c++
command.wav: RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 16000 Hz
```

Whatever method you choose, create a wav file with the command you want to execute (i.e. "turn off $Chromecast\_name) and put it in the directory where you installed the Google Assistant SDK.

### Part 3: Throw your remote to the recycling bin!

You're ready now. Goto the directory where you installed the SDK and recorded your voice command, then try this:

```c++
$ source env/bin/activate
$ googlesamples-assistant-pushtotalk --device-model-id $AN_ID_YOU_GOT_FROM_GOOGLE --project-id $YOUR_GOOGLE_PROJECT_ID --once --verbose -i ./command.wav
```

With a bit of luck that should shut down your TV.

Linkdump:

* https://developers.google.com/assistant/sdk/overview
* https://developers.google.com/assistant/sdk/guides/library/python/
* https://developers.google.com/assistant/sdk/guides/library/python/embed/setup





---

## Say nice things

Post by Nico Brailovsky @ 2019-05-14 | [Permalink](md_blog/2019/0514_Saynicethings.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0514_Saynicethings.md&body=I%20have%20a%20comment!)

As software developers, we need to put much more emphasis on positive interactions with our peers. Engineering requires critical thinking. Looking for cases where something (code!) will break. Criticizing what we do, on the hope of doing it better, is a key and necessary aspect of our profession. However, even when done properly (already a hard enough job!) this practice emphasizes negative interactions. In a normal job, what would you say is the ratio of times you hear "this might be better if .." vs "I really liked X"?

Saying "this was good" is hard. More often than not, it's hard to even notice good code (and I'd go as far as saying that noticing good things is hard in general!). Unlike criticism, positive interactions don't lead to direct improvements. No code will be enhanced by saying "I liked this solution", though people may be more inclined to considering criticism if the positive aspect is also noted.

In the end, maybe someone just had a slightly better day because you said something nice. That's already a small victory.





---

## GCC instrumentation flag: slow everything down!

Post by Nico Brailovsky @ 2019-05-08 | [Permalink](md_blog/2019/0508_GCCinstrumentationflagsloweverythingdown.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0508_GCCinstrumentationflagsloweverythingdown.md&body=I%20have%20a%20comment!)

Here's a nice gcc tip if you think your code is running too fast: instrument everything! (Ok, it may also work if you need to create a profile of your application but for some reason Valgrind isn't your thing).

Compile with

```c++
g++ foo.cpp -ggdb3 -finstrument-functions
```

You can get a list of symbols with nm and c++filt, or you can implement your own elf reader too for extra fun.

```c++
extern "C" {
    bool g__cyg_profile_enabled = false;
    stack g__cyg_times;

    void __cyg_profile_func_enter(void *, void *) __attribute__((no_instrument_function));
    void __cyg_profile_func_exit(void *, void *) __attribute__((no_instrument_function));
    void cyg_profile_enable() __attribute__((no_instrument_function));
    void cyg_profile_disable() __attribute__((no_instrument_function));

    void __cyg_profile_func_enter(void *this_fn, void *call_site) {
        if (not g__cyg_profile_enabled) return;
        cout &lt;&lt; this_fn &lt;&lt; endl;
    }

    void __cyg_profile_func_exit(void *this_fn, void *call_site) {
        if (not g__cyg_profile_enabled) return;
        cout &lt;&lt; this_fn &lt;&lt; endl;
    }

    void cyg_profile_enable() {
        g__cyg_profile_enabled = true;
    }

    void cyg_profile_disable() {
        g__cyg_profile_enabled = false;
    }
}

int a() {
    return 42;
}

int b() {
    return a();
}

int c() {
    int x = b();
    int y = a();
    return x+y;
}

int d() {
    return c() + b();
}

int main() {
    cyg_profile_enable();
    cout << d() << endl;
    cyg_profile_disable();
    return 0;
}
```





---

## Chromecastic Slideshow

Post by Nico Brailovsky @ 2019-04-05 | [Permalink](md_blog/2019/0405_ChromecasticSlideshow.md) | [1 comments](md_blog/2019/0405_ChromecasticSlideshow.md) | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0405_ChromecasticSlideshow.md&body=I%20have%20a%20comment!)

Plug for a new [script I've been working on: https://github.com/nicolasbrailo/ChromecasticSlideshow](https://github.com/nicolasbrailo/ChromecasticSlideshow):

Slideshows in Chromecast directly from your filesystem, without going through any online service. No Google Photos, Facebook or anything else: plain old random files straight from your disk to your Chromecast.

Hope someone else finds this useful!








---

## VimTip: Search and f(replace)

Post by Nico Brailovsky @ 2019-02-26 | [Permalink](md_blog/2019/0226_VimTipSearchandfreplace.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2019/0226_VimTipSearchandfreplace.md&body=I%20have%20a%20comment!)

Pre-tip: When using search and replace in Vim, [you don't need to use slashes](md_blog/2015/0507_VimtipStopescapingslashes.md)
This works just fine:

```c++
%s#search#replace
```

Did you know $replace doesn't have to be a literal expression? You can also use Vim functions! For example:

```c++
%s#bar#\=line(&#x27;.&#x27;)
```

will replace every occurrence of 'bar' for its line number. You can get creative and use any other Vimscript function.





---

@meta extraNav [Prev](md_gen/index1.md)