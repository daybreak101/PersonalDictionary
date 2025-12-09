import json
from collections import Counter

with open("./data/randomWord.json") as f:
    words = json.load(f)

counts = Counter(words)

duplicates = [word for word, count in counts.items() if count > 1]

print("Duplicates:", duplicates)