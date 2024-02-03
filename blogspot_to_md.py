from markdownify import MarkdownConverter
import sys
import html
import re
import os

SAVE_TO_FILES=True

template_comment = """
---
## In reply to [this post]({{in_reply_to}}), [{{author_name}}]({{author_uri}}) commented @ {{published}}:

{{content}}

Original [published here]({{link}}).
"""

template_post = """# {{title}}

{{content}}

---

Published {{published}} by {{author_name}}

Original [published here]({{link}}).
"""


BASE_URL = 'http://monkeywritescode.blogspot.com/'

def get_md_file_for_comment_url(url):
    # Try to match a comment url to a post in md format
    if url.startswith(BASE_URL):
        url = url[len(BASE_URL):]

    try:
        year = int(url[0:4])
    except:
        pos = url.find('20')
        year = int(url[pos:pos+4])

    try:
        year_end = len('2000/')
        month = int(url[year_end:year_end+2])
    except:
        month_start = url.find(f'{year}/') + len(f'{year}/')
        month = int(url[month_start:month_start+2])

    out_path = sys.argv[2]
    candidates = []
    for root, dirs, files in os.walk(f"{out_path}/{year}"):
        for f in files:
            if f.startswith(f'{month:02d}'):
                candidates.append(f)

    url = url[len(f"{year}/{month:02d}/"):url.find('.html?')]
    stripurl = re.sub(r'[^_.a-zA-Z0-9]', '', url)
    kwds = re.split('-|_', url)
    for f in candidates:
        stripfn = f[len(f"{month:02d}MM_"):f.find('.md')].lower()
        if stripurl.lower() == stripfn.lower():
            return f'{year}/{f}'
        has_all_kwds = True
        morestripfn = re.sub(r'[^a-zA-Z0-9]', '', stripfn)
        for kwd in kwds:
            if not kwd.isdigit():
                has_all_kwds = has_all_kwds and (kwd.lower() in stripfn or kwd.lower() in morestripfn)
        if has_all_kwds:
            return f'{year}/{f}'
    return None

def guess_code_block_txt(txt):
    if 'class="c++"' in txt:
        return 'c++'
    elif 'lang="cpp"' in txt:
        return 'c++'
    elif 'class="bash"' in txt:
        return 'bash'
    elif 'lang="bash"' in txt:
        return 'bash'
    elif 'class="python"' in txt:
        return 'python'
    elif 'lang="python"' in txt:
        return 'python'
    elif 'lang="ruby"' in txt:
        return 'ruby'
    elif 'lang="sql"' in txt:
        return 'sql'
    elif 'echo' in txt or 'sudo' in txt:
        return 'bash'

    smellslikec = ['typedef', 'template <']
    if any(tok in txt for tok in smellslikec):
        return 'c++'

    return ''

def guess_code_block_lang(el):
    if el.has_attr('class'):
        el['class'][0]
    return guess_code_block_txt(str(el))


class CustomMd(MarkdownConverter):
    def convert_pre(self, el, text, convert_as_inline):
        lang = guess_code_block_lang(el)

        if not convert_as_inline:
            return f'\n```{lang}\n{text}\n```\n'

        if '&lt;br&gt;' in str(el) or '&lt;br/&gt;' in str(el):
            txt = str(el)
            txt = re.sub(r'&lt;pre.*?&gt;', '', txt)
            txt = txt.replace('&amp;', '&')
            txt = txt.replace('&lt;br&gt;', '\n')
            txt = txt.replace('&lt;br/&gt;', '\n')
            txt = txt.replace('&lt;/pre&gt;', '')
            return f'\n```{lang}\n{txt}\n```\n'

        # Unimpl
        raise 42

def parse_post_txt(txt):
    txt = txt.replace('<pre><code class="', '<pre class="')
    txt = txt.replace('</code></pre>', '</pre>')

    # Escape pre's, otherwise template<> breaks
    pre_i = 0
    while True:
        pre_i = txt.find('<pre class="', pre_i)
        match_i = pre_i
        if pre_i == -1:
            break
        pre_i = txt.find('>', pre_i) + 1
        pre_f = txt.find('</pre>', pre_i)
        match_f = pre_f + len('</pre>')
        escaped = html.escape(txt[pre_i:pre_f])

        txt = txt[0:match_i] + f'<P#R#E class="c++">{escaped}</P#R#E>' + txt[match_f:]
    txt = txt.replace('P#R#E', 'pre')

    txt = CustomMd().convert(txt)

    # Clean \n's
    lines = txt.split('\n')
    for i in range(len(lines)):
        if lines[i].strip() == '':
            lines[i] = '\n'
    while lines[0] == '\n':
        del lines[0]
    while lines[len(lines)-1] == '\n':
        del lines[len(lines)-1]
    txt = '\n'.join(lines)
    txt = re.sub(r'\n{2,}', '\n\n', txt)
    #txt = re.sub(r'\s+$', '', txt, flags=re.MULTILINE) # Remove whitespace at the end of lines
    #mdd = re.sub(r'^\s+', '', mdd, flags=re.MULTILINE) # Remove whitespace at the start of lines
    return txt

