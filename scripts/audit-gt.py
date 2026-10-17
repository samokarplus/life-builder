"""Offline audit of a saved official GT page; never fetches or imports catalog data.
Usage: python3 scripts/audit-gt.py /path/to/official-page.html
Normalizes whitespace and the printed GT suffix only. Writes one result per code/category.
"""
from html.parser import HTMLParser
from pathlib import Path
import csv, hashlib, json, re, sys
class Tables(HTMLParser):
    def __init__(self):
        super().__init__(); self.tag=''; self.text=''; self.cells=[]; self.rows=[]; self.category=''
    def handle_starttag(self, tag, attrs):
        if tag in ('h3', 'td', 'th'): self.tag=tag; self.text=''
        if tag=='tr': self.cells=[]
    def handle_data(self, text):
        if self.tag: self.text+=text
    def handle_endtag(self, tag):
        if tag==self.tag:
            text=' '.join(self.text.split())
            if tag=='h3': self.category=text
            else: self.cells.append(text)
            self.tag=''
        if tag=='tr' and self.cells: self.rows.append((self.category,self.cells))
def norm(s): return ' '.join(s.split()).strip()
def audit(path, min_rows=200):
    body=Path(path).read_bytes(); parser=Tables(); parser.feed(body.decode())
    official={}
    for heading, cells in parser.rows:
        if len(cells)!=3 or not re.fullmatch(r'[A-Z]{3} \d{4}\*?',cells[0]): continue
        cat=re.search(r'(AH[1-4]|CO[1-3]|HI1|MA1|SC[12]|SS[123])$',heading)
        if not cat: raise ValueError(f'Unknown category: {heading}')
        title=re.sub(r':?\s*(?:GT-)?(?:AH[1-4]|CO[1-3]|HI1|MA1|SC[12]|SS[123])\s*$','',cells[1]).strip()
        key=(cells[0].rstrip('*'),'GT-'+cat[1]); value=(norm(title),int(cells[2]),cells[0].endswith('*'))
        if key in official: raise ValueError(f'Duplicate official row {key}')
        official[key]=value
    if len(official)<min_rows: raise ValueError('Incomplete official document; refusing an empty/partial audit')
    local={}
    for category,block in re.findall(r'"(GT-[A-Z0-9]+)": `([^`]+)`',Path('src/data/frcc-gtpathways-raw.ts').read_text()):
        for line in block.splitlines():
            code,title,credits=line.split(' | '); key=(code.rstrip('*'),category)
            if key in local: raise ValueError(f'Duplicate local row {key}')
            local[key]=(norm(title),int(credits),code.endswith('*'))
    rows=[]
    for code,cat in sorted(local.keys()|official.keys()):
        key=(code,cat); a=local.get(key); b=official.get(key)
        status='match' if a==b else 'missing-local' if a is None else 'missing-official' if b is None else 'mismatch'
        rows.append({'code':code,'category':cat,'local_title':a[0] if a else '', 'local_credits':a[1] if a else '', 'local_not_offered':a[2] if a else '', 'result':status, 'official_difference':json.dumps(b) if status!='match' else ''})
    Path('review').mkdir(exist_ok=True)
    with open('review/gtpathways-audit.csv','w') as f:
        w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
    summary={'source_url':'https://frontrange.smartcatalogiq.com/current/catalog/elective-lists/gt-pathway-courses/','document_sha256':hashlib.sha256(body).hexdigest(),'local_rows':len(local),'official_rows':len(official),'local_unique_courses':len({k[0] for k in local}),'official_unique_courses':len({k[0] for k in official}),'matches':sum(r['result']=='match' for r in rows),'differences':[r for r in rows if r['result']!='match']}
    Path('review/gtpathways-audit.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps(summary,indent=2))
    return summary
if __name__=='__main__': audit(sys.argv[1])
