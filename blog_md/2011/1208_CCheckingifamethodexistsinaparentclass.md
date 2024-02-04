# C++: Checking if a method exists in a parent class

@meta publishDatetime 2011-12-08T07:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/12/c-checking-if-method-exists-in-parent.html

I like [Google test and Google mock (C++ only)](/blog_md/2009/0602_TestingampmockingC.md) a lot. These are really great tools to ensure the quality of your code. They do have one problem however, especially [when working with a legacy codebase](/blog_md/2009/1023_Retrofittingunittestsforlegacycode.md): many times you need to change a signature for a function and your tests begin to fail. Those tests shouldn't really fail, they shouldn't compile at all because you're now trying to mock a function which doesn't exists anymore.

I worked on a patch to check if a class and its parent share the same methods, but I hit some major roadblocks which I believe cannot be saved:

* You have no way of detecting if the parent's method is actually virtual. It may have the same signature, yet if it isn't virtual the mock serves no purpose
* You have no (easy) way of detecting if the method is defined in your parent's parent

Even though this code will never be useful, I thought I might as well post this here, just in case anyone comes up with a solution for those problems.

```c++
// :!g++ foo.cpp -lgtest_main -lgmock && ./a.out
#include <gtest/gtest.h>
#include <gmock/gmock.h>
using namespace testing;

/**
 * "Real" application
 */
class Foo {
	public:
	virtual int bar(int) { return 1; }
	//virtual int bar(void) { return 1; }
};

class Do {
	public:
	int something(Foo &foo){ return foo.bar(1); }
};

/**
 * Class used to compare method ptrs. We need to inherit from class C
 * to forward the calls to the derived methods.
 */
template <class C, class D>
class Mocks_Must_Exist_In : public C {
	public:
	// We don't know in the derived class the typeof the parent class
	// so we define a common name using some template magic
	typedef C ParentClass;
	// Actually we don't know our own class either
	typedef D Self;

	// Function ptr definitions are ugly so we might as well use
	// a template to hide it under the rug
	template <class F, class G>
	void mock_created_for_unexisting_method(F f, G g){ f = g; }
};

#define METHOD_EXISTS(Method)
	void defined_##Method() {
		mock_created_for_unexisting_method(&Self::Method, &ParentClass::Method);
	}

/**
 * Checked mock, shouldn't compile if Foo's interface changes
 */
class FooMock : public Mocks_Must_Exist_In< Foo, FooMock > {
	public:
	MOCK_METHOD1(bar, int(int));
	METHOD_EXISTS(bar);
};

/**
 * Unchecked mock, should compile if Foos interface changes
 */
class FooMock2 {
	public:
	MOCK_METHOD0(bar, int());
};

TEST(FooTest, ThisShouldCompile) {
	FooMock foo;
	EXPECT_CALL(foo, bar(_)).WillOnce(Return(42));
	EXPECT_EQ(42, Do().something(foo));
}

```

