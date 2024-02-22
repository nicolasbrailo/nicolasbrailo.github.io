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


############################3


import sys
import re
import os

from helpers import apply_template, get_all_mds, read_md_doc

GENSCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

def get_md_convert_rules(html_gen_dest, md_srcs):
    if len(md_srcs) == 0:
        print("No md sources in argv")
        exit(1)

    md_files = []
    for md_src in md_srcs:
        if not os.path.exists(md_src):
            print(f"md src {md_src} doesn't exist")
            exit(1)

        for md_path in get_all_mds(md_src):
            html_path = md_path
            html_path = re.sub('.md$', '.html', html_path)
            html_path = re.sub(f'^{md_src}/', f'{html_gen_dest}/', html_path)
            md_files.append((md_src, md_path, html_path))
    return md_files

def htmlize_rel_links(md_srcs_path, html_dst_path, md):
    assert(html_dst_path[-1] != '/')

    # Limitations: nested links won't work. Eg md image with link: [![Label](img)](link)
    # Absolute links won't work eg [text](/blog/foo.md)
    html_links = []
    for md_src_path in md_srcs_path:
        # .*? means match non-greedy, otherwise this will be considered one link: [l1](url1) [l2](url2)
        md_links = re.findall(f']\\({md_src_path}/.*?\.md\\)', md)
        md_links = [x[2:-1] for x in set(md_links)]
        for md_link in md_links:
            link = md_link.replace(md_src_path, '')[:-len('.md')]
            assert(link[0] == '/')
            html_link = f'/{html_dst_path}{link}.html'
            # print(md_link, "->", html_link)
            md = md.replace(md_link, html_link)
    return md


HTML_GEN_DEST = sys.argv[1]
MD_SRCS = sys.argv[2:]
md_rules = get_md_convert_rules(HTML_GEN_DEST, MD_SRCS)

for md_src_dir, md_path, html_path in md_rules:
    print(md_path, " -> ", html_path)
    doc = read_md_doc(md_path)

    if doc['docType'] == 'skipHtmlGen':
        continue

    doc['txt'] = htmlize_rel_links(MD_SRCS, HTML_GEN_DEST, doc['txt'])
    doc['txt_html'] = markdowner.reset().convert(doc['txt'])
    doc['dstHtmlFile'] = f'/{html_path}'

    if doc['comments'] is not None:
        doc['comments'] = htmlize_rel_links(MD_SRCS, HTML_GEN_DEST, doc['comments'])
        doc['comments_html'] = markdowner.reset().convert(doc['comments'])
    else:
        doc['comments_html'] = None

    if doc['docType'] == 'post':
        tmpl = 'post.html'
    elif doc['docType'] == 'index':
        tmpl = 'index.html'
    elif doc['docType'] == 'notAPost':
        tmpl = 'notAPost.html'
    else:
        print(f"Unknown docType {doc['docType']}, don't know which template to use")
        exit(1)

    html = apply_template(os.path.join(GENSCRIPT_DIR, 'templates', tmpl), doc)

    tmpl = os.path.join(GENSCRIPT_DIR, 'templates', 'siteTemplate.html')
    html = apply_template(tmpl, {
                'content': html,
                'title': doc['title'],
            })

    tgt_dir = os.path.dirname(html_path)
    if not os.path.exists(tgt_dir):
        os.makedirs(tgt_dir)
    with open(html_path, 'w') as fp:
        fp.write(html)