def on_post_found(post, outdirprefix):
    tmpl = template_post
    post['content'] = parse_post_txt(post['content'])
    for key, value in post.items():
        token = "{{" + key + "}}"
        tmpl = tmpl.replace(token, str(value))

    pub_yr = post['published'][0:len('2023')]
    dirpath = f"{outdirprefix}/{pub_yr}"
    pubd = post['published'][len('2023-'):len('2023-12-16')].replace('-', '')
    post_fn = f"{pubd}_{post['title']}.md"
    post_fn = f"{dirpath}/" + re.sub(r'[^_.a-zA-Z0-9]', '', post_fn)

    if SAVE_TO_FILES:
        if not os.path.exists(dirpath):
            os.makedirs(dirpath)
        with open(post_fn, 'w') as file:
            file.write(tmpl)
    else:
        print(f"# {post_fn}")
        print(tmpl)

def append_comment(comment, md_fpath, outdirprefix):
    tmpl = template_comment
    comment['content'] = parse_post_txt(comment['content'])
    for key, value in comment.items():
        token = "{{" + key + "}}"
        tmpl = tmpl.replace(token, str(value))

    if SAVE_TO_FILES:
        with open(f'{outdirprefix}/{md_fpath}', 'a') as fp:
            fp.write(tmpl)
    else:
        print(f"# Comment for {md_fpath}")
        print(tmpl)

def failed_parse_entry(post):
    sys.stderr.write('** FAIL\n\n')
    sys.stderr.write(post)


def get_text_between_tokens(text, start_token, end_token):
    """
    Retrieve the text between two tokens within a given string.

    Args:
    - text (str): The input text.
    - start_token (str): The starting token.
    - end_token (str): The ending token.

    Returns:
    - str: The text between the start and end tokens. If not found, returns an empty string.
    """
    start_index = text.find(start_token)
    if start_index == -1:
        return ""

    start_index += len(start_token)
    end_index = text.find(end_token, start_index)

    if end_index == -1:
        return ""

    return text[start_index:end_index]

def process_entry(text):
    author = get_text_between_tokens(text, '<author>', '</author>')
    post = {
        'published': get_text_between_tokens(text, '<published>', '</published>'),
        'title': get_text_between_tokens(text, '<title type=\'text\'>', '</title>'),
        'content': get_text_between_tokens(text, '<content type=\'html\'>', '</content>'),
        'link': get_text_between_tokens(text, "link rel='alternate' type='text/html' href='", "'"),
        'is_comment': 'kind#comment' in text,
        'author_name': get_text_between_tokens(author, '<name>', '</name>'),
        'author_uri': get_text_between_tokens(author, '<uri>', '</uri>'),
        'author_email': get_text_between_tokens(author, '<email>', '</email>'),
        'in_reply_to': get_text_between_tokens(author, 'thr:in-reply-to href=\'', '\''),
        # <thr:in-reply-to href='https://monkeywritescode.blogspot.com/2009/03/valgrind-oci-suppressions-file-ftw.html' ref='tag:
        # blogger.com,1999:blog-2445100342668451086.post-6334960269298604734' source='https://www.blogger.com/feeds/24451003426684510
        # 86/posts/default/6334960269298604734' type='text/html'/>
        #'original': text,
    }
    def failed(post, tag):
        if tag not in post or not post[tag] or len(post[tag].strip()) == 0:
            return True
        return False
    if failed(post, 'published') or failed(post, 'title') or failed(post, 'content'):
        failed_parse_entry(text)
        return None
    return post

def process_file(filename, outdirprefix):
    comments = []
    with open(filename, 'r') as file:
        content = file.read()
        start_token = '<entry>'
        end_token = '</entry>'
        start_index = content.find(start_token)
        while start_index != -1:
            end_index = content.find(end_token, start_index + len(start_token))
            if end_index != -1:
                entry_content = content[start_index + len(start_token):end_index]
                post = process_entry(entry_content.strip())
                if post is not None:
                    if post['is_comment']:
                        comments.append(post)
                    else:
                        on_post_found(post, outdirprefix)
                start_index = content.find(start_token, end_index + len(end_token))
            else:
                break

    for com in comments:
        com_url = com['in_reply_to'] if len(com['in_reply_to']) > 0 else com['link']
        try:
            md_fpath = get_md_file_for_comment_url(com_url)
        except:
            sys.stderr.write(f'** Cant parse comment{com}\n\n')
            continue
        if md_fpath is None:
            sys.stderr.write(f'** Failed to match to an md file {com_url}\n\n')
        else:
            append_comment(com, md_fpath, outdirprefix)


process_file(sys.argv[1], sys.argv[2])
