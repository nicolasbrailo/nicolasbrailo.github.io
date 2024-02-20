# Binary portability in Linux

@meta publishDatetime 2010-06-15T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/binary-portability-in-linux.html

An interesting topic for a change: is Linux binary portable? That is, can we take a binary file and be sure it'll run in any other Linux system? What happens if we broaden that to any POSIX system, will it blend? Eh, I mean, will it run?
Doing some research on the subject I wrote down a list of the thought process which led my to an (inconclusive) answer:

1. First we should define what a binary is for us: When we talk about a binary we are usually thinking about a compiled binary file, not an interpreted script file like Ruby or Python. Those are for people who like things to actually work, so let's focus on a compiled executable file, like a C/C++ application.
 - Defining compiled file: What could it be other than a sequence of bytes the microprocessor can understand? Yes, that's right, it's sort of interpreted code, only there's electronics behind, not more code. This brings us to the first interesting conclusion: the executable must be (leaving emulators aside) compatible with the architecture you're on. Running Sparc? Well then, the binary better be compiled for Sparc because otherwise to the uP will not make any sense.
 - Format: as any other thing, a binary file must have a format. That is a standard which defines the structure the file will follow. ELF is the binary format for Linux and it's quite standard. Of course, if the binary format is a standard then we should get perfect portability between different platforms running on equal architecture. Unfortunately that's not the case.
 - (Cont'd) Why don't we? The binary depends not only on compile time "stuff" but a loading time linking occurs: the executable binary will get linked with the system files like glibc, or any other dependency on a shared library it may have.

So, what are the keypoints for Linux binary portability? Architecture, binary format and system libraries.

Of course, making the executable run is only part of the equation, as running and segfaulting on the spot is not so nice either. For this last part you'll have to closely follow the standards defined by POSIX for paths and stuff like that.

### Epilogue

As an epilogue, we could add that Windows binary compatibility tends to be great. Running binaries from 12 years back is no small feat, yet this leads to a whole lot of other problems: an incredible complex loader, security bugs, backwards compatibility headaches, et al. [The old new thing](http://blogs.msdn.com/oldnewthing/) is a great source of information for this topics, I'm quite illiterate about Windows binaries nowdays :)

### Followup links

* <http://evanjones.ca/portable-linux-binaries.html>
* <http://autopackage.org/docs/devguide/ch07.html> (I swear this one was working when I wrote this text... a year ago)

