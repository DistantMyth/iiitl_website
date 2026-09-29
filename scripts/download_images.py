import asyncio
import aiohttp
import ssl
import json
import os
import time
from urllib.parse import urlparse, quote, unquote

os.makedirs('assets/images', exist_ok=True)
os.makedirs('data', exist_ok=True)

with open('data/catalog.json') as f:
    catalog = json.load(f)

images = [x for x in catalog if x['category'] == 'image']
print(f"Total images to process: {len(images)}")

# Build candidate URLs for an item
def get_url_candidates(url):
    candidates = [url]
    
    # URL encoded / decoded variations
    parsed = urlparse(url)
    encoded_path = quote(unquote(parsed.path))
    if encoded_path != parsed.path:
        candidates.append(f"{parsed.scheme}://{parsed.netloc}{encoded_path}")
        
    # Scaled variations
    if '-scaled.' in url:
        candidates.append(url.replace('-scaled.', '.'))
    else:
        for ext in ['.jpg', '.jpeg', '.png']:
            if url.lower().endswith(ext):
                candidates.append(url[:-len(ext)] + '-scaled' + ext)
                
    # http vs https
    if url.startswith('https://'):
        candidates.append(url.replace('https://', 'http://'))
        
    return list(dict.fromkeys(candidates))

async def download_image(session, item, sem, stats):
    dest = item['filepath']
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        stats['skipped'] += 1
        stats['downloaded'] += 1
        return True, os.path.getsize(dest)

    candidates = get_url_candidates(item['url'])
    
    async with sem:
        for u in candidates:
            for attempt in range(2):
                try:
                    async with session.get(u, timeout=aiohttp.ClientTimeout(total=25)) as resp:
                        if resp.status == 200:
                            content = await resp.read()
                            ct = resp.headers.get('Content-Type', '').lower()
                            # Ensure it's not an HTML error page
                            if 'html' not in ct and len(content) > 100:
                                with open(dest, 'wb') as f:
                                    f.write(content)
                                stats['downloaded'] += 1
                                stats['bytes'] += len(content)
                                return True, len(content)
                        elif resp.status == 404:
                            break # No point in retrying 404 for this candidate
                except Exception:
                    await asyncio.sleep(0.5)
                    
    stats['failed'] += 1
    stats['failed_urls'].append((item['url'], dest))
    return False, 0

async def main():
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    conn = aiohttp.TCPConnector(ssl=ssl_ctx, limit=15)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    sem = asyncio.Semaphore(15)
    stats = {
        'downloaded': 0,
        'skipped': 0,
        'failed': 0,
        'bytes': 0,
        'failed_urls': []
    }
    
    t0 = time.time()
    async with aiohttp.ClientSession(connector=conn, headers=headers) as session:
        # Process in chunks of 100 to report progress
        chunk_size = 100
        for i in range(0, len(images), chunk_size):
            chunk = images[i:i+chunk_size]
            tasks = [download_image(session, item, sem, stats) for item in chunk]
            await asyncio.gather(*tasks)
            elapsed = time.time() - t0
            pct = min(100, (i + len(chunk)) * 100 // len(images))
            mb = stats['bytes'] / (1024 * 1024)
            print(f"[{pct}%] Processed {i + len(chunk)}/{len(images)}: {stats['downloaded']} downloaded ({mb:.1f} MB), {stats['failed']} failed in {elapsed:.1f}s")

    print("\nDownload run completed!")
    print(f"Total downloaded: {stats['downloaded']}")
    print(f"Total bytes: {stats['bytes'] / (1024*1024):.2f} MB")
    print(f"Total failed: {stats['failed']}")
    
    with open('data/download_stats.json', 'w') as f:
        json.dump(stats, f, indent=2)

if __name__ == '__main__':
    asyncio.run(main())
