# C++ exceptions under the hood 12: and suddenly, reflexion in C++

@meta publishDatetime 2013-04-16T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/04/c-exceptions-under-hood-12-and-suddenly.html

We left our mini-ABI project ([link](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v03)) capable of throwing exceptions, and we are now working on catching them; we implemented a personality function last time which was capable of detecting and handling exceptions but it was still a bit incomplete: even though it can properly notify the stack unwinder when it should stop but our version of \_\_gxx\_personality\_v0 can't run the code inside a catch block. We learned last time how to read the LSDA, so now it's only a problem of putting all the pieces together to read the .gcc\_except\_table from within our personality function.

Let's recap a bit: we figured out last time that our LSDA for the function which has the catch we want to run has the following call site table (that is, the following landing pads [that is, the following catch blocks]):

```c++
.local_lsda_call_site_table:
	.uleb128 .LEHB0-.LFB1
	.uleb128 .LEHE0-.LEHB0
	.uleb128 .L8-.LFB1
	.uleb128 0x1

	.uleb128 .LEHB1-.LFB1
	.uleb128 .LEHE1-.LEHB1
	.uleb128 0
	.uleb128 0

    .uleb128 .LEHB2-.LFB1
	.uleb128 .LEHE2-.LEHB2
	.uleb128 .L9-.LFB1
	.uleb128 0
.local_lsda_call_site_table_end:
```

All those labels can be mapped to different places in the assembly of our function, but it's a bit too messy for a blog post (I do recommend you to disassemble the function yourself and try to match each label, a lot can be learned from doing it). Also, thanks to some random Internet page, we learned the format for this table.

Let's do something like this to see if we're on the right track (beware of read-alignment issues and keep in mind that defining CFI structures like this will only work for uint8's and is probably not portable):

```c++
struct LSDA_Header {
    uint8_t lsda_start_encoding;
    uint8_t lsda_type_encoding;
    uint8_t lsda_call_site_table_length;
};

struct LSDA_Call_Site_Header {
    uint8_t encoding;
    uint8_t length;
};

struct LSDA_Call_Site {
    LSDA_Call_Site(const uint8_t *ptr) {
        cs_start = ptr[0];
        cs_len = ptr[1];
        cs_lp = ptr[2];
        cs_action = ptr[3];
    }

    uint8_t cs_start;
    uint8_t cs_len;
    uint8_t cs_lp;
    uint8_t cs_action;
};

_Unwind_Reason_Code __gxx_personality_v0 (
                     int version, _Unwind_Action actions, uint64_t exceptionClass,
                     _Unwind_Exception* unwind_exception, _Unwind_Context* context)
{
    if (actions &amp; _UA_SEARCH_PHASE)
    {
        printf("Personality function, lookup phase\n");
        return _URC_HANDLER_FOUND;
    } else if (actions &amp; _UA_CLEANUP_PHASE) {
        printf("Personality function, cleanup\n");

        const uint8_t* lsda = (const uint8_t*)
                                    _Unwind_GetLanguageSpecificData(context);

        LSDA_Header *header = (LSDA_Header*)(lsda);
        LSDA_Call_Site_Header *cs_header = (LSDA_Call_Site_Header*)
                                                (lsda + sizeof(LSDA_Header));

        size_t cs_in_table = cs_header-&gt;length / sizeof(LSDA_Call_Site);

        // We must declare cs_table_base as uint8, otherwise we risk an
        // unaligned access
        const uint8_t *cs_table_base = lsda + sizeof(LSDA_Header)
                                            + sizeof(LSDA_Call_Site_Header);

        // Go through every entry on the call site table
        for (size_t i=0; i &lt; cs_in_table; ++i)
        {
            const uint8_t *offset = &amp;cs_table_base[i * sizeof(LSDA_Call_Site)];
            LSDA_Call_Site cs(offset);
            printf("Found a CS:\n");
            printf("\tcs_start: %i\n", cs.cs_start);
            printf("\tcs_len: %i\n", cs.cs_len);
            printf("\tcs_lp: %i\n", cs.cs_lp);
            printf("\tcs_action: %i\n", cs.cs_action);
        }

        uintptr_t ip = _Unwind_GetIP(context);
        uintptr_t funcStart = _Unwind_GetRegionStart(context);
        uintptr_t ipOffset = ip - funcStart;

        return _URC_INSTALL_CONTEXT;
    } else {
        printf("Personality function, error\n");
        return _URC_FATAL_PHASE1_ERROR;
    }
}
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v05).

As you can see if you run this code, all entries in the call site table are relative. Relative to what? To the start of function. That means that if we want to get the EIP for a specific landing pad all we have to do is \_Unwind\_GetRegionStart + LSDA\_Call\_Site.cs\_lp!

We should now be able to solve our exceptional problem: let's try to modify our personality function to run the correct landing pad. We'll now need to use another \_Unwind\_ function to specify where we want to resume execution: \_Unwind\_SetIP. Let's change the personality function again to run the first landing pad available, which by inspecting the assembly we already know is the one we want:

```c++
        ...
        const uint8_t *cs_table_base = lsda + sizeof(LSDA_Header)
                                            + sizeof(LSDA_Call_Site_Header);
        for (size_t i=0; i &lt; cs_in_table; ++i)
        {
            const uint8_t *offset = &amp;cs_table_base[i * sizeof(LSDA_Call_Site)];
            LSDA_Call_Site cs(offset);

            if (cs.cs_lp)
            {
                uintptr_t func_start = _Unwind_GetRegionStart(context);
                _Unwind_SetIP(context, func_start + cs.cs_lp);
                break;
            }
        }

        return _URC_INSTALL_CONTEXT;
```

Try to run it, and watch a beautiful infinite loop. Can you guess what went wrong? The answer on the next article.

