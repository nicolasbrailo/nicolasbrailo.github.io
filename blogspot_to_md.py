from markdownify import markdownify as md
import sys
import re
import os

template_comment = """
## In reply to (this post)[{{in_reply_to}}], ({{author_name}})[{{author_uri}}] commented @ {{published}}:

{{content}}

Original (published here)[{{link}}].
"""

template_post = """
# {{title}}

{{content}}


---

Published {{published}} by {{author_name}}
Original (published here)[{{link}}].

"""

def parse_post_txt(txt):
    try:
        # This break code scripts
        # return md(txt)
        return txt.strip()
    except:
        return txt.strip()

def ok_parse_entry(post):
    if post['is_comment']:
        tmpl = template_comment
    else:
        tmpl = template_post

    post['content'] = parse_post_txt(post['content'])
    for key, value in post.items():
        token = "{{" + key + "}}"
        tmpl = tmpl.replace(token, str(value))

    pub_yr = post['published'][0:len('2023')]
    if not os.path.exists(pub_yr):
        os.makedirs(pub_yr)
    pubd = post['published'][len('2023-'):len('2023-12-16')].replace('-', '')
    post_fn = f"{pubd}_{post['title']}.md"
    post_fn = f"{pub_yr}/" + re.sub(r'[^_.a-zA-Z0-9]', '', post_fn)
    with open(post_fn, 'w') as file:
        file.write(tmpl)

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
    }
    def failed(post, tag):
        if tag not in post or not post[tag] or len(post[tag].strip()) == 0:
            return True
        return False
    if failed(post, 'published') or failed(post, 'title') or failed(post, 'content'):
        failed_parse_entry(text)
    else:
        ok_parse_entry(post)



def process_file(filename):
    try:
        with open(filename, 'r') as file:
            content = file.read()
            start_token = '<entry>'
            end_token = '</entry>'
            start_index = content.find(start_token)
            while start_index != -1:
                end_index = content.find(end_token, start_index + len(start_token))
                if end_index != -1:
                    entry_content = content[start_index + len(start_token):end_index]
                    process_entry(entry_content.strip())
                    start_index = content.find(start_token, end_index + len(end_token))
                else:
                    break
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <filename>")
        sys.exit(1)

    process_file(sys.argv[1])
