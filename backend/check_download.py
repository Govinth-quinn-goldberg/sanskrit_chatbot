import os
import glob

cache_dir = os.path.expanduser("~/.cache/huggingface/hub/models--naklitechie--indictrans2-en-indic-dist-200M")
print(f"Checking cache dir: {cache_dir}")

if os.path.exists(cache_dir):
    total_size = 0
    for root, dirs, files in os.walk(cache_dir):
        for f in files:
            fp = os.path.join(root, f)
            sz = os.path.getsize(fp)
            total_size += sz
            print(f"  File: {f} -> {sz / (1024*1024):.2f} MB")
    print(f"Total downloaded cache size: {total_size / (1024*1024):.2f} MB")
else:
    print("Cache dir does not exist yet.")
