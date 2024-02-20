# vimrc: Vim startup file

@meta publishDatetime 2009-06-11T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/06/vimrc-vim-startup-file.html

I usually create a partition for /home, so whenever I decide to foobar my OS (i.e. do a kernel update on Ubuntu, or start playing with compiz too much) there's no need to copy my home folder to another disk and back again. Regardless of this, there are some essential files which I'd be dead without. One of these is my .vimrc, the startup file for Vim.

My .vimrc file has been organically growing since I started using this editor, a couple of years ago, so I've decided to clean it up a little bit and post it here, just to be sure I won't be loosing it. It's got some tweaks to use Vim as an IDE, feel free to download it and change it or use it anyway you want.

```c++
colorscheme torte
set nocompatible
syntax on
set ruler
set number
set hls     " Highlight search results
set showmatch " Show matching () {} []
set wildmode=list:longest,full  " Use tab-completition
set mouse=a       " Always use the mouse
" Set the working directory to the directory of the current file.
autocmd BufEnter * lcd %:p:h

" Allow movement to another buffer without saving the current one
set hidden

" *********** Text formatting *************
set nowrap
set beautify
set shiftwidth=3
set tabstop=3

filetype on
filetype plugin indent on
" *********** Search &amp; replace *************
set ignorecase " case insensitive
set smartcase " case insensitive only if there is no uppercase
set incsearch " incremental seach
set gdefault " default to /g on replace

" Load matchit (% to bounce from do to end, etc.)
runtime! macros/matchit.vim

augroup myfiletypes
 " Clear old autocmds in group
 autocmd!
 " autoindent with two spaces, always expand tabs
  autocmd FileType ruby,eruby,yaml set ai sw=2 sts=2 et
augroup END

" display the current mode and partially-typed commands in the status line:
set showmode
set showcmd

set autoindent
set smartindent
" Show an error window (if there are errors)
cwindow

" *********** Mappings *************
" Ctrl-t: Write tabnew (wait for filename and )
map  :tabnew
" Alt-R: Exec current file as script
map  :!.%
" Ctrl-Alt-R
map  :tabnew:make
" Spellcheck
map  :!ispell -x %:e!
" Comment a line
map  0i//
map  0xxx

" Build for a LaTeX file (assumes correct path and makefile)
autocmd filetype tex map  :w:make

" Automatic closing
kets
inoremap do{ do{}while();O
inoremap do{ do{}while();O
inoremap { {}O

```

