import requests
import json

BASE_URL = "http://localhost:8000"

queries = [
    "I am learning Sanskrit.",
    "Rama reads the book.",
    "How do I say hello in Sanskrit?",
    "AK was like the sun to me, she set everything spin and orbit around her and me i was more than happy to be spin around"
]

res = []
for q in queries:
    r = requests.post(f"{BASE_URL}/chat", json={"message": q, "history": []})
    res.append({"query": q, "data": r.json()})

with open("test_output.json", "w", encoding="utf-8") as f:
    json.dump(res, f, indent=2, ensure_ascii=False)

print("Saved test_output.json")
