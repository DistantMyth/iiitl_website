import json,re,html
from bs4 import BeautifulSoup
from pathlib import Path
pages=json.load(open('data/all_pages.json')); fetched=json.load(open('data/fetched_core_pages.json')); catalog=json.load(open('data/catalog.json'))
assetmap={a['url']:'/'+a['filepath'] for a in catalog}
result=[]
for p in pages:
 raw=fetched.get(p['link'],'')
 soup=BeautifulSoup(raw or p['content']['rendered'],'html.parser')
 body=soup.select_one('.gdlr-core-page-builder-body') or soup.select_one('.kingster-page-wrapper') or soup
 for e in body.select('script,style,iframe,form,nav,footer'): e.decompose()
 text=body.get_text(' ',strip=True)
 links=[]
 for a in body.select('a[href]'):
  href=a.get('href',''); label=a.get_text(' ',strip=True)
  if href.startswith('https://') and label and not any(x in href for x in ['35.194.','javascript:']): links.append({'label':label[:160],'url':href})
 images=[]
 for img in body.select('img'):
  src=img.get('data-src') or img.get('src','')
  if src in assetmap and assetmap[src] not in images: images.append(assetmap[src])
 result.append({'slug':p['slug'],'title':BeautifulSoup(html.unescape(p['title']['rendered']),'html.parser').get_text(' ',strip=True),'text':text,'links':links[:60],'images':images[:20],'source':p['link']})
Path('lib/legacy.json').write_text(json.dumps(result,ensure_ascii=False))
posts=[]
for p in json.load(open('data/all_posts.json')):
 posts.append({'slug':p['slug'],'title':BeautifulSoup(html.unescape(p['title']['rendered']),'html.parser').get_text(' ',strip=True),'date':p['date'][:10],'text':BeautifulSoup(p['content']['rendered'],'html.parser').get_text(' ',strip=True),'source':p['link']})
Path('lib/news.json').write_text(json.dumps(posts,ensure_ascii=False))
print('Migrated',len(result),'pages and',len(posts),'notices')
