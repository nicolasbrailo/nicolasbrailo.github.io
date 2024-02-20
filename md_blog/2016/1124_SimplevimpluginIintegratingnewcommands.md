# Simple vim plugin I: integrating new commands

@meta publishDatetime 2016-11-24T01:00:00.006+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/11/simple-vim-plugin-i-integrating-new.html

TL;DR: [Here's some code](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/findgrep.vim) to integrate system commands into vim. You can just drop it in your vimrc, create a small wrapper function in your vimrc and configure a few key binding to make it work.

Longer version:
We can extend our quick grep integration to other commands, quite easily. Since we defined a few wrappers to request input, get it from visual mode or just guess it, we can also have a helper function to create a scratch buffer and read a system command into it:

```ruby
" Find&Grep command wrapper: execute cmd, shows the results in a scratch buffer
function! FG_EvalSysCmdInNewBuff(cmd)
    tabnew
    setlocal buftype=nofile bufhidden=wipe nobuflisted noswapfile nowrap
    execute '$read !' . a:cmd
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
gt;f :call FG_NAction("FG_DoFindFile")<CR>
vmap <leader>f :call FG_VAction("FG_DoFindFile")<CR>
map  <leader>S :call FG_RequestInputAction("Text search: ", "FG_DoSearchText")<CR>

nmap <leader>s :call FG_NAction("FG_DoSearchText")<CR>
vmap <leader>s :call FG_VAction("FG_DoSearchText")<CR>
map  <leader>F :call FG_RequestInputAction("Find file: ", "FG_DoFindFile")<CR>
```

This is an actual plugin I use in my Vim setup. You can grab the [latest version from my Github repo.](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/findgrep.vim)

Extra tip: add these too if you want to have a [GUI menu](/blog_md/2015/0402_VimTipIwantmoremenus.md) for your new commands as well.

```ruby
menu Project.Find\ File :call FG_RequestInputAction("FG_DoFindFile")
menu Project.Text\ Search :call FG_RequestInputAction("FG_DoSearchText")
```

