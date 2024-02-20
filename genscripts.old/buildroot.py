from datetime import datetime
import os
import re
import sys

def get_all_pgs(src_path):
    pgs = []
    for root, dirs, files in os.walk(src_path):
        if len(files) > 0:
            files_here = [f"{root}/{x}" for x in files if x.endswith(".html")]
            pgs.extend(files_here);
    return pgs


src_path = sys.argv[1]
pgs = get_all_pgs(src_path)

for pg in pgs:
    with open(pg, 'r') as fp:
        content = fp.read()
    with open('genscripts/template.html', 'r') as fp:
        tmpl = fp.read()

    content = tmpl.replace('{{md_content}}', content)
    content = content.replace('{{generatedDate}}', datetime.now().strftime('%Y-%m-%d'))

    dst = pg.replace(src_path, '.')
    with open(dst, 'w') as fp:
        fp.write(content)

