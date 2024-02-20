# Writing Vim plugins

@meta publishDatetime 2021-03-02T15:59:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl http://monkeywritescode.blogspot.com/p/writing-vim-plugins.html

Vim utilities: Findgrep & Fastgrep
----------------------------------

I spent some time writing utility scripts for my Vim setup. I figured I can share them here, someone may even find them useful or at least get a laugh out of it. Last time I presented "Impl switcher", and "Better Tab New" before that. Today it's Findgrep & Fastgrep's turn.

I [wrote about Fastgrep a long time ago](/blog_md/2012/1030_Fastgrepacacheforgrep.md). The idea behind it is to speed up the slowest part in a grep command, the disk seek time, by creating a huge blob file with all the files in a project concatenated.

Fastgrep works great. But it requires a context switch, going from your IDE to your console just to grep. Findgrep fills the gap between the IDE and the command line: this utility provides a few key bindings to let you quickly run some common commands, like searching for a selected string or finding a file in the project directory.

You can get [Fastgrep here](https://github.com/nicolasbrailo/Nico.rc/blob/master/fastgrep.sh). [Findgrep is available in Github](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/findgrep.vim), and you can easily replace Fastgrep with normal grep if you need to.

---

Vim utilities: Impl switcher
----------------------------

I spent some time writing utility scripts for my Vim setup. I figured I can share them here, someone may even find them useful or at least get a laugh out of it. Last time I presented "[BTN: Better Tab New](/blog_md/2016/0701_VimutilitiesBetterTabNew.md)". Today it's the turn for "Impl switcher".

With its very imaginative name, "Impl switcher" has a very obvious purpose: it will just switch from a header file to an implementation file. So, between .h and .cpp. Surely there are lots of Vim plugins to do just that, why write another one?

Most impl-switcher plugins in the wild tend to, in my experience, require either a lot of configuration, a lot of dependencies, or a very specific project layout (or a combination of all three). They also seem to be huge and very complicated projects.

Impl switcher will recursively go up your directory hierarchy and use "find" to locate any files named like your base file but with a different extension. That makes it very simple and it requires minimal (if any) configuration: just drop it in your .vimrc file and you're good to go. OK, not exactly: it requires a Linux-like system with utilities like "find". Still, a good trade-off to keep the project's dependencies as small as possible.

Get "impl swicher" here:

* [Git hub repo](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/impl_switcher.vim)
* [Impl switcher's Vim page](http://www.vim.org/scripts/script.php?script_id=5406)

---

Vim utilities: Better Tab New
-----------------------------

I spent some time writing utility scripts for my Vim setup. I figured I can share them here, someone may even find them useful or at least get a laugh out of it. The first one is called "Better Tab New" and you can get it from my [Github repo](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/bettertabnew.vim) or from the script's [Vim page](http://www.vim.org/scripts/script.php?script_id=5405).

Why would you want a better tab new, and what's wrong with the default one? Simple: tabnew, in Vim, will just open a file. For that to happen you need to specify the exact path of a file. That's usually perfectly fine, but sometimes you need tabnew to be a bit smarter: maybe you just grep'ed something and ended up with a path that looks like "/foo/bar/baz:my\_text:42". Or maybe you want to open a file and go to a specific line. Those are things for which the default tabnew implementation isn't very good. BTN fills that niche and lets you create a simpler workflow when using grep.

Get BTN: Better Tab New here:

* [Gihub repo](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/bettertabnew.vim)
* [BTN's Vim page](http://www.vim.org/scripts/script.php?script_id=5405)

---

Simple vim plugin I: integrating new commands
---------------------------------------------

TL;DR: [Here's some code](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/findgrep.vim) to integrate system commands into vim. You can just drop it in your vimrc, create a small wrapper function in your vimrc and configure a few key binding to make it work.

Longer version:
We can extend our quick grep integration to other commands, quite easily. Since we defined a few wrappers to request input, get it from visual mode or just guess it, we can also have a helper function to create a scratch buffer and read a system command into it:

```ruby
" Find&amp;Grep command wrapper: execute cmd, shows the results in a scratch buffer
function! FG_EvalSysCmdInNewBuff(cmd)
    tabnew
    setlocal buftype=nofile bufhidden=wipe nobuflisted noswapfile nowrap
    execute '$read !' . a:cmd
    setlocal nomodifiable
endfunction

" Wrap a normal action: ask the user for input, then call func with it
function! FG_RequestInputAction(msg, func)
    let needle = input(a:msg)
    if strlen(needle) &gt; 0
        execute 'call' a:func .'("'. needle . '")'
    endif
endfunction

" Wrap a visual action: call func with whatever is selected under the cursor
function! FG_VAction(func)
    " Copy whatever is selected in visual mode
    try
        silent! let a_save = @a
        silent! normal! gv"ay
        silent! let needle = @a
    finally
        silent! let @a = a_save
    endtry

    " Remove whitespaces
    let needle = substitute(needle, "\\n\\+","","g")
    let needle = substitute(needle, "\\r\\+","","g")
    let needle = substitute(needle, "^\\s\\+\\|\\s\\+$","","g")

    if strlen(needle) &gt; 0
        execute 'call' a:func .'("'. needle . '")'
    endif
endfunction

" Wrap a normal action: call func with whatever is under the cursor
function! FG_NAction(func)
    let needle = expand("&lt;cword&gt;")
    if strlen(needle) &gt; 0
        execute 'call' a:func .'("'. needle . '")'
    endif
endfunction
```

Integrating any new command into our plugin is now trivial. Let's do it for grep and for find:

```ruby
" Wrap a find command: search for file "needle", show results in a new window
function! FG_DoFindFile(needle)
    let cmd = 'find -type f -iname "*' . a:needle . '*"'
    call FG_EvalSysCmdInNewBuff(cmd)
endfunction

" Wrap a grep command: search for needle, show results in a new window
function! FG_DoSearchText(needle)
    let cmd = 'grep -nri "' . a:needle . '" *'
    call FG_EvalSysCmdInNewBuff(cmd)
endfunction
```

Then just add a few key bindings and you're good to go:

```ruby
gt;f :call FG_NAction("FG_DoFindFile")&lt;CR&gt;
vmap &lt;leader&gt;f :call FG_VAction("FG_DoFindFile")&lt;CR&gt;
map  &lt;leader&gt;S :call FG_RequestInputAction("Text search: ", "FG_DoSearchText")&lt;CR&gt;

nmap &lt;leader&gt;s :call FG_NAction("FG_DoSearchText")&lt;CR&gt;
vmap &lt;leader&gt;s :call FG_VAction("FG_DoSearchText")&lt;CR&gt;
map  &lt;leader&gt;F :call FG_RequestInputAction("Find file: ", "FG_DoFindFile")&lt;CR&gt;
```

This is an actual plugin I use in my Vim setup. You can grab the [latest version from my Github repo.](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/findgrep.vim)

Extra tip: add these too if you want to have a [GUI menu](/blog_md/2015/0402_VimTipIwantmoremenus.md) for your new commands as well.

```ruby
menu Project.Find\ File :call FG_RequestInputAction("FG_DoFindFile")
menu Project.Text\ Search :call FG_RequestInputAction("FG_DoSearchText")
```

---

Simple vim plugin II: a psychic project greper
----------------------------------------------

We have been working on a quick grep integration for Vim, and it's looking decent enough for a quick plugin. There's one more easy thing we can improve, though: let's make it psychic! So far we had to tell grep what to look for, either by selecting the text in visual mode or by actually typing the search terms. Typing! That's so old fashioned. Let's make grep guess what to look for.

In vim you have a psychic function, expand(""). If you call expand(""), it will return whatever word is under the cursor. No need to visually select it. If you're still using the same vimrc definitions, you can do something like

```ruby
nmap s :call FG\_DoSearch(expand(""))
```

Let's clean things up a little bit:

```ruby
" Wrap a grep command: search for needle, show results in a new window
function! FG_DoSearch(needle)
    let grepbin = 'grep -nri '

    tabnew
    setlocal buftype=nofile bufhidden=wipe nobuflisted noswapfile nowrap
    let cmd = grepbin . ' "' . a:needle . '" *'
    echom cmd
    execute '$read !' . cmd
    setlocal nomodifiable
endfunction

" Wrap a normal action: ask the user for input, then call func with it
function! FG_RequestInputAction(msg, func)
    let needle = input(a:msg)
    if strlen(needle) > 0
        execute 'call' a:func .'("'. needle . '")'
    endif
endfunction

" Wrap a visual action: call func with whatever is selected under the cursor
function! FG_VAction(func)
    " Copy whatever is selected in visual mode
    try
        silent! let a_save = @a
        silent! normal! gv"ay
        silent! let needle = @a
    finally
        silent! let @a = a_save
    endtry

    " Remove whitespaces
    let needle = substitute(needle, "\\n\\+","","g")
    let needle = substitute(needle, "\\r\\+","","g")
    let needle = substitute(needle, "^\\s\\+\\|\\s\\+$","","g")

    if strlen(needle) > 0
        execute 'call' a:func .'("'. needle . '")'
    endif
endfunction

" Wrap a normal action: call func with whatever is under the cursor
function! FG_NAction(func)
    let needle = expand("<cword>")
    if strlen(needle) > 0
        execute 'call' a:func .'("'. needle . '")'
    endif
endfunction

nmap <leader>s :call FG_NAction("FG_DoSearchText")<CR>
vmap <leader>s :call FG_VAction("FG_DoSearchText")<CR>
map  <leader>S :call FG_RequestInputAction("Text search: ", "FG_DoSearchText")<CR>
```

Just copy paste that in your vimrc, now you can grep your project in three different ways: press s (,s) to look for the word currently under the cursor, S to type in a search term or select something in visual mode, then S to grep it.

---

Simple vim plugin III: a polymorphic project greper
---------------------------------------------------

We've recently seen a very basic function to integrate grep to vim. We can improve it a little bit with very simple changes. Using this tip to have [different key binding for different modes](/blog_md/2015/0602_Vimtippolymorphickeybindings.md) we can do something a bit smarter . Let's create two functions, one for normal mode that should prompt the user what to search for, and another function to automagically pick whatever is selected:

```ruby
function! FG_DoSearch(needle)
    let grepbin = 'grep -nri '

    tabnew
    setlocal buftype=nofile bufhidden=wipe nobuflisted noswapfile nowrap
    let cmd = grepbin . ' "' . a:needle . '" *'
    execute '$read !' . cmd
    setlocal nomodifiable
endfunction

function! FG_Search()
    let needle = input("Search for: ")
    call FG_DoSearch(needle)
endfunction

function! FG_Visual_Search()
    " Copy whatever is selected in visual mode
    try
        silent! let a_save = @a
        silent! normal! gv"ay
        silent! let needle = @a
    finally
        silent! let @a = a_save
    endtry

    call FG_DoSearch(needle)
endfunction

nmap <leader>s :call FG_Search()<CR>
vmap <leader>s :call FG_Visual_Search()<CR>
```

The magic here happens in the mapping: nmap will create a mapping that's only enabled when on "normal" mode, vmap when you're in visual mode. As usual, check :help map for more details.

---

Simple vim plugin IV: project greping
-------------------------------------

I recently wrote about some of the utilities I created for my Vim setup. Using someone else's Vim scripts is not nearly as fun as writing your own, so I decided to also write a short summary on what it takes to get started writting Vim plugins. For this task, I decided to start with greping.

Greping can be improved a bit: if you do it a lot in a project, you might find it's useful to also grep the results themselves, to further refine your search. If you have your grep results in vim itself, that is trivial.

Let's start hacking something in our .vimrc file. Try this:

```ruby
function! FG_Search()
    let needle = input("Search for: ")
    tabnew
    setlocal buftype=nofile bufhidden=wipe nobuflisted noswapfile nowrap
    let grepbin = 'grep -nri '
    let cmd = grepbin . ' "' . needle . '" *'
    execute '$read !' . cmd
    setlocal nomodifiable
endfunction

map <leader>s :call FG_Search()<CR>
```

This function should be pretty clear: it will map <leader>s (in my case, ",s") to FG\_Search(). FG\_Search will prompt the user for a term to grep, then search for it executing the command. In the end the results are written to a new tab, which is declared as a temp non-modifiable buffer.

Just paste that in your .vimrc and you're good to grep.

**Extra tip**: integrate this with my fast grep cache and you have a nice and quick project search integration for vim that works even for very large projects with tools available in most default Linux installs.

