# Bash script preamble

@meta publishDatetime 2021-06-27T08:00:00.001+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2021/06/bash-script-preamble.html

All background Bash scripts should start with this preamble:

>
> set -euo pipefail
> exec > ~/log.log 2>&1
>

There are countless articles explaining why, and the main purpose of this one is a reminder for myself, so I won't go into the details. For reference:

* **-e** halts the script on error
* **-u** errors when using an undefined variable
* **-o pipefail** makes pipe error return value sane
* **exec > ~/log.log 2>&1** redirect all output to ~/log.log

