import os
import re
import shutil
import sys

from helpers import apply_template, get_all_mds, read_md_doc, extract_year_month_from_path

GENSCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
POST_IN_IDX_TMPL = os.path.join(GENSCRIPT_DIR, 'templates', 'postInIndex.md.tmpl')

MAIN_IDX_HEADER = """#
@meta docType index
"""
MONTH_IDX_HEADER = """# Posts for {} {}

@meta docType index

"""
YEAR_IDX_HEADER = """# Posts for {}

@meta docType index

"""
HISTORY_IDX_HEADER = """# Posts for the entire history of this site

@meta docType index

"""

def date_index(src_path, posts):
    yr_idx = {}
    mnth_idx = {}
    for p in posts:
        year, month = extract_year_month_from_path(src_path, p)
        if year is None:
            print(f"{p} doesn't follow year/month naming standard, assuming it's not an indexable post")
        else:
            if year not in mnth_idx:
                yr_idx[year] = []
                mnth_idx[year] = {}
            if month not in mnth_idx[year]:
                mnth_idx[year][month] = []
            mnth_idx[year][month].append(p)
            yr_idx[year].append(p)
    return yr_idx, mnth_idx


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

def build_months_idx_md(tmp_gen_md, yearmonth_idx):
    for year, month_idx in yearmonth_idx.items():
        dirn = os.path.join(tmp_gen_md, str(year))
        if not os.path.exists(dirn):
            os.makedirs(dirn)
        for month, posts in month_idx.items():
            idx_path = os.path.join(dirn, f'{month}.md')
            idx_md = []
            for p in posts:
                doc = read_md_doc(p)
                idx_md.append(apply_template(POST_IN_IDX_TMPL, doc))

            md = MONTH_IDX_HEADER.format(year, month_num_str(month)) + '\n\n---\n\n'.join(idx_md)
            with open(idx_path, 'w') as fp:
                fp.write(md)

def build_year_idx_md(tmp_gen_md, yearmonth_idx):
    for year, month_idx in yearmonth_idx.items():
        dirn = os.path.join(tmp_gen_md, str(year))
        if not os.path.exists(dirn):
            os.makedirs(dirn)

        idx_md = []
        for month, posts in month_idx.items():
            month_idx_path = os.path.join(dirn, f'{month}.md')
            idx_md.append(f' * [{month_num_str(month)}]({month_idx_path})')
            for p in posts:
                doc = read_md_doc(p)
                idx_md.append(f"    * [{doc['title']}]({month_idx_path}#{doc['anchorToTile']})")

        idx_path = os.path.join(dirn, 'index.md')
        with open(idx_path, 'w') as fp:
            fp.write(YEAR_IDX_HEADER.format(year) + '\n'.join(idx_md))

def build_history(tmp_gen_md):
    idxs = []
    for root, dirs, files in os.walk(tmp_gen_md):
        # root != tmp_gen_md -> skip root/base dir, we only want files in subdirs (which correspond to year indexes)
        if len(files) > 0 and root != tmp_gen_md:
            files_here = [f"{root}/{x}" for x in files if x.endswith("index.md")]
            idxs.extend(files_here);
    idxs.sort(reverse=True)
    if len(idxs) == 0:
        print("Error: build_history needs to be called after all other year-indexes have been built")
        exit(1)

    all_idx_md = HISTORY_IDX_HEADER
    for idx_path in idxs:
        prefix_start = idx_path.find(tmp_gen_md) + len(tmp_gen_md)
        prefix_end = idx_path.find('/', prefix_start)
        year_start = prefix_end + 1
        year_end = year_start + 4
        year = int(idx_path[year_start:year_end])

        doc = read_md_doc(idx_path)
        all_idx_md += f"## [{doc['title']}]({doc['srcFile']})\n\n{doc['txt']}\n\n---\n\n"

    with open(os.path.join(tmp_gen_md, 'history.md'), 'w') as fp:
        fp.write(all_idx_md)


def paginate_docs_for_index(src_path, docs, page_count, docs_per_page):
    def should_ignore(fpath):
        # True if this post shoudn't be in the main index
        y,m = extract_year_month_from_path(src_path, fpath)
        if y is None:
            return True
        return False

    # Partition posts into pages
    pages = []
    i = 0
    while len(pages) < page_count and i < len(docs):
        this_page = []
        while len(this_page) < docs_per_page and i < len(docs):
            if not should_ignore(docs[i]):
                this_page.append(docs[i])
            i += 1
        pages.append(this_page)

    return pages

def build_main_index(tmp_gen_md, pages):
    def path_for_page(page_num):
        if page_num == 0:
            return os.path.join(tmp_gen_md, 'index.md')
        else:
            return os.path.join(tmp_gen_md, f'index{page_num}.md')

    for this_page_num, page in enumerate(pages):
        idx_path = path_for_page(this_page_num)
        mds = []
        for post_fn in page:
            doc = read_md_doc(post_fn)
            mds.append(apply_template(POST_IN_IDX_TMPL, doc))

        idx_navigation = []
        if this_page_num > 0:
            idx_navigation.append(f"[Prev]({path_for_page(this_page_num-1)})")
        if this_page_num < len(pages) - 1:
            idx_navigation.append(f"[Next]({path_for_page(this_page_num+1)})")
        mds.append('@meta extraNav ' + ' | '.join(idx_navigation))

        with open(idx_path, 'w') as fp:
            fp.write(MAIN_IDX_HEADER + "\n\n---\n\n".join(mds))

md_src = sys.argv[1]
tmp_gen_md = sys.argv[2]

if os.path.exists(tmp_gen_md):
    shutil.rmtree(tmp_gen_md)

INDEX_PAGES = 3
POSTS_PER_INDEX_PAGE = 10

docs = get_all_mds(md_src)
year_idx, month_idx = date_index(md_src, docs)
build_months_idx_md(tmp_gen_md, month_idx)
build_year_idx_md(tmp_gen_md, month_idx)
build_history(tmp_gen_md)

pages = paginate_docs_for_index(md_src, docs, INDEX_PAGES, POSTS_PER_INDEX_PAGE)
build_main_index(tmp_gen_md, pages)

