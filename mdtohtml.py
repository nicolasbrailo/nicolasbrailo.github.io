from markdown.blockprocessors import BlockProcessor
from markdown.extensions import Extension
from markdown.inlinepatterns import InlineProcessor
from markdown.treeprocessors import Treeprocessor
import html
import re
import markdown
import xml.etree.ElementTree as etree


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

        lang = None
        has_lang = (tok_end - tok_start) != len('```')
        if has_lang:
            lang = blocks[0][tok_start + len('```'):tok_end].strip()

        text_before_tok = blocks[0][:tok_start]
        if len(text_before_tok.strip()) != 0:
            raise RuntimeError("Bad code block: ``` seems to have been used as inline code block, please use `<code>` instead")

        blocks[0] = blocks[0][tok_end:]

        # Find block with ending fence
        for block_num, block in enumerate(blocks):
            finish_here = '```' in block
            if finish_here:
                blocks_split_by_marker = block.split('```')
                block_before_marker = blocks_split_by_marker[0]
                block_after_marker = '```'.join(blocks_split_by_marker[1:])
                # render fenced area inside a new div
                e = etree.SubElement(parent, 'pre')
                e.set('style', 'display: inline-block; border: 1px solid red;')
                if lang is not None:
                    e.set('lang', lang)
                # No html parsing: self.parser.parseBlocks(e, blocks[0:block_num + 1])
                e.text = html.escape('\n'.join(blocks[0:block_num] + [block_before_marker]))
                # remove used blocks
                for i in range(0, block_num + 1):
                    blocks.pop(0)
                if len(block_after_marker) > 0:
                    blocks.append(block_after_marker)
                return True  # or could have had no return statement
        # No closing marker!  Restore and do nothing
        blocks[0] = original_block
        return False  # equivalent to our test() routine returning False

def build_anchor_for_title(title):
    return re.sub(r'[^_.a-zA-Z0-9]', '', title).lower()

class Anchorize(Treeprocessor):
    def run(self, root):
        for elem in root.iter():
            if elem.tag in ['h1', 'h2', 'h3']:
                anchor = etree.SubElement(elem, 'a')
                anchor.set('name', build_anchor_for_title(elem.text))

markdowner = markdown.Markdown()
markdowner.parser.blockprocessors.register(CodeProcessor(markdowner.parser), 'code', 175)
markdowner.treeprocessors.register(Anchorize(markdowner), 'anchorize', 185)

def mdtohtml(md):
    return markdowner.convert(md)

