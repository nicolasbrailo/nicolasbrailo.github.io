from datetime import datetime
import re
import os


def get_all_mds(src_path):
    posts = []
    for root, dirs, files in os.walk(src_path):
        if len(files) > 0:
            files_here = [f"{root}/{x}" for x in files if x.endswith(".md")]
            posts.extend(files_here);
    posts.sort(reverse=True)
    return posts


def extract_year_month_from_path(prefix, path):
    prefix_start = path.find(prefix) + len(prefix)
    if prefix_start == -1:
        return None, None
    prefix_end = path.find('/', prefix_start)
    year_start = prefix_end + 1
    year_end = year_start + 4
    month_start = year_end + len('/')
    month_end = month_start + 2
    try:
        year = int(path[year_start:year_end])
        month = int(path[month_start:month_end])
    except:
        return None, None

    return year, month


def is_dynamic_content(prefix, path):
    y,m = extract_year_month_from_path(prefix, path)
    return y is not None


def build_anchor_for_title(title):
    return re.sub(r'[^_.a-zA-Z0-9]', '', title).lower()


def validate_rel_links(md_src, md):
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
            print(f'Found absolute path link this will break processing: md file {md_src} links to {md_link}')
            exit(1)
    return md


def read_md_doc(fpath):
    doc = {
        'docType': 'post', # Default to post, override if meta says otherwise
        'title': None,
        'anchorToTile': None,
        'txt': None,
        'comments': None,
        'extraNav': None,
        'srcFile': fpath,
        'commentCount': 0,
        'commentCountTxt': '',
        'generatedDate': datetime.now().strftime('%Y-%m-%d'),
    }

    with open(fpath, 'r') as fp:
        doc['txt'] = fp.read()

    # Extract title out of doc (needs to be the first line)
    # eg: '## foo bar\n'
    assert(doc['txt'][0] == '#'), f'Format fail for {fpath}'
    doc['title'] = doc['txt'][doc['txt'].find(' '):doc['txt'].find('\n')].strip()
    doc['txt'] = doc['txt'][doc['txt'].find('\n')+1:]
    doc['txt'] = validate_rel_links(fpath, doc['txt'])

    doc['anchorToTile'] = build_anchor_for_title(doc['title'])

    # Extract metadata
    lns = doc['txt'].split('\n')
    doc['txt'] = []
    for ln in lns:
        if ln.startswith('@meta '):
            k_i = len('@meta ')
            k_f = ln.find(' ', k_i + 1)
            key = ln[k_i:k_f]
            val = ln[k_f+1:]
            if key in doc and key not in ['docType', 'extraNav']:
                print(f"Duplicated key in {doc['srcFile']}: {key} defined twice, ignoring second definition")
                continue
            doc[key] = val
            if key == 'publishDatetime':
                try:
                    parsed_datetime = datetime.strptime(val, '%Y-%m-%dT%H:%M:%S.%f%z')
                    doc['publishDate'] = parsed_datetime.strftime('%Y-%m-%d')
                    doc['publishTime'] = parsed_datetime.strftime('%H:%M')
                except ValueError:
                    pass
        else:
            doc['txt'].append(ln)
    doc['txt'] = '\n'.join(doc['txt']).strip()

    if '# Comments' in doc['txt']:
        tmp = doc['txt'].split('# Comments')
        doc['txt'] = tmp[0]
        doc['comments'] = validate_rel_links(fpath, tmp[1])
        doc['commentCount'] = tmp[1].count('## In reply to')
        doc['commentCountTxt'] = f"| [{doc['commentCount']} comments]({doc['srcFile']})"

    return doc


TMPL_CACHE = {}
def apply_template(tmpl_fpath, repl):
    if not tmpl_fpath in TMPL_CACHE:
        with open(tmpl_fpath, 'r') as fp:
            TMPL_CACHE[tmpl_fpath] = fp.read()

    tmpl = TMPL_CACHE[tmpl_fpath]
    for key, value in repl.items():
        token = "{{" + key + "}}"
        if value is None:
            value = ''
        tmpl = tmpl.replace(token, str(value))

    if '{{' in tmpl:
        i = tmpl.find('{{')
        f = tmpl.find('}}', i)
        print(f"Failed to replace template keys at {tmpl_fpath}: missing value for {tmpl[i+2:f]}")
        exit(1)

    return tmpl

def get_html_link_from_md_rel_path(md_src_path, html_dst_path, md_link):
    link = md_link.replace(md_src_path, '')[:-len('.md')]
    assert(link[0] == '/')
    return f'/{html_dst_path}{link}.html'

