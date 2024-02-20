# Methods and instance variables: should there be a difference?

@meta publishDatetime 2009-10-19T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/10/methods-and-instance-variables-should.html

Many times I find myself forgetting the parenthesis for a method with no arguments and a nasty compiler error. This reminds me of my Rubyst times. There's no difference between methods and instance variables in Ruby, so this:

```ruby
class Foo
  @bar
end

foo.bar = 1

```

Could be changed to

```ruby
class Foo
  @bar
  def bar=(val) @bar = val end
end

foo.bar = 1

```

and the dependant objects using the property would use the new behaviour without ever needing a change in the way bar is accessed.

In languages like C++ the parentheses are mandatory so you can have a clear difference between instance variables and methods, and between a method call and a function pointer (which should be referenced as &Foo::bar and not Foo::bar anyway).

All of this always leads to the same conclusion: closing parenthesis should not be needed!

