# Splitting flac and ape files in Debian / Ubuntu

@meta publishDatetime 2008-10-28T22:54:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2008/10/splitting-flac-and-ape-files-in-debian.html

I keep forgetting this one, so I'll keep it here.

What to do when you get a **cue** file with a single huge **flac** file, or even worse, an **ape** file? With the right packages it's an easy task (getting the packages right may be hard tough).

There are three parts to this problem: getting the ape file to a more user friendly format (flac), splitting it and then renaming the splitted files.
### Needed packages

```bash
wget http://members.iinet.net.au/~aidanjm/mac-3.99-u4_b3-1_i386.deb &&
    sudo dpkg -i mac-3.99-u4_b3-1_i386.deb &&
    rm -f mac-3.99-u4_b3-1_i386.deb
```

Source: [BROKENLINK](md_blog/youfoundadeadlink.md)

Now install cuetools:

```bash
  sudo apt-get install cuetools
```

### Splitting the file

```bash
  cuebreakpoints *.cue|shnsplit *.ape -o flac
```

### Renaming the splitted parts

In the cue file there should be a list of the original file names. I hacked a script to parse & rename the files from the previous step, you can get it here: [cue-rename](md_blog/youfoundadeadlink.md)

For this script to run you'll need php-cli package. Just run it in the same folder the cue file is, as any other bash script. There's a flag to get a preview instead of a complete rename; it's somewhere in the file and I don't have much plans to clean it up anytime soon. Drop me a line if you do.

