from mdtohtml import build_anchor_for_title
from mdtohtml import mdtohtml

from datetime import datetime
import os
import re
import sys


BLOG_HEADER = """
# Blog title

# Menu
* [Home](../)
* [Blog](./index.html)
* [History](./history.html)

"""

POSTS_IN_INDEX = 10
BLOG_INDEX_TMPL = BLOG_HEADER + """

{{content}}

---

Blog built @ {{generated_date}}

"""

POSTS_IDX_TMPL = BLOG_HEADER + """
# Posts for {{date_period}}

{{post_idx}}


"""


def month_num_str(m):
    return {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
    }.get(m)


def get_all_posts(src_path):
    posts = []
    for root, dirs, files in os.walk(src_path):
        if len(files) > 0:
            posts.extend([f"{root}/{x}" for x in files if x.endswith(".md")]);
    posts.sort(reverse=True)
    return posts

def date_index(posts):
    idx = {}
    for p in posts:
        year = int(p[len(src_path):len(src_path) + 4])
        year_start_pos = len(src_path) + len('1999') + len('/')
        month = int(p[year_start_pos : year_start_pos + 2])
        if year not in idx:
            idx[year] = {}
        if month not in idx[year]:
            idx[year][month] = []
        idx[year][month].append(p)
    return idx

def apply_template(tmpl, repl):
    for key, value in repl.items():
        token = "{{" + key + "}}"
        tmpl = tmpl.replace(token, str(value))
    return tmpl

def write_md_to_html(fpath, md_txt):
    dirn = os.path.dirname(fpath)
    if len(dirn) > 0 and not os.path.exists(dirn):
        os.makedirs(dirn)
    with open(fpath, 'w') as fp:
        fp.write(mdtohtml(md_txt))

def build_month(out_path, year, month, posts):
    post_titles = []
    post_idx = ""
    for post in posts:
        with open(post, 'r') as fp:
            post_txt = fp.read()
            # eg: '## foo bar\n'
            title = post_txt[post_txt.find(' '):post_txt.find('\n')]
            post_titles.append(title)
            post_idx += post_txt

    month_md = apply_template(POSTS_IDX_TMPL, {
        'date_period': f'{year} {month_num_str(month)}',
        'year': year,
        'month': month,
        'post_idx': post_idx,
    })

    fpath = f'{out_path}/{year}/{month}.html'
    write_md_to_html(fpath, month_md)
    return (fpath, post_titles)

def build_year_md(link_base, year, month_idxs):
    post_idx = []
    for (month, p, post_titles) in month_idxs:
        post_idx.append(f' * [{month_num_str(month)}]({link_base}{month}.html)')
        for pt in post_titles:
            anchor = build_anchor_for_title(pt)
            post_idx.append(f'    * [{pt}]({link_base}{month}.html#{anchor})\n')

    return apply_template(POSTS_IDX_TMPL, {
        'date_period': year,
        'year': year,
        'post_idx': '\n'.join(post_idx),
    })


def build_history_md(year_idx):
    year_lst = []
    for year, idx_path, months_idx in year_idx:
        year_lst.append(f'# All [posts for year {year}](../{idx_path})')
        # Skip lines until title
        for ln in build_year_md(f'{year}/', year, months_idx).split('\n')[2:]:
            if len(ln) > 0 and ln[0] == '#':
                year_lst.append('#' + ln)
            #elif re.match(r' {4,}.*', ln):
            #    year_lst.append('    ' + ln)
            else:
                year_lst.append(ln)

    return apply_template(POSTS_IDX_TMPL, {
        'date_period': 'the entire history of this site',
        'post_idx': '\n'.join(year_lst),
    })



def build_index_md(posts):
    BLOG_INDEX_TMPL
    txt = []
    for post_fn in posts[0:POSTS_IN_INDEX]:
        with open(post_fn, 'r') as fp:
            txt.append(fp.read())

    return apply_template(BLOG_INDEX_TMPL, {
                'generated_date': datetime.now().strftime('%Y-%m-%d'),
                'content': ('\n---\n').join(txt),
           })


def rebuild_history(all_posts):
    date_indexed_posts = date_index(all_posts)

    year_idx = []
    for year in date_indexed_posts:
        month_idx = []
        for month in date_indexed_posts[year]:
            fpath, post_titles = build_month(dst_path, year, month, date_indexed_posts[year][month])
            month_idx.append((month, fpath, post_titles))

        year_idx_path = f'{dst_path}/{year}/index.html'
        write_md_to_html(year_idx_path, build_year_md('', year, month_idx))
        year_idx.append((year, year_idx_path, month_idx))

    write_md_to_html(f'{dst_path}/history.html', build_history_md(year_idx))


src_path = sys.argv[1]
dst_path = sys.argv[2]
all_posts = get_all_posts(src_path)
# rebuild_history(all_posts)
write_md_to_html(f'{dst_path}/index.html', build_index_md(all_posts))
