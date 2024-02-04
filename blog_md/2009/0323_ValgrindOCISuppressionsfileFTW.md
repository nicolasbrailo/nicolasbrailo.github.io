# Valgrind - OCI: Suppressions file FTW!

@meta publishDatetime 2009-03-23T11:25:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/03/valgrind-oci-suppressions-file-ftw.html

**Update:** [There's a new Valgrind suppressions file @ this link.](/blog_md/2010/0219_ValgrindOCISuppressionsfileTakeII.md)

Working [1] on a C++ project with Oracle I found that Valgrind reported lots of warnings related to OCI, for which, regardless of being false positives [2] or not, there's little I can do about (other than migrating to MySQL, that is). As the error report kept growing I found that Valgrind will refuse to keep track of new errors after a million or so:

> More than 1000000 errors detected. I'm not reporting any more. Final error counts may be inaccurate. Go fix your program!

The solution in this case is a [suppresions file](http://valgrind.org/docs/manual/manual-core.html#manual-core.suppress) for Valgrind. After spending a good deal of time unsuccsesfuly trying to get one I had to do it myself and upload it for the next one to run into this problem:

Link to the file: [Valgrind / OCI suppressions](/brokenlink/2009/03/valgrind_suppressions).

* Working at [Intraway](http://www.intraway.com/) :)
* False positives are quite likely when compiling with -O2. See [Valgrind FTW.](/blog_md/2009/0302_ValgrindFTW.md)


---
## In reply to [this post](), [Mattias]() commented @ 2009-04-02T08:17:41.000+02:00:

Great work, just what I'm looking for - but where is the file? (the link seems broken)

Original [published here](/blog_md/2009/0323_ValgrindOCISuppressionsfileFTW.md).

---
## In reply to [this post](), [nico](/blog_md/youfoundadeadlink.md) commented @ 2009-04-03T12:06:30.000+02:00:

Should have been a temporary glitch, anyway this is the file:

{
 OCI suppression
 Memcheck:Cond
 fun:slpmloclfv
 fun:slpmloc
 fun:lpmloadpkg
 fun:lfvLoadPkg
}

{
 OCI suppression
 Memcheck:Value4
 fun:ztced\_einit
 fun:ztcedgks
 fun:ztcedi
 fun:ztcebi
 fun:ztcei
}

{
 OCI suppression
 Memcheck:Value4
 fun:ztcedecb
 fun:ztcedencbk
 fun:ztceb\_encblk
}

{
 OCI suppression
 Memcheck:Cond
 fun:CMP\_Compare
 fun:CMP\_ModularReduce
 fun:Alg\_ComputeModQ\_GHash
 fun:A\_X931RandomGenerateBytes
 fun:ztcr2rnd
}

{
 OCI suppression
 Memcheck:Cond
 fun:CMP\_BitLengthOfCMPInt
}

{
 OCI suppression
 Memcheck:Cond
 fun:CMP\_CMPIntToOctetString
}

{
 OCI suppression
 Memcheck:Cond
 fun:CMP\_OctetStringToCMPInt
}

{
 OCI suppression
 Memcheck:Cond
 fun:CMP\_SubtractInPlace
 fun:CMP\_ModularReduce
}

{
 OCI suppression
 Memcheck:Cond
 fun:ztvo5ke
 fun:kpu8lgn
 fun:kpuauthxa
}

{
 OCI suppression
 Memcheck:Value4
 fun:ztceaencbk
 fun:ztceb\_encblk
 fun:ztcebn
 fun:ztcen
}

{
 OCI suppression
 Memcheck:Value4
 fun:ztceaencbk
 fun:ztceb\_encblk
 fun:ztceb\_padding
}

{
 OCI suppression
 Memcheck:Cond
 fun:kzsrepw
 fun:kpu8lgn
 fun:kpuauthxa
}

{
 OCI suppression
 Memcheck:Value4
 fun:ztceai
 fun:ztcebi
 fun:ztcei
}

{
 OCI suppression
 Memcheck:Value4
 fun:ztucbtx
 fun:ztvo5pe
 fun:kzsrepw
}

{
 OCI suppression
 Memcheck:Value4
 fun:ztceadecbk
 fun:ztceb\_decblk
}

{
 OCI suppression
 Memcheck:Cond
 fun:ztceb\_unpadding
 fun:ztcebf
 fun:ztcef
}

{
 OCI suppression
 Memcheck:Cond
 fun:nassky
 fun:nszssk
 fun:nszssk2
}

{
 OCI suppression
 Memcheck:Cond
 fun:\_intel\_fast\_memcmp
 obj:\*
}

{
 OCI suppression
 Memcheck:Overlap
 fun:\_intel\_fast\_memcpy
 fun:kpufprow
 fun:kpufch0
 fun:kpufch
}

Original [published here](/blog_md/2009/0323_ValgrindOCISuppressionsfileFTW.md).

---
## In reply to [this post](), [Mattias]() commented @ 2009-04-03T20:57:40.000+02:00:

Thanks! Since I use x86\_64 I had to switch all the 'Value4' to 'Value8', and I also had to add a few extra suppressions (below), but after that it worked just perfectly. Nice to be able to get 0 errors for all our oracle tests ...

{
 OCI suppression - Mattias
 Memcheck:Cond
 fun:ztcedec
 fun:ztvo5ed
 fun:ztvo5ver
 fun:kpu8lgn
}

{
 OCI suppression - Mattias
 Memcheck:Cond
 fun:ztcebf
 fun:ztcef
 fun:ztcedec
 fun:ztvo5ed
}

{
 OCI auppression - Mattias
 Memcheck:Value8
 fun:ztceadecbk
 fun:ztcebn
 fun:ztcen
 fun:ztcedec
}

{
 OCI suppression - Mattias
 Memcheck:Value8
 fun:ztceaencbk
 fun:ztcebn
 fun:ztcen
 fun:ztvo5pe
}

{
 OCI suppression - Mattias
 Memcheck:Value8
 fun:ztceaencbk
 fun:ztcebn
 fun:ztcen
 fun:ztceenc
}

{
 OCI suppression - Mattias
 Memcheck:Value8
 fun:ztcedecb
 fun:ztcedencbk
 fun:ztcebn
 fun:ztcen
}

{
 OCI suppression - Mattias
 Memcheck:Cond
 fun:CMP\_ShiftRightByBits
 fun:CMP\_ModularReduce
 fun:Alg\_ComputeModQ\_GHash
 fun:A\_X931RandomGenerateBytes
}

{
 OCI suppression - Mattias
 Memcheck:Param
 write(buf)
 fun:\_\_write\_nocancel
 fun:snttwrite
 fun:nttwr
 fun:nsntwrn
 fun:nspsend
}

{
 OCI suppression - Mattias
 Memcheck:Overlap
 fun:\_vgrZU\_NONE\_\_intel\_fast\_memcpy
 fun:kpufprow
 fun:kpufch0
 fun:kpufch
 fun:OCIStmtFetch2
}

Original [published here](/blog_md/2009/0323_ValgrindOCISuppressionsfileFTW.md).

---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Valgrind – OCI: Suppressions file, Take II](blog_md/2010/0219_ValgrindOCISuppressionsfileTakeII.md) commented @ 2010-02-19T11:14:33.000+01:00:

[...] my OCI suppressions file? Well, since then I have updated it. Now it includes some more suppressions, for libnetsnmp, [...]

Original [published here](/blog_md/2009/0323_ValgrindOCISuppressionsfileFTW.md).
