import json

# Load the JSON file
with open("./data/randomWord.json", "r", encoding="utf-8") as f:
    words = json.load(f)

# Remove duplicates while preserving order
unique_words = list(dict.fromkeys(words))

# Overwrite the original JSON file
with open("./data/randomWord.json", "w", encoding="utf-8") as f:
    json.dump(unique_words, f, ensure_ascii=False, indent=2)

print(f"Removed duplicates. Original: {len(words)}, Unique: {len(unique_words)}")