# Ruby: Method chaining

@meta publishDatetime 2008-10-16T02:44:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2008/10/ruby-method-chaining.html

Interesante :)

```ruby

#!/usr/bin/ruby1.8

module MethodDecorator
# Create a chain between methods:
#   Rename org_mthd to org_alias and then point it to new_mthd
# The next time org_mthd is called new_methd will be executed
def add_chain org_mthd, new_mthd, org_alias
    self.class.class_eval do
      (alias_method org_alias, org_mthd) unless method_defined? org_alias
      alias_method org_mthd, new_mthd
    end
  end

  # Extremly evil code ahead!
  def decorate method, decorator
    # Create a chain counter if it doesn't exist
    @chain_counter ||= 0
    # Use the chain counter as a method id
    i = (@chain_counter += 1)

    # Create a new method which will dispatch the call to both                                                                                                    # the original and the decorator method
    self.class.class_eval
      def chain_dispatcher#{i} *params
        #{decorator} *params
        chain_original#{i} *params                                                                                                                                  end
    EOM

    # Once the method was created, add chain
    eval "add_chain method, :chain_dispatcher#{i}, :chain_original#{i}"
  end
end

class Foo
  include MethodDecorator
  def foo; print "Hello "; end
  def bar; print "worldn"; end
  def initialize; decorate :bar, :foo; end
end

Foo.new.bar

```

Ahora si, tengo que buscar ya un plugin para código.

*Edit: Agregado el plugin para código!*

