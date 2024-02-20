import os

def get_all_mds(src_path):
    posts = []
    for root, dirs, files in os.walk(src_path):
        if len(files) > 0:
            files_here = [f"{root}/{x}" for x in files if x.endswith(".md")]
            posts.extend(files_here);
    posts.sort(reverse=True)
    return posts

