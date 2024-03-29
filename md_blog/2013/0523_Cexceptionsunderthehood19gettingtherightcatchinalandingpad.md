# C++ exceptions under the hood 19: getting the right catch in a landing pad

@meta publishDatetime 2013-05-23T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/05/c-exceptions-under-hood-19-getting.html

19th entry about C++ exception handling: we have written a personality function that can so far, by reading the LSDA, choose the right landing pad on the right stack frame to handle a thrown exception, but it was having some difficulties finding the right catch inside a landing pad. To finally get a decently working personality function we'll need to check all the types an exception can handle by going through all the actions table in the .gcc\_except\_table.

Remember the action table? Let's check it again but this time for a try with multiple catch blocks.

```
# Call site table
.LLSDACSB2:
    # Call site 1
	.uleb128 ip_range_start
	.uleb128 ip_range_len
	.uleb128 landing_pad_ip
	.uleb128 (action_offset+1) => 0x3

    # Rest of call site table

# Action table start
.LLSDACSE2:
    # Action 1
	.byte	0x2
	.byte	0

    # Action 2
	.byte	0x1
	.byte	0x7d

	.align 4
	.long	_ZTI9Exception
	.long	_ZTI14Fake_Exception
.LLSDATT2:
# Types table start
```

If we intend to read the exceptions supported by the landing pad 1 in the example above (that LSDA is for the catchit function, by the way) we need to do something like this:

* Get the action offset from the call site table, 2: remember you'll actually read the offset plus 1, so 0 means no action.
* Go to action offset 2, get type index 1. The types table is indexed in reverse order (ie we have a pointer to its end and we need to access each element by using -1 \* index).
* Go to types\_table[-1]; you'll get a pointer to the type\_info for Fake\_Exception
* Fake\_Exception is not the current exception being thrown; get the next action offset for our current action (0x7d)
* Reading 0x7d in uleb128 will actually yield -3; from the position where we read the offset move back 3 bytes to find the next action
* Read type index 2
* Get the type\_info for Exception this time; it matches the current exception being thrown, so we can install the landing pad!

It sounds complicated because there's, again, a lot of indirection for each step but you can check the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v11).

In the link above you will also see a bonus: a change to the personality function to correctly detect and use catch(...) blocks. That's an easy change once the personality functions knows how to read the types table: a type with a null pointer (ie a position in the table that instead of a valid pointer to an std::type\_info holds null) represents a catch all block. This has an interesting side effect: a catch(T) will be able to handle only native (ie coming from C++) exceptions, whereas a catch(...) would catch also exceptions not thrown from within C++.

We finally know how exceptions are thrown, how the stack is unwinded, how a personality function selects the correct stack frame to handle an exception and how the right catch inside a landing pad is selected, but we still have on more problem to solve: running destructors. We'll change our personality function to support RAII objects next time.

