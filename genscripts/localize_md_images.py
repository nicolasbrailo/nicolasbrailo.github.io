import os
import requests
import sys

def get_all_posts(src_path):
    posts = []
    for root, dirs, files in os.walk(src_path):
        if len(files) > 0:
            posts.extend([f"{root}/{x}" for x in files if x.endswith(".md")]);
    posts.sort(reverse=True)
    return posts

def prefetch_kitten(kitten_local_path):
    #kitten_img_url = 'https://commons.wikimedia.org/wiki/Category:Kittens#/media/File:Six_weeks_old_cat_(aka).jpg'
    kitten_img_url = 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Six_weeks_old_cat_%28aka%29.jpg'
    response = requests.get(kitten_img_url)
    if response.status_code != 200:
        raise RuntimeError("Can't download kitten image")

    with open(kitten_local_path, 'wb') as file:
        file.write(response.content)

def prefetch_broken_image(broken_image_local_path):
    # https://commons.wikimedia.org/wiki/File:Broken-image-389560.svg
    broken_img_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Broken-image-389560.svg/240px-Broken-image-389560.svg.png'
    response = requests.get(broken_img_url)
    if response.status_code != 200:
        raise RuntimeError("Can't download broken image")

    with open(broken_image_local_path, 'wb') as file:
        file.write(response.content)


def absolute_url(url):
    if url.startswith('./'):
        return url[1:]
    return url

def wget(broken_image_local_path, img_local_dir, url):
    local_path = os.path.join(img_local_dir, os.path.basename(url))
    if os.path.exists(local_path):
        print(f"Reusing image at {local_path}")
        return absolute_url(local_path)

    try:
        response = requests.get(url)
        if response.status_code == 404:
            print(f"Image '{url}' lost, marking broken")
            return broken_image_local_path
        if response.status_code == 200:
            print(f"Fetched {url}")
            with open(local_path, 'wb') as file:
                file.write(response.content)
            return absolute_url(local_path)
        else:
            print(f"Failed to fetch content from '{url}'. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"An error occurred fetching {url} and saving to {local_path}: {e}")
        return None


def should_skip_attribution(url):
    # URLs where I uploaded my own content... I hope
    if 'githubusercontent' in url:
        return True
    if 'blogspot' in url:
        return True
    if 'monoinfinito' in url:
        return True
    return False


def try_localize(img_local_dir, broken_image_local_path, fpath, img_tag_search_start_pos=0):
    with open(fpath, 'r') as fp:
        post_txt = fp.read()

    # Look for something like this: [![](url)](url)
    img_tok_i = post_txt.find('![', img_tag_search_start_pos)
    if img_tok_i == -1:
        # No image in this post
        return False
    print(fpath)
    img_tok_f = post_txt.find(']', img_tok_i+1)
    if (post_txt[img_tok_f+1] != '('):
        print(f"Failed to parse image url in {fpath}")
        return False
    img_url_i = img_tok_f+2
    img_url_f = post_txt.find(')', img_url_i+1)

    # lbl = post_txt[img_tok_i+len('![') : img_tok_f]
    url = post_txt[img_url_i : img_url_f]

    if url.startswith(absolute_url(img_local_dir)):
        # Already has a local img, try to parse the rest of this content
        return try_localize(img_local_dir, broken_image_local_path, fpath, img_url_f)

    local_url = wget(broken_image_local_path, img_local_dir, url)
    if local_url is None:
        print(f"Error localizing image in {fpath}")
        return False

    # Use replace in case the url is in a link too
    localized_post = post_txt.replace(url, local_url)
    if not should_skip_attribution(url):
        # Save the original url in the label
        localized_post = localized_post.replace(f'![]({local_url})', f'![Original: {url}]({local_url})')
    with open(fpath, 'w') as fp:
        fp.write(localized_post)

    print(f"Localized one image in {fpath}")

    return True


# Download images from md posts

md_src_path = sys.argv[1]
img_local_dir = sys.argv[2]

if not os.path.exists(img_local_dir):
    os.makedirs(img_local_dir)

broken_image_local_path = f'{img_local_dir}/img_lost.png'
prefetch_broken_image(broken_image_local_path)
prefetch_kitten(f'{img_local_dir}/cat.jpg')

for fpath in get_all_posts(md_src_path):
    # Apply try_localize in a loop so it will pick up all images, if a post has more than 1
    while try_localize(img_local_dir, broken_image_local_path, fpath):
        pass

