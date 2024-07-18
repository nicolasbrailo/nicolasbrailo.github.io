#
@meta docType index
## How to: UEFI shell

Post by Nico Brailovsky @ 2024-02-20 | [Permalink](md_blog/2024/0220_UefiCheatsheet.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0220_UefiCheatsheet.md&body=I%20have%20a%20comment!)

There are countless "how to use an UEFI shell" notes out there, but this is the cheatsheet I tend to use:

```bash
# Set video to 80cols 50 rows, so it's less tiny in a 4k screen
mode 80 50

# Show pci device tree. Eg to find the VGA controller
devtree

# Show all things that have a FS may be bootable
map

# Refresh list of devices, if a new one is connected
map -r

# Show maybe bootable things that look like a usb
map -t cdrom

# Inspect a fs attached to a mapping (eg when looking at fs0, from the output of §map§)
# Case sensitive, uses fwd slashes and not back slashes
ls fs0:
ls fs0:EFI\BOOT\

# Moving around: first select mapped device, eg
fs1:

# Then cd and ls works
cd efi
ls
```

Eg to boot a Debian live USB on my setup

```bash
shell> mode 80 50
shell> map  -t cdrom
shell> FS0:
shell> FS0:
FS0:> cd efi\boot
FS0:\efi\boot> ./grubx64.efi
```





---

## Move again

Post by Nico Brailovsky @ 2024-02-18 | [Permalink](md_blog/2024/0218_MovedAgain.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0218_MovedAgain.md&body=I%20have%20a%20comment!)

I'm now at [nicolasbrailo.github.io](https://nicolasbrailo.github.io/blog). If I count platform, domain or tech-stack changes as a migration, I've now lost count of how many this site has had. It's the third one in the last few years. I moved away from WP because I wasn't happy with the sponsored content added to my site. I also wasn't happy with Blogger, I never quite like the interface, the way to write posts, or the customization options.

This site now came full circle: it started as a self-hosted php bundle, and it's now a kind-of-self-hosted static html site, [generated from .md files in Github](https://github.com/nicolasbrailo/nicolasbrailo.github.io). I figured I'm the person who reads this site the most, so I should like it. I'm a nerd, so I like writing code; hence the custom md-to-html converter, about which I should blog some time soon. This is also only meant as a fun project (and a great self-reminder mechanism, persistent through the decades) so why not reinvent the wheel, and create a custom md-to-html renderer for it?


## ToDo
* RSS doesn't work yet
* There are broken things from back the 2010's - I need to review old posts
* Some content isn't migrated yet


## Fun stats

