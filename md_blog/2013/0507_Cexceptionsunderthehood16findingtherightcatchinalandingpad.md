# C++ exceptions under the hood 16: finding the right catch in a landing

@meta publishDatetime 2013-05-07T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/05/c-exceptions-under-hood-16-finding.html

16th chapter on our quest to implement a mini-ABI capable of handling exceptions; last time we implemented our personality function so it would be able to handle functions with more than one landing pad. We are now trying to make it recognize whether a certain landing pad can handle a specific exception, so we can use the exception specification on the catch statement.

Of course, to know whether a landing pad can handle a throw is a difficult task. Would you expect anything else? The biggest problems to overcome right now will be:

* First and foremost: how can we find the accepted types for a catch block?
* Assuming we can find the types for a catch, how can we handle a catch(...)?
* For a landing pad with multiple catch statements, how can we know all possibly catch types?
* Take the following example. Not only we'll have to check whether the landing pad accepts the current exception, we'll have to check if it accepts any of the current exception's parents!

```c++

struct Base {};
struct Child : public Base {};
void foo() { throw Child; }

void bar()
{
    try { foo(); }
    catch(const Base&){ ... }
}
```

To make our work a bit easier let's say for now we work only with landing pads that have a single catch and no inheritance exists on our program. Still, how do we find out the accepted types for a landing pad?

Turns there is a place in .gcc\_except\_table we haven't analyzed yet: the action table. Let's dissasemble our throw.cpp object and see what's in there, right after the call site table is finished, for our "try but don't catch" function:

Note: You can download the full sourcecode for this project [in my github repo](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v07).

```
.LLSDACSE1:
	.byte	0x1
	.byte	0
	.align 4
	.long	_ZTI14Fake_Exception
.LLSDATT1:
```

Doesn't look like much, but there's a promising pointer (both a proverbial and a real pointer) to something that has our exception's name. Let's go to the definition of \_ZTI14Fake\_Exception:

```
_ZTI14Fake_Exception:
	.long	_ZTVN10__cxxabiv117__class_type_infoE+8
	.long	_ZTS14Fake_Exception
	.weak	_ZTS9Exception
	.section	.rodata._ZTS9Exception,"aG",@progbits,_ZTS9Exception,comdat
	.type	_ZTS9Exception, @object
	.size	_ZTS9Exception, 11
```

And we reached something very interesting. Can you recognize it? This is the std::type\_info for struct Fake\_Exception!

Now we know there is indeed a way to get a pointer to some kind of reflexion information for our exception. Can we programmatically find it? We'll see next time.

