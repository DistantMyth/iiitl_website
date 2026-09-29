import json
from pathlib import Path
from bs4 import BeautifulSoup
p=json.load(open('data/fetched_core_pages.json'));catalog=json.load(open('data/catalog.json'));assets={a['url']:'/'+a['filepath'] for a in catalog}
s=BeautifulSoup(p['https://iiitl.ac.in/index.php/faculty/'],'html.parser');faculty=[]
for e in s.select('.gdlr-core-personnel-list'):
 a=e.select_one('h3 a');im=e.select_one('img');position=e.select_one('.gdlr-core-personnel-list-position');description=e.select_one('.gdlr-core-personnel-list-content');email=e.select_one('[data-cfemail]');mail=''
 if email:
  b=bytes.fromhex(email['data-cfemail']);mail=''.join(chr(v^b[0]) for v in b[1:])
 if a: faculty.append({'name':a.get_text(strip=True),'slug':a['href'].strip('/').split('/')[-1],'source':a['href'],'image':assets.get(im.get('data-src') or im.get('src',''),'') if im else '', 'qualification':position.get_text(' ',strip=True) if position else '', 'description':description.get_text(' ',strip=True) if description else '', 'email':mail})
Path('lib/faculty.json').write_text(json.dumps(faculty,ensure_ascii=False));print('Faculty profiles:',len(faculty))
