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

    metadata['generatedDate'] = datetime.now().strftime('%Y-%m-%d')
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
    def __init__(self, src_path, dst_path, html_tmpl):
        self.src_path = src_path
        self.dst_path = dst_path
        with open(html_tmpl, 'r') as fp:
            self.html_template = fp.read()

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

        meta = extract_md_metadata(md_txt)
        try:
            html = mdtohtml(md_txt)
        except:
            print(f"Failed to convert md to html for {fpath}")
            raise

        # Convert links to local md files into html
        pattern = r'href="' + re.escape(self.link_abs_src) + r'(.*?).md"'
        repl = r'href="' + re.escape(self.link_abs_dst) + r'\1.html"'
        html = re.sub(pattern, repl, html)

        meta['md_content'] = html
        html = apply_template(self.html_template, meta)

        with open(fpath, 'w') as fp:
            fp.write(html)











############################3



import sys
import re
import os

from helpers import get_all_mds

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

def normalize_rel_links(md_src, md):
    # Limitations: nested links won't work. Eg md image with link: [![Label](img)](link)
    # .*? means match non-greedy, otherwise this will be considered one link: [l1](url1) [l2](url2)
    md_links = re.findall(']\\(.*?\.md\\)', md)
    md_links = [x[2:-1] for x in set(md_links)]
    for md_link in md_links:
        if md_link.startswith('http://') or md_link.startswith('https://'):
            continue
        if not os.path.exists(md_link):
            print(f'Failed relative link normalization: md file {md_src} links to non-existent file {md_link}')
            exit(1)
        if md_link.startswith('/'):
            pass
        else:
            md = md.replace(md_link, f'/{md_link}')
    return md

def htmlize_rel_links(md_srcs_path, html_dst_path, md):
    # Limitations: nested links won't work. Eg md image with link: [![Label](img)](link)
    md_links = []
    for md_src_path in md_srcs_path:
        # .*? means match non-greedy, otherwise this will be considered one link: [l1](url1) [l2](url2)
        md_rel_links = re.findall(f']\\({md_src_path}/.*?\.md\\)', md)
        md_links.extend([x[2:-1] for x in set(md_rel_links)])
        md_abs_links = re.findall(f']\\(/{md_src_path}/.*?\.md\\)', md)
        md_links.extend([x[3:-1] for x in set(md_abs_links)])
        # Has to be KV of linksrc -> linkds, otherwise we lose src for rpl

    for md_link in md_links:
        if md_link.startswith('http://') or md_link.startswith('https://'):
            continue
        if md_link[0] == '/':
            md_link = md_link[1:]
        link = md_link[len(f'{md_src_path}/'):-len('.md')]
        html_link = f'/{html_dst_path}/{link}.html'
        print("REPL ", md_link, html_link)
        md = md.replace(md_link, html_link)
    return md


HTML_GEN_DEST = sys.argv[1]
MD_SRCS = sys.argv[2:]
md_rules = get_md_convert_rules(HTML_GEN_DEST, MD_SRCS)

#for md_src_dir, md_path, html_path in md_rules:
md_src_dir = 'md_gen'
md_path = 'md_gen/index.md'
html_path = 'blog/index.html'
if True:
    print(md_path, " -> ", html_path)
    with open(md_path, 'r') as fp:
        md = fp.read()

    md = normalize_rel_links(md_path, md)
    md = htmlize_rel_links(MD_SRCS, HTML_GEN_DEST, md)
    html = markdowner.reset().convert(md)

    tgt_dir = os.path.dirname(html_path)
    if not os.path.exists(tgt_dir):
        os.makedirs(tgt_dir)
    with open(html_path, 'w') as fp:
        fp.write(html)

