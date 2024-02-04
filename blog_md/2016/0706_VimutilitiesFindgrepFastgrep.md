# Vim utilities: Findgrep & Fastgrep

@meta publishDatetime 2016-07-06T01:00:00.010+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/07/vim-utilities-findgrep-fastgrep.html

I spent some time writing utility scripts for my Vim setup. I figured I can share them here, someone may even find them useful or at least get a laugh out of it. Last time I presented "Impl switcher", and "Better Tab New" before that. Today it's Findgrep & Fastgrep's turn.

I [wrote about Fastgrep a long time ago](/blog_md/2012/1030_Fastgrepacacheforgrep.md). The idea behind it is to speed up the slowest part in a grep command, the disk seek time, by creating a huge blob file with all the files in a project concatenated.

Fastgrep works great. But it requires a context switch, going from your IDE to your console just to grep. Findgrep fills the gap between the IDE and the command line: this utility provides a few key bindings to let you quickly run some common commands, like searching for a selected string or finding a file in the project directory.

You can get [Fastgrep here](https://github.com/nicolasbrailo/Nico.rc/blob/master/fastgrep.sh). [Findgrep is available in Github](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/findgrep.vim), and you can easily replace Fastgrep with normal grep if you need to.

