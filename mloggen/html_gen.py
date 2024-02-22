import sys
import re
import os

from helpers import apply_template, get_all_mds, read_md_doc
from md_to_html_helper import markdowner

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

    tmpl = os.path.join(GENSCRIPT_DIR, 'site_design', 'siteTemplate.html')
    html = apply_template(tmpl, {
                'content': html,
                'title': doc['title'],
            })

    tgt_dir = os.path.dirname(html_path)
    if not os.path.exists(tgt_dir):
        os.makedirs(tgt_dir)
    with open(html_path, 'w') as fp:
        fp.write(html)

