# Weak symbols to mock c-APIs with gmock/gtest

@meta publishDatetime 2020-03-15T08:00:00.002+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2020/03/weak-symbols-to-mock-c-apis-with_65.html

I recently worked with a c-style API interface which wasn't very open to mocking. The API in question looked something like this:

```c++
handle_t h = api_open();
api_foo(h, param1, param2);
api_foo2(h, 42);
api_close(h);
```

This \*almost\* looks like a C++ interface, with extra steps that make it really really hard to mock (and, thus, to test). If it were a c++ interface, it would be possible to "virtualize" the different methods from the, even if this required a bit of patching to the original library. While a c interface doesn't provide this facility, there is another feature that makes mocking such an API with gmock possible: linker weak symbols!

In the header, you can patch your target library to export its symbols like this:

```c++
handle_t api_open() __attribute__((weak));
void api_foo(handle_t h, int, float) __attribute__((weak));
void api_foo2(handle_t h, int) __attribute__((weak));
void api_close(handle_t h) __attribute__((weak));
```

The [weak attribute](https://gcc.gnu.org/onlinedocs/gcc-3.2/gcc/Function-Attributes.html) will tell the compiler to emit this symbol marked as 'w'. If you compile this library and inspect it with `nm`, you'll see the (possibly mangled) symbol name and a w next to it. In turn, this tells the linker that this symbol can be overridden.

Normally, if you define 'api\_open' in more than a single .object file, and then link them all in a single binary, you'll end up with a linker error. Something about "multiple symbol definition", which seems reasonable. If the symbols are instead marked as weak, then the compiler will simply override the symbol table with the last seen instance of that symbol.

Once all mock-able symbols are defined as week, creating a mock is "easy", albeit not necessarily pretty. Following the example:

```c++
// Mock definition
struct MockApi {
 public:
  MOCK_METHOD(handle_t, api_open, ());
  MOCK_METHOD(void, api_foo, (handle_t h, int, float));
  MOCK_METHOD(void, api_foo2, (handle_t h, int));
  MOCK_METHOD(void, api_close, (handle_t h));
};

MockApi mocked_api_instance;

// Override default symbols and forward to gtest
handle_t api_open() { return mocked_api_instance.api_open(); }
handle_t api_api_foo(handle_t h, int i) { return mocked_api_instance.api_open(h, i); }
// ...
```

Note how mocked\_api\_instance has to be a global singleton; since your test under code will probably expect to be able to call this API directly, it's necessary to rely on a global object that everyone can access - both your test and their overridden API symbols and the module under test. With all this scaffolding in place, you can now write almost-normal tests.

```c++
TEST(Foo, Bar) {
  EXPECT_CALL(mocked_api_instance, api_open).WillOnce(Return(nullptr));

  MyObject o;
  o.run_test();
}
```

This method has the (big) disadvantage of creating an invisible dependency between "mocked\_api\_instance" and the rest of the test. An out-of-order inclusion can make your test fail, unexpectedly, and people trying to write new tests will find it quite hard to understand what is going on with out some good docs. On the other hand, this technique will let you create very stable tests with few run-time dependencies, so I still believe they can add a lot of value for integration tests!

