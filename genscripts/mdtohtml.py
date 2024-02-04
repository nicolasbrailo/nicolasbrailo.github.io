from markdown.blockprocessors import BlockProcessor
from markdown.extensions import Extension
from markdown.inlinepatterns import InlineProcessor
from markdown.treeprocessors import Treeprocessor
from markdown.preprocessors import Preprocessor

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
                    blocks.append('\n' + block_after_marker)
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

def extract_md_metadata(md):
    metadata = {}
    for ln in md.split('\n'):
        if ln.startswith('@meta '):
            k_i = len('@meta ')
            k_f = ln.find(' ', k_i + 1)
            key = ln[k_i:k_f]
            val = ln[k_f+1:]
            if key == 'publishDatetime':
                try:
                    parsed_datetime = datetime.strptime(val, '%Y-%m-%dT%H:%M:%S.%f%z')
                    metadata['publishDate'] = parsed_datetime.strftime('%Y-%m-%d')
                    metadata['publishTime'] = parsed_datetime.strftime('%H:%M')
                except ValueError:
                    pass
            metadata[key] = val
    return metadata

def mdtohtml(md):
    content = []
    for ln in md.split('\n'):
        if not ln.startswith('@meta '):
            content.append(ln)
    return markdowner.reset().convert('\n'.join(content))

def apply_template(tmpl, repl):
    for key, value in extract_md_metadata(tmpl).items():
        token = "{{" + key + "}}"
        tmpl = tmpl.replace(token, str(value))
    for key, value in repl.items():
        token = "{{" + key + "}}"
        tmpl = tmpl.replace(token, str(value))
    return tmpl

class MdToHtml:
    def __init__(self, src_path, dst_path):
        self.src_path = src_path
        self.dst_path = dst_path

        src = self.src_path
        if src[0] == '.':
            src = src[1:]
        if src[0] != '/':
            src = '/' + src
        if src[len(src)-1] != '/':
            src = src + '/'
        self.link_abs_src = src

        dst = self.dst_path
        if dst[0] == '.':
            dst = dst[1:]
        if dst[0] != '/':
            dst = '/' + dst
        if dst[len(dst)-1] != '/':
            dst = dst + '/'
        self.link_abs_dst = dst

    def read_md_write_html(self, tmpl, mdpath):
        with open(mdpath, 'r') as fp:
            md = fp.read()
        pre_procd = tmpl.replace('{{content}}', md)
        srcFile = mdpath
        if srcFile[0] == '.':
            srcFile = srcFile[1:]
        repld = apply_template(pre_procd, {
                'generatedDate': datetime.now().strftime('%Y-%m-%d'),
                'srcFile': srcFile,
        })
        return self.write_file(mdpath, repld)

    def write_file(self, relpath, md_txt):
        if self.src_path in relpath:
            fpath = relpath.replace(self.src_path, self.dst_path).replace('.md', '.html')
        elif self.dst_path in relpath:
            fpath = relpath
        else:
            fpath = os.path.join(self.dst_path, relpath).replace('.md', '.html')
        dirn = os.path.dirname(fpath)
        if len(dirn) > 0 and not os.path.exists(dirn):
            os.makedirs(dirn)

        try:
            html = mdtohtml(md_txt)
        except:
            print(f"Failed to convert md to html for {fpath}")
            raise

        # Convert links to local md files into html
        pattern = r'href="' + re.escape(self.link_abs_src) + r'(.*?).md"'
        repl = r'href="' + re.escape(self.link_abs_dst) + r'\1.html"'
        html = re.sub(pattern, repl, html)

        with open(fpath, 'w') as fp:
            fp.write(html)

