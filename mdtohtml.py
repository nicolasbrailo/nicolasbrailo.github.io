import markdown
import os
import sys

def get_all_posts(src_path):
    posts = []
    for root, dirs, files in os.walk(src_path):
        if len(files) > 0:
            posts.extend([f"{root}/{x}" for x in files if x.endswith(".md")]);
    posts.sort()
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

def build_month(out_path, year, month, posts):
    month_md = f"# Posts for {year}-{month}\n\n"
    for post in posts:
        with open(post, 'r') as fp:
            month_md += fp.read()

    prefix = f'{out_path}/{year}'
    if not os.path.exists(prefix):
        os.makedirs(prefix)
    with open(f'{prefix}/{month}.html', 'w') as fp:
        fp.write(markdown.markdown(month_md))

def build_year(post):
    pass

src_path = sys.argv[1]
dst_path = sys.argv[2]
posts = date_index(get_all_posts(src_path))
for year in posts:
    build_year(posts[year])
    for month in posts[year]:
        build_month(dst_path, year, month, posts[year][month])

