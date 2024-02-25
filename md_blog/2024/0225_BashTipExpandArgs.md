# Bash tip: expand args

@meta author Nico Brailovsky
@meta publishDate 2024-02-25
@meta tags Bash

If you're writing a script and it looks like this

```bash
your_bin --arg1 \
         --arg2=123 \
         --arg3=345 \
         --arg4...
```

It can get pretty ugly to maintain. Instead, try this:

```bash
many_args=(
  --arg1
  --arg2=123
  --arg3=345
  --arg4...
)

your_bin "${many_args[@]}"
```

