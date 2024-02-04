# C++ exceptions under the hood 20: running destructors while unwinding

@meta publishDatetime 2013-05-28T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/05/c-exceptions-under-hood-20-running.html

The [mini ABI version 11](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v11) we have written last time was able to handle pretty much all the basics to handle an exception: we have an (almost working) ABI capable of throwing and catching exceptions, but it is still unable to properly run destructors. That's quite important if we want to write exception safe code. With what we know about .gcc\_except\_table running destructors is a piece of cake, we only need to see a bit of assembly:

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
	.byte	0
	.byte	0

    # Action 2
	.byte	0x1
	.byte	0x7d

	.align 4
	.long	_ZTI14Fake_Exception
.LLSDATT2:
# Types table start
```

On a regular landing pad, when an action has a type index greater than 0 it means we're seeing an index to a type tables, and we can use that to know which types the catch can handle; for a type index with a value of 0 it means we are instead seeing a cleanup block and we should run it anyway. Although the landing pad can't handle the exception it will still be able to perform the cleanup that's supposed to happen while unwinding. Of course the landing pad will call \_Unwind\_Resume when the cleanup is done and that will continue the regular stack unwinding process.

I've uploaded this [latest and last version to my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v12), but there are some bad news: remember how we cheated by saying that a uleb128 == char? As soon as we start adding blocks to run destructors the .gcc\_except\_table starts to get quite big (where "big" means we have offsets over 127 bytes long) and that assumption no longer holds.

For the next version of this ABI we would have to rewrite our LSDA reading functions to read proper uleb128 code. Not a major change, but at this point we wouldn't gain much, we have already achieved our goal: a working minimal ABI capable of handling exceptions without the help of libcxxabi.

There are parts we haven't covered, like handling non-native exceptions, catching derived types or interoperability between compilers and linkers. Maybe some other time, in this rather long series of articles we already learned quite a bit about low level exception handling in C++.

