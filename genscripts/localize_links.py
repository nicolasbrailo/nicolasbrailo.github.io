import glob
import os
import requests
import re
import sys


DEADLINK_MD = '/blog_md/youfoundadeadlink.md'
DEADLINE_MD_TMPL = """
# You found a dead link!

This blog is, by Internet standards, ancient. The link you clicked probably worked a few years (decades) ago, but is now broken. Its content may be irretrievably lost forever. Or maybe the link still works, but I broke it in one of the many, many, blog migrations. Or maybe a random cosmic ray flipped a bit somewhere. We will never know, so here is the image of a kitten.

![Original: https://commons.wikimedia.org/wiki/Category:Kittens#/media/File:Six_weeks_old_cat_(aka).jpg](/blog_img/cat.jpg)

"""

def get_all_posts(src_path):
    posts = []
    for root, dirs, files in os.walk(src_path):
        if len(files) > 0:
            posts.extend([f"{root}/{x}" for x in files if x.endswith(".md")]);
    posts.sort(reverse=True)
    return posts

def islocalblog(md_src, url):
    if url == 'https://monoinfinito.wordpress.com':
        if md_src[0] == '.':
            md_src = md_src[1:]
        return md_src

    lookslikemyblog = re.search(r'/(\d{4})/(\d{2})/(\d{2})/', url)
    if lookslikemyblog:
        year = lookslikemyblog.group(1)
        month = lookslikemyblog.group(2)
        day = lookslikemyblog.group(3)
        fs = [f for f in glob.glob(f'{md_src}/{year}/{month}{day}_*')]
        if len(fs) == 0:
            # Not a local url
            return None
        if len(fs) == 1:
            localurl = fs[0]
            if localurl[0] == '.':
                localurl = localurl[1:]
            return localurl
        else:
            print(f"Error: multiple matching files for {url}: {fs}")
            exit(1)

    looks_parseable = False
    if 'monkeywritescode.blogspot.com' in url:
        url_chunks = url.split('monkeywritescode.blogspot.com/')[1].split('/')
        looks_parseable = True
    if 'monoinfinito.wordpress.com' in url:
        url_chunks = url.split('monoinfinito.wordpress.com/')[1].split('/')
        looks_parseable = True
    if looks_parseable:
        page = url_chunks[2].split('.html')[0].split('_')[0]
        fs = [f for f in glob.glob(f'{md_src}/{url_chunks[0]}/{url_chunks[1]}*')]
        fs_options = []
        for fname in fs:
            cleanfname = fname.lower().replace('_', '')
            maybesubpage = True
            for kw_in_page in page.split('-'):
                if kw_in_page.isdigit():
                    continue
                if len(kw_in_page.strip()) == 0:
                    continue
                if not kw_in_page.lower() in cleanfname:
                    maybesubpage = False
                    break
            if maybesubpage:
                fs_options.append(fname)

        if len(fs_options) > 1:
            print("Have multiple options, selecting first randomly. Options: ", fs_options)
            fs_options = [fs_options[0]]
        if len(fs_options) == 1:
            localurl = fs_options[0]
            if localurl[0] == '.':
                localurl = localurl[1:]
            return localurl
        print("Failed to match URL", url, "options are", fs_options)
        exit(0)

    return None


def knownbroken(url):
    oklist = ['patwanjau.wordpress.com', 'nativecoding.wordpress.com', 'gravatar.com', 'pauljurczak.wordpress.com',
                'uncleninja.wordpress.com', 'sherais.wordpress', 'twitter.com', 'theotherbranch.wordpress.com',
                'chepa.net', 'shallalist.de', 'gladguys.com', 'grandadevans.com', 'rentts.de', 'zfs.in',
                'http://www2.research.att.com/~bs', 'nicolasb.com.ar', 'geekandpoke.typepad.com',
                'unovyx.com', 'userscripts.org', '0pointer.com.ar', 'vitasprings.com', 'vim-avia.com',
                'tatanka.com.br',
                'monoinfinito.files.wordpress.com/2010/04/pantallazo-keywords', 'www.wulffmorgenthaler.com',
                'abstrusegoose.com', 'monosinfinitos.com.ar', 'codecomics.com', 'ubuntu-ar.org',
                'yuvi.in', 'paulallcock.org', 'thisisabore.net', 'www.copyquery.com',
                'mentorembedded.github.com', 'www.programfaqs.com', 'gnutn.org.ar', 'gnutn.com.ar', 'feeds.feedburner.com'
              ]
    for p in oklist:
        if p in url:
            return True
    return False

