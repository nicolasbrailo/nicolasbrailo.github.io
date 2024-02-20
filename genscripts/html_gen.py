import sys
import re
import os

from helpers import get_all_mds

def get_md_convert_rules(html_gen_dest, md_srcs):
    if len(md_srcs) == 0:
        print("No md sources in argv")
        exit(1)

    md_files = {}
    for md_src in md_srcs:
        if not os.path.exists(md_src):
            print(f"md src {md_src} doesn't exist")
            exit(1)

        for md_path in get_all_mds(md_src):
            html_path = md_path
            html_path = re.sub('.md$', '.html', html_path)
            html_path = re.sub(f'^{md_src}/', f'{html_gen_dest}/', html_path)
            md_files[md_path] = html_path
    return md_files


def normalize_rel_links(md_src, md):
    md_links = re.findall(']\\(.*\.md\\)', md)
    md_links = [x[2:-1] for x in set(md_links)]
    for md_link in md_links:
        if not os.path.exists(md_link):
            print(f'Failed relative link normalization: md file {md_src} links to non-existent file {md_link}')
            exit(1)
        if md_link.startswith('/'):
            pass
        elif md_link.startswith('http://'):
            pass
        elif md_link.startswith('https://'):
            pass
        else:
            md = md.replace(md_link, f'/{md_link}')
    return md


HTML_GEN_DEST = sys.argv[1]
MD_SRCS = sys.argv[2:]
md_rules = get_md_convert_rules(HTML_GEN_DEST, MD_SRCS)

for md_path, html_path in md_rules.items():
    print(md_path, " -> ", html_path)
    with open(md_path, 'r') as fp:
        md = fp.read()

    md = normalize_rel_links(md_path, md)
    html = md

    tgt_dir = os.path.dirname(html_path)
    if not os.path.exists(tgt_dir):
        os.makedirs(tgt_dir)
    with open(html_path, 'w') as fp:
        fp.write(html)

