# Simple vim plugin IV: project greping

@meta publishDatetime 2016-12-01T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/12/simple-vim-plugin-iv-project-greping.html

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

