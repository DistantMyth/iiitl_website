import json,re,html,os
from bs4 import BeautifulSoup
from bs4.element import NavigableString
from pathlib import Path

# Block-level tags whose boundaries must survive the flatten. A plain
# get_text(' ', strip=True) collapses all of these into one run-on line, which
# is what turned the RTI page's bullet lists into a single paragraph.
BLOCK={'p','div','li','ul','ol','h1','h2','h3','h4','h5','h6','tr','table','section','article',
       'blockquote','br','hr','td','th','dl','dt','dd','figure','figcaption','pre','center'}
# Sentinel appended to each block. It is non-whitespace, so get_text's per-node
# strip keeps it, and it does not occur in real copy, so the split is exact.
SENT=''

# The scrape picked up one animated "NEW" starburst (new-icon-animation.gif)
# and attached it to every legacy page as their lead image. It says nothing
# about the page, so it is dropped here and each page is given relevant,
# licence-free artwork instead -- see lib/page-art.ts.
DECORATIVE={'new-badge.svg','new-icon-animation.gif','new_blink.gif'}

def structured_text(body):
 for tag in body.find_all(list(BLOCK)): tag.append(NavigableString(SENT))
 text=body.get_text(' ',strip=True)
 text=text.replace(SENT,'\n')
 text=re.sub(r'[ \t]{2,}',' ',text)
 text=re.sub(r' *\n *','\n',text)
 text=re.sub(r'\n{3,}','\n\n',text)
 return text.strip()

pages=json.load(open('data/all_pages.json')); fetched=json.load(open('data/fetched_core_pages.json')); catalog=json.load(open('data/catalog.json'))
assetmap={a['url']:'/'+a['filepath'] for a in catalog}
result=[]
for p in pages:
 raw=fetched.get(p['link'],'')
 soup=BeautifulSoup(raw or p['content']['rendered'],'html.parser')
 body=soup.select_one('.gdlr-core-page-builder-body') or soup.select_one('.kingster-page-wrapper') or soup
 for e in body.select('script,style,iframe,form,nav,footer'): e.decompose()
 text=structured_text(body)
 links=[]
 for a in body.select('a[href]'):
  href=a.get('href',''); label=a.get_text(' ',strip=True)
  if href.startswith('https://') and label and not any(x in href for x in ['35.194.','javascript:']): links.append({'label':label[:160],'url':href})
 images=[]
 for img in body.select('img'):
  src=img.get('data-src') or img.get('src','')
  path=assetmap.get(src,'')
  if not path or os.path.basename(path) in DECORATIVE: continue
  if path not in images: images.append(path)
 result.append({'slug':p['slug'],'title':BeautifulSoup(html.unescape(p['title']['rendered']),'html.parser').get_text(' ',strip=True),'text':text,'links':links[:60],'images':images[:20],'source':p['link']})
Path('lib/legacy.json').write_text(json.dumps(result,ensure_ascii=False))
posts=[]
for p in json.load(open('data/all_posts.json')):
 posts.append({'slug':p['slug'],'title':BeautifulSoup(html.unescape(p['title']['rendered']),'html.parser').get_text(' ',strip=True),'date':p['date'][:10],'text':structured_text(BeautifulSoup(p['content']['rendered'],'html.parser')),'source':p['link']})
Path('lib/news.json').write_text(json.dumps(posts,ensure_ascii=False))
print('Migrated',len(result),'pages and',len(posts),'notices')
