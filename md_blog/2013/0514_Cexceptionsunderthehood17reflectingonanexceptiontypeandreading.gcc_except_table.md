# C++ exceptions under the hood 17: reflecting on an exception type and reading .gcc_except_table

@meta publishDatetime 2013-05-14T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/05/c-exceptions-under-hood-17-reflecting.html

By now we know that when an exception is thrown we can get a lot of reflexion information by reading the local data storage area AKA .gcc\_except\_table; reading this table we have been able to implement a personality function capable of deciding which landing pad to run when an exception is thrown. We also know how to read the action table part of the LSDA, so we should be able to modify our personality function to pick the correct catch statement inside a landing pad with multiple catches.

We left our ABI implementation last time, and dedicated some time to analyze the assembly for .gcc\_except\_table to discover how can we find the types a catch can handle. We found that indeed there is a part of this table that holds a list of types where this information can be found. Let's try to read it on the cleanup phase, but first let's remember the definition for our LSDA header:

```c++
struct LSDA_Header {
    uint8_t start_encoding;
    uint8_t type_encoding;

    // This is the offset, from the end of the header, to the types table
    uint8_t type_table_offset;
};
```

That last field is new (for us): it's giving us an offset into table of types. Let's also remember the definition of each call site:

```c++
struct LSDA_CS {
    // Offset into function from which we could handle a throw
    uint8_t start;
    // Length of the block that might throw
    uint8_t len;
    // Landing pad
    uint8_t lp;
    // Offset into action table + 1 (0 means no action)
    uint8_t action;
};
```

Check that last field, "action". That gives us an offset into the action table. That means we can find the action for a specific CS. The trick here is that for landing pads where a catch exists, the action will hold an offset for the types table; we can then use the offset into the types table pointer, which we can get from the header. Quite a mouthful: let's better talk code:

```c++
// Pointer to the beginning of the raw LSDA
LSDA_ptr lsda = (uint8_t*)_Unwind_GetLanguageSpecificData(context);

// Read LSDA headerfor the LSDA
LSDA_Header header(&lsda);

const LSDA_ptr types_table_start = lsda + header.type_table_offset;

// Read the LSDA CS header
LSDA_CS_Header cs_header(&lsda);

// Calculate where the end of the LSDA CS table is
const LSDA_ptr lsda_cs_table_end = lsda + cs_header.length;

// Get the start of action tables
const LSDA_ptr action_tbl_start = lsda_cs_table_end;

// Get the first call site
LSDA_CS cs(&lsda);

// cs.action is the offset + 1; that way cs.action == 0
// means there is no associated entry in the action table
const size_t action_offset = cs.action - 1;
const LSDA_ptr action = action_tbl_start + action_offset;

// For a landing pad with a catch the action table will
// hold an index to a list of types
int type_index = action[0];

// types_table_start actually points to the end of the table, so
// we need to invert the type_index. There we'll find a ptr to
// the std::type_info for the specification in our catch
const void* catch_type_info = types_table_start[ -1 * type_index ];
const std::type_info *catch_ti = (const std::type_info *) catch_type_info;

// If everything went OK, this should print something like Fake_Exception
printf("%s\n", catch_ti->name());
```

The code looks complicated because there are several layers of indirection before actually reaching the struct type\_info, but it's not really doing anything complicated: it only reads the .gcc\_except\_table we found on the disassembly.

Printing the name of the type is already a big step in the right direction. Also, our personality function is getting a bit messy. Most of the complexity of reading the LSDA can be hidden under the rug for almost no cost at all. You can check my [implementation here](https://github.com/nicolasbrailo/cpp_exception_handling_abi/tree/master/abi_v08)
Next time we'll see if we can match our newly found type to our original exception.

