import sys
from helpers import apply_template, get_all_mds, read_md_doc, extract_year_month_from_path

rss_item_cnt = int(sys.argv[1])
md_src = sys.argv[2]
docs = get_all_mds(md_src)[0:rss_item_cnt]
print(docs)