def allowlisted(url):
    oklist = ['github.com', 'github.io', 'vim.org', 'logix.cz', 'llvm.org', 'wikipedia.org','imagemagick.org',
              'imagemagic.org', 'githubusercontent', 'gnu.org', 'zavyalov.nl', 'ycombinator.com',
              'google.com', 'cppreference.com', 'xkcd.com', 'f-droid.org', 'open-std.org',
              'android.com', 'ganssle.com', 'explainshell.com', 'ubuntu.com', 'launchpad.net',
              'openstreetmap.org', 'sourceware.org', 'anl.gov', 'cdecl.org', 'microsoft.com',
              'https://www.youtube.com/watch?v=IWm03wYBTbM', 'vrapper.sourceforge.net',
              'canyouseeme.org', 'drdobbs.com', 'bdsoft.com', 'statdns.nedze.com',
              'mediawiki.org', 'svnbook.red-bean.com', 'techrights.org', 'example.net',
              'asciiflow.com', 'slashdot.org', 'imdb.com', 'www.df7cb.de', 'alexonlinux.com',
              'blogs.msdn.com', 'codinghorror.com', 'www.bouml.fr', 'thedailywtf.com',
              'gson.org/egypt', 'jonls.dk', 'psoug.org', 'oracle.com', 'gotw.ca',
              'net-snmp.org', 'lighttpd.net', 'moc.daper.net', 'lsecotaro.blogspot.com', 'lyx.org',
              'intraway.com', 'debaday.debian.net', 'debian.org', 'flisol.info',
              'wiki.cafelug.org.ar', 'valgrind.org'
            ]
    for p in oklist:
        if p in url:
            return True
    return False

def knownmoved(url):
    moved = {
            'bouml.free.fr': 'https://www.bouml.fr/',
            'http://monkeywritescode.blogspot.com/2009/05/everything-is-file-aka-battery': '/blog_md/2009/0514_EverythingisafileA.K.A.BatterystateonLinux.md',
            'https://monoinfinito.wordpress.com/2010/02/valgrind-': 'blog_md/2010/0219_ValgrindOCISuppressionsfileTakeII.md',
        }
    for oldurl in moved:
        if oldurl in url:
            return moved[oldurl]
    return None

def replace_moved(txt, url):
    return txt.replace(url, knownmoved(url))

def localize_url(txt, url):
    local = islocalblog(md_src_path, url)
    return txt.replace(url, local)

def replace_broken(txt, url):
    if not os.path.exists('.' + DEADLINK_MD):
        with open('.' + DEADLINK_MD, 'w') as fp:
            fp.write(DEADLINE_MD_TMPL)
    return txt.replace(url, DEADLINK_MD)

md_src_path = sys.argv[1]
for fpath in get_all_posts(md_src_path):
    with open(fpath, 'r') as fp:
        post_txt = fp.read()
        meta_url_i = post_txt.find('@meta originalUrl')
        meta_url_f = 0
        if meta_url_i != -1:
            meta_url_f = post_txt.find('\n', meta_url_f)

        updated = False
        url_i = post_txt.find('(http', meta_url_f)
        while url_i != -1:
            if url_i != -1:
                url_f = post_txt.find(')', url_i)
                url = post_txt[url_i+1:url_f]
                if knownmoved(url) is not None:
                    updated = True
                    post_txt = replace_moved(post_txt, url)
                elif knownbroken(url):
                    updated = True
                    post_txt = replace_broken(post_txt, url)
                elif allowlisted(url):
                    pass
                elif islocalblog(md_src_path, url):
                    updated = True
                    post_txt = localize_url(post_txt, url)
                else:
                    print("FOUND @", fpath, url)
                    exit(0)
            url_i = post_txt.find('(http', url_f)

        if updated:
            print(fpath, " needs update")
            with open(fpath, 'w') as fp:
                fp.write(post_txt)

