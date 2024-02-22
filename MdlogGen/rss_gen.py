from datetime import datetime
import html
import os
import sys

from helpers import apply_template, get_all_mds, read_md_doc, is_dynamic_content, get_html_link_from_md_rel_path

GENSCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))

rss_item_cnt = int(sys.argv[1])
md_src = sys.argv[2]
html_dst = sys.argv[3]
site_fqdn = sys.argv[4]
site_title = sys.argv[5]
site_descr = sys.argv[6]

docs = [x for x in get_all_mds(md_src) if is_dynamic_content(md_src, x)][0:rss_item_cnt]
rss_items = []
for docpath in docs:
    doc = read_md_doc(docpath)
    doc['postFQDNLink'] = site_fqdn + get_html_link_from_md_rel_path(md_src, html_dst, docpath)
    doc['txt'] = html.escape(doc['txt'])
    doc['title'] = html.escape(doc['title'])
    rss_item = apply_template(os.path.join(GENSCRIPT_DIR, 'templates', 'rss_item.xml'), doc)
    rss_items.append(rss_item)

rss_doc = {
        'rssTitle': site_title,
        'rssDescription': site_descr,
        'siteFQDN': site_fqdn,
        'publishDate': datetime.now().strftime('%Y-%m-%d'),
        'rssItems': '\n'.join(rss_items),
}

rss = apply_template(os.path.join(GENSCRIPT_DIR, 'templates', 'rss.xml'), rss_doc)
with open(os.path.join(html_dst, 'rss.xml'), 'w') as fp:
    fp.write(rss)


