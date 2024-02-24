import json
import os
import subprocess
import sys

def run(command):
    print(f"Step: {' '.join(command)}")
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    print(stdout.decode('utf-8'))
    print(stderr.decode('utf-8'))
    if process.returncode != 0:
        print(f"Failed step: {' '.join(command)}")
        exit(process.returncode )

if len(sys.argv) != 2:
    print(f"Usage: {sys.argv[0]} path_to_config.json")
    print(f"See here for details https://github.com/nicolasbrailo/MdlogGen")
    exit(0)

cfg_path = sys.argv[1]
with open(cfg_path, 'r') as fp:
    cfg = json.loads(fp.read())

# Ensure config keys
cfg['md_source_dir']
cfg['md_gen_target_dir']
cfg['html_dest_dir']
cfg['rss_entries_count']
cfg['site_fqdn']
cfg['site_title']
cfg['site_descr']
cfg['base_dest_dir']

MdlogGen_Path = os.path.dirname(os.path.realpath(__file__))
index_gen_script = os.path.join(MdlogGen_Path, 'index_gen.py')
html_gen_script = os.path.join(MdlogGen_Path, 'html_gen.py')
rss_gen_script = os.path.join(MdlogGen_Path, 'rss_gen.py')

run(["python3", index_gen_script, cfg['md_source_dir'], cfg['md_gen_target_dir']])
run(["python3", html_gen_script, cfg_path, cfg['html_dest_dir'], cfg['md_source_dir'], cfg['md_gen_target_dir']])
run(["python3", rss_gen_script, str(cfg['rss_entries_count']), cfg['md_source_dir'], cfg['html_dest_dir'], cfg['site_fqdn'], cfg['site_title'], cfg['site_descr']])

if 'md_to_html_single_files' in cfg:
    for single_file in cfg['md_to_html_single_files']:
        run(["python3", cfg_path, html_gen_script, single_file['dst'], single_file['src']])

for static_asset in ["style.css", "codehighlight.js", "search.js"]:
    static_asset_path = os.path.join(MdlogGen_Path, 'site_design', static_asset)
    run(["cp", static_asset_path, cfg['base_dest_dir']])