* There are about 450 posts, in about 15 years. This means I'm quite lazy.
* Most of the external links are actually broken. If you browse the site, you'll notice the further back in time you go, the more dead links you get. This site has survived a non trivial chunk of the existing Internet.
* This blog started some time in 2008, and since then has had at least 5 domains (but possibly more)
    * nicolasb[com.ar]
    * monosinfinitos[com.ar]
    * monoinfinito.wordpress.com
    * monkeywritescode.blogspot.com
    * Now: [nicolasbrailo.github.io](https://nicolasbrailo.github.io/blog)
* Finally deleted all content from Wordpress - just today!
* I moved away from Wordpress in 2021. Somehow, the site still claims to have 20 visitors a day, even though there are no posts (other than a text saying "moved to...")
* I still haven't deleted all the content from Blogger - but it's in my ToDo list
* `wc $(find md_blog -type f)` says this blog has 116068 words in 16497 lines. This is comparable to 400 pages book, though not necessarily a good one. Google says 'The Return of the King' is about 135K words, and 'The Hobbit' is about 100K. 'Sense and Sensibility' comes closest at 119K words.





---

## Fix Spotify deeplinking in Linux + custom SpotiWeb UI

Post by Nico Brailovsky @ 2023-12-16 | [Permalink](md_blog/2023/1216_FixSpotifydeeplinkinginLinuxcustomSpotiWebUI.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2023/1216_FixSpotifydeeplinkinginLinuxcustomSpotiWebUI.md&body=I%20have%20a%20comment!)

After a recent update I found [my custom Spotify UI (\*)](https://nicolasbrailo.github.io/SpotiWeb/) wasn't working. The way my custom UI works is by generating a simple list of followed artists, and then playing in the native app by using deep-linking. A recent update seems to have broken this in Linux based OSes, so here's my fix:

```bash
sudo mv /usr/share/spotify/spotify /usr/share/spotify/spotify.real
sudo echo '/usr/share/spotify/spotify.real --uri="$1"' > /usr/share/spotify/spotify

```

Seems old versions of spotify would try to open anything as a deeplink, but new versions require a `--uri` parameter on argv. Surely there is a cleaner way of doing this in xdg-open, but I'm too lazy to read manuals.

In the "reminder to myself" category, as there is zero chance I'll remember this next time I'm setting up a computer.

### (\*) SpotiWeb: custom Spotify UI

I don't like "recent" changes (recent being the last 3 or 4 years!) to Spotify's UI, [so I rolled out my own](https://nicolasbrailo.github.io/SpotiWeb/). It's a plain, boring, unobtrusive view of all your followed artists, grouped by categories. It also runs in any browser and is extremely minimalist (doesn't even have a search function: you can use the browser's search if you need one!)

The app is hosted in github pages, and because it's entirely client side it doesn't need any kind of server side support to run. Check out the source here and [either run your own, or check out there's no server side processing involved.](https://github.com/nicolasbrailo/SpotiWeb)





---

## Translated to Chinese!

Post by Nico Brailovsky @ 2023-01-14 | [Permalink](md_blog/2023/0114_TranslatedtoChinese.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2023/0114_TranslatedtoChinese.md&body=I%20have%20a%20comment!)

Small celebratory post, because I never expected it:

[![](/blog_img/212446793-30c64252-a788-4a6d-81e2-e8f05f126497.jpg)](/blog_img/212446793-30c64252-a788-4a6d-81e2-e8f05f126497.jpg)

Someone translated [one of my open source projects](http://github.com/nicolasbrailo/pianOli) to Chinese!





---

## Bash script preamble

Post by Nico Brailovsky @ 2021-06-27 | [Permalink](md_blog/2021/0627_Bashscriptpreamble.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2021/0627_Bashscriptpreamble.md&body=I%20have%20a%20comment!)

All background Bash scripts should start with this preamble:

```bash
set -euo pipefail
exec > ~/log.log 2>&1
```

There are countless articles explaining why, and the main purpose of this one is a reminder for myself, so I won't go into the details. For reference:

* **-e** halts the script on error
* **-u** errors when using an undefined variable
* **-o pipefail** makes pipe error return value sane
* **exec > ~/log.log 2>&1** redirect all output to ~/log.log





---

## Where is the fun in that?

Post by Nico Brailovsky @ 2021-03-18 | [Permalink](md_blog/2021/0318_Whereisthefuninthat.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2021/0318_Whereisthefuninthat.md&body=I%20have%20a%20comment!)

You can always find coders asking why coding isn't fun anymore. I can somewhat relate but I never understood why the answer isn't obvious: coding isn't software engineering. When you go from coding to engineering, the focus changes. A lot of the interesting stuff is there, but there's also not-interesting-stuff in the mix. Maybe testing and documenting isn't your thing, you just want to build something. Maybe the stability from testing and documenting isn't that important to you. Perhaps you know you're the only one who's ever going to read your code. Your future self may be angry at you for a little while if the code breaks... so what? Your experiment crashed? Just reboot it. No problem.

If you're coding-to-sell, you're not writing code for yourself. You write for a team, even if that team is only you and future-you. You write it so it may scale and adapt to new requirements. You write it to survive a bit more than a weekend, and to be stable. You're not writing code to learn new things, that's only a nice side-effect; you are trying to build a product.

Furthermore, you're not investing time to learn something or just to have fun; you're trading time for money (if you learn something in the process, that's good - but probably not why you're being paid a salary as a software engineer).

It's understandable that parts of software engineering are not as fun as it was hacking in a basement while you were a kid. There is still a very big overlap, but it's not just the same activity. Myself, I try to focus on the fun parts and just have discipline to get the boring parts out of the way. I usually work in places where the balance is fairly decent, and it's kept me interested in software development for the last 15 (ish) years. I'm hoping it'll do the trick for much longer than that.





---

## reboot succesful?

Post by Nico Brailovsky @ 2021-03-17 | [Permalink](md_blog/2021/0317_rebootsuccesful.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2021/0317_rebootsuccesful.md&body=I%20have%20a%20comment!)

Since "migrating" from Wordpress to Blogspot:

* Traffic to Wordpress fell from ~100ish visitors a day to ~30 or ~40ish.
* This site went from 0 to also ~30 or ~40ish.

That went much better than I expected, considering I couldn't set up a proper HTTP301-permanently moved (WP charges you for that, which IMO is slight extortionate for a site I don't want to monetize). Let's see how it goes 10 years from now, when I have to migrate from Blogpost to something else.





---

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

@meta extraNav [Prev](md_gen/index1.md)