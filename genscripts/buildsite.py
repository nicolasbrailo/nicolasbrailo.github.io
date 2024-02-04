from mdtohtml import build_anchor_for_title, apply_template, MdToHtml

from datetime import datetime
import os
import re
import sys


BLOG_HEADER = """
# Blog title

# Menu
* [Home](/)
* [Blog](/blog/index.html)
* [History](/blog/history.html)

"""

POSTS_IN_INDEX = 10
BLOG_INDEX_TMPL = BLOG_HEADER + """

{{content}}

---

Blog built @ {{generatedDate}}

"""

POSTS_IDX_TMPL = """
# Posts for {{datePeriod}}

{{postsIdx}}


"""

POST_TMPL = """
# {{title}}

By {{author}} @ {{publishDate}}

{{content}}

---
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
    root_pages = []
    for root, dirs, files in os.walk(src_path):
        if len(files) > 0:
            files_here = [f"{root}/{x}" for x in files if x.endswith(".md")]
            if root == src_path:
                root_pages.extend(files_here)
            else:
                posts.extend(files_here);
    posts.sort(reverse=True)
    return posts, root_pages

def date_index(src_path, posts):
    idx = {}
    for p in posts:
        try:
            year = int(p[len(src_path):len(src_path) + 4])
            year_start_pos = len(src_path) + len('1999') + len('/')
            month = int(p[year_start_pos : year_start_pos + 2])
            if year not in idx:
                idx[year] = {}
            if month not in idx[year]:
                idx[year][month] = []
            idx[year][month].append(p)
        except:
            print("FAIL PARSING " + p)
            raise
    return idx

def read_post_md_file(fpath):
    with open(fpath, 'r') as fp:
        post_txt = fp.read()

    # Extract title out of post (needs to be the first line)
    # eg: '## foo bar\n'
    title = post_txt[post_txt.find(' '):post_txt.find('\n')]
    post_txt = post_txt[post_txt.find('\n')+1:]

    pre_procd = POST_TMPL.replace('{{content}}', post_txt)
    txt = apply_template(pre_procd, {'title': title})
    return txt, title

def build_month(mdconvert, out_path, year, month, posts):
    post_titles = []
    post_idx = ""
    for post in posts:
        content, title = read_post_md_file(post)
        post_titles.append(title)
        post_idx += content

    month_md = apply_template(BLOG_HEADER + POSTS_IDX_TMPL, {
        'datePeriod': f'{year} {month_num_str(month)}',
        'year': year,
        'month': month,
        'postsIdx': post_idx,
    })

    fpath = f'{out_path}/{year}/{month}.html'
    mdconvert.write_file(fpath, month_md)
    return (fpath, post_titles)

def build_year_md(link_base, year, month_idxs, include_header=True):
    post_idx = []
    for (month, p, post_titles) in month_idxs:
        post_idx.append(f' * [{month_num_str(month)}]({link_base}{month}.html)')
        for pt in post_titles:
            anchor = build_anchor_for_title(pt)
            post_idx.append(f'    * [{pt}]({link_base}{month}.html#{anchor})\n')

    tmpl = BLOG_HEADER + POSTS_IDX_TMPL if include_header else POSTS_IDX_TMPL
    return apply_template(tmpl, {
        'datePeriod': year,
        'year': year,
        'postsIdx': '\n'.join(post_idx),
    })


def build_history_md(year_idx):
    year_lst = []
    for year, idx_path, months_idx in year_idx:
        year_lst.append(f'# All [posts for year {year}](../{idx_path})')
        # Skip lines until title
        for ln in build_year_md(f'{year}/', year, months_idx, False).split('\n')[2:]:
            if len(ln) > 0 and ln[0] == '#':
                year_lst.append('#' + ln)
            #elif re.match(r' {4,}.*', ln):
            #    year_lst.append('    ' + ln)
            else:
                year_lst.append(ln)

    return apply_template(POSTS_IDX_TMPL, {
        'datePeriod': 'the entire history of this site',
        'postsIdx': '\n'.join(year_lst),
    })



def build_index_md(posts):
    BLOG_INDEX_TMPL
    txt = []
    for post_fn in posts[0:POSTS_IN_INDEX]:
        content, title = read_post_md_file(post_fn)
        txt.append(content)

    return apply_template(BLOG_INDEX_TMPL, {
                'generatedDate': datetime.now().strftime('%Y-%m-%d'),
                'content': ('\n').join(txt),
           })


def rebuild_history(mdconvert, dst_path, date_indexed_posts):
    year_idx = []
    for year in date_indexed_posts:
        month_idx = []
        for month in date_indexed_posts[year]:
            fpath, post_titles = build_month(mdconvert, dst_path, year, month, date_indexed_posts[year][month])
            month_idx.append((month, fpath, post_titles))

        year_idx_path = f'{dst_path}/{year}/index.html'
        mdconvert.write_file(year_idx_path, build_year_md('', year, month_idx))
        year_idx.append((year, year_idx_path, month_idx))

    mdconvert.write_file('history.html', build_history_md(year_idx))


src_path = sys.argv[1]
dst_path = sys.argv[2]
mode = sys.argv[3]

mdconvert = MdToHtml(src_path, dst_path)

if mode == 'index':
    build_index = True
    build_history = False
    build_individual_pages = False
if mode == 'full':
    build_index = True
    build_history = True
    build_individual_pages = True


if src_path[:-1] != '/':
    src_path = f'{src_path}/'
all_posts, root_pages  = get_all_posts(src_path)


if build_individual_pages:
    for p in all_posts:
        mdconvert.read_md_write_html(p)

if build_index:
    mdconvert.write_file('index.html', build_index_md(all_posts))
    for p in root_pages:
        mdconvert.read_md_write_html(p)

if build_history:
    date_indexed_posts = date_index(src_path, all_posts)
    rebuild_history(mdconvert, dst_path, date_indexed_posts)

