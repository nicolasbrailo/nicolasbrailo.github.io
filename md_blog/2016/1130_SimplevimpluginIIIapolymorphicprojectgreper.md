# Simple vim plugin III: a polymorphic project greper

@meta publishDatetime 2016-11-30T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/11/simple-vim-plugin-iii-polymorphic.html

We've recently seen a very basic function to integrate grep to vim. We can improve it a little bit with very simple changes. Using this tip to have [different key binding for different modes](md_blog/2015/0602_Vimtippolymorphickeybindings.md) we can do something a bit smarter . Let's create two functions, one for normal mode that should prompt the user what to search for, and another function to automagically pick whatever is selected:

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

