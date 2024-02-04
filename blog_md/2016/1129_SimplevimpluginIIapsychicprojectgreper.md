# Simple vim plugin II: a psychic project greper

@meta publishDatetime 2016-11-29T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/11/simple-vim-plugin-ii-psychic-project.html

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

