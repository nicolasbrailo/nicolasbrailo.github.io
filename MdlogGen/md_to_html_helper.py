from markdown.blockprocessors import BlockProcessor
from markdown.extensions import Extension
from markdown.inlinepatterns import InlineProcessor
from markdown.treeprocessors import Treeprocessor
from markdown.preprocessors import Preprocessor

from helpers import build_anchor_for_title
from datetime import datetime
import html
import markdown
import os
import re
import sys
import xml.etree.ElementTree as etree


FAIL_ON_INLINE_CODEBLOCK = True


class CodeProcessor(BlockProcessor):
    def test(self, parent, block):
        return ('```' in block)

    def run(self, parent, blocks):
        original_block = blocks[0]

        tok_start = blocks[0].find('```')
        if tok_start == -1:
            raise "Something bad happened"

        tok_end = blocks[0].find('\n', tok_start)
        if tok_end == -1:
            tok_end = blocks[0].find(' ', tok_start)
        if tok_end == -1:
            tok_end = len(blocks[0])
        else:
            tok_end = tok_end + 1

        lang = blocks[0][tok_start:tok_end].replace('```', '').strip()
        if len(lang) == 0:
            lang = None

        text_before_tok = blocks[0][:tok_start]
        if len(text_before_tok.strip()) != 0:
            msg = "Bad code block: ``` seems to have been used as inline code block, please use `<code>` instead"
            if FAIL_ON_INLINE_CODEBLOCK:
                raise RuntimeError(msg)
            else:
                sys.stderr.write(f'{msg}\n')

        parsed_text_before_tok = self.parser.parseBlocks(parent, [text_before_tok])

        blocks[0] = blocks[0][tok_end:]

        # Find block with ending fence
        for block_num, block in enumerate(blocks):
            finish_here = '```' in block
            if finish_here:
                blocks_split_by_marker = block.split('```')
                block_before_marker = blocks_split_by_marker[0]
                block_after_marker = '```'.join(blocks_split_by_marker[1:])

                if (block_after_marker in ['c++', 'bash', 'ruby', 'python']):
                    # Stray lang!
                    lang = block_after_marker
                    block_after_marker = ""

                # render fenced area inside a new div
                pre = etree.SubElement(parent, 'pre')
                # pre.set('style', 'display: inline-block; border: 1px solid red;')
                code = etree.SubElement(pre, 'code')
                if lang is not None:
                    pre.set('lang', lang)
                    code.set('lang', lang)
                    code.set('class', f'language-{lang}')
                # TODO: Do I need html.escape?
                # No html parsing: self.parser.parseBlocks(pre, blocks[0:block_num + 1])
                #code.text = html.escape('\n'.join(blocks[0:block_num] + [block_before_marker]))
                code.text = '\n'.join(blocks[0:block_num] + [block_before_marker])
                # remove used blocks
                for i in range(0, block_num + 1):
                    blocks.pop(0)
                if len(block_after_marker) > 0:
                    blocks.append('\n' + block_after_marker)
                return True  # or could have had no return statement
        # No closing marker!  Restore and do nothing
        blocks[0] = original_block
        return False  # equivalent to our test() routine returning False

class Anchorize(Treeprocessor):
    def run(self, root):
        for elem in root.iter():
            if elem.tag in ['h1', 'h2', 'h3']:
                anchor = etree.SubElement(elem, 'a')
                anchor.set('name', build_anchor_for_title(elem.text))

class EscapeMoreChars(Preprocessor):
    rpls = {
        '¿': '&iquest;',
        '“': '&ldquo;',
        '”': '&rdquo;',
        '…': '&hellip;',
        ' ': '&nbsp;',
        'Ú': '&Uacute;',
        'ú': '&uacute;',
        'Ó': '&Oacute;',
        'ó': '&oacute;',
        'Í': '&Iacute;',
        'í': '&iacute;',
        'á': '&aacute;',
        'Á': '&Aacute;',
        'É': '&Eacute;',
        'é': '&eacute;',
        'ñ': '&ntilde;',
        'Ñ': '&Ntilde;',
    }
    def run(self, lines: list[str]) -> list[str]:
        for i in range(len(lines)):
            for k,v in self.rpls.items():
                lines[i] = lines[i].replace(k, v)
        return lines

markdowner = markdown.Markdown()
markdowner.parser.blockprocessors.register(CodeProcessor(markdowner.parser), 'code', 175)
markdowner.treeprocessors.register(Anchorize(markdowner), 'anchorize', 185)
markdowner.preprocessors.register(EscapeMoreChars(markdowner), 'escapemorechars', 195)

