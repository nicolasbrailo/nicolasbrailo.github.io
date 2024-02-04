# C++ exceptions under the hood 14: multiple landing pads &amp; the teachings
of the guru

@meta publishDatetime 2013-04-23T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/04/c-exceptions-under-hood-14-multiple.html

After a lot of hard work, last time we finally got a working personality function capable of handling exceptions without help of libstdc++. It will indiscriminately handle all exceptions, but it does work. There is a big question we haven't answered yet: if we go back to the LSDA (language specific data area) we'll see something like this:

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

There are 3 landing pads defined there, even though we wrote a single try/catch statement. What is going on there?

If you read carefully the last entry on this topic maybe you noticed I added some comments to the definition of struct LSDA\_CS:

```c++
struct LSDA_CS {
    // Note start, len and lp would be void*&#x27;s, but they are actually relative
    // addresses: start and lp are relative to the start of the function, len
    // is relative to start

    // Offset into function from which we could handle a throw
    uint8_t start;
    // Length of the block that might throw
    uint8_t len;
    // Landing pad
    uint8_t lp;
    // Offset into action table + 1 (0 means no action)
    // Used to run destructors
    uint8_t action;
};
```

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v06).

Something very interesting is going on here, but lets first analyze this struct field by field with the following example:

```c++
void foo() {
    L0:
        try {
            do_something();
    L1:
        } catch (const Exception1&amp; ex) {
            ...
        } catch (const Exception2&amp; ex) {
            ...
        } catch (const ExceptionN&amp; ex) {
            ...
        } catch (...) {
        }
    L2:
}
```

* lp: the offset from the start of the function where the landing pad starts. The value of lp for the following example would be L1 - addr\_of(foo)
* action: an offset into an action table. This is used to run the cleanup actions while unwinding the stack. We haven't reached this point yet, we can ignore it for now.
* start: the offset from the start of the function where the try block begins: in the example this would be L0 - addr\_of(foo)
* len: the length of the try block. On the example this would be L1 - L0

The interesting fields now are start and len: in a function with multiple try/catch blocks we can know whether we should handle an exception by checking if the instruction pointer for the current frame is between start and start + len.

That solves the mystery of how a function with multiple try/catch blocks can handle an exception but we still have another question: why are there three call sites when we only specified a single landing pad? The other three are places where an exception might be thrown so they get added as a possible place for cleanup actions or landing pads. If we learned anything from GOTW it should be that exceptions can be thrown in the places we least expect. There is an entry in the call site table for our throw because it's a block that might throw; the compiler also detected another three.

Now that we know what the start and len fields do, let's change our personality function so the correct landing pad can handle the exception being thrown. Go ahead. My implementation for the next time.

