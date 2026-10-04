import os
import json

KNOWLEDGE_DIR = os.path.join(os.path.dirname(__file__), "knowledge")

_knowledge_cache = []

def load_knowledge_base():
    global _knowledge_cache
    _knowledge_cache = []
    if not os.path.exists(KNOWLEDGE_DIR):
        return _knowledge_cache

    for filename in os.listdir(KNOWLEDGE_DIR):
        if filename.endswith(".json"):
            file_path = os.path.join(KNOWLEDGE_DIR, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        _knowledge_cache.extend(data)
            except Exception as e:
                print(f"Error loading knowledge file {filename}: {e}")

    return _knowledge_cache

def search_knowledge_base(query: str, top_k: int = 2) -> str:
    """
    Simple keyword search algorithm over the local Sanskrit knowledge base.
    Returns formatted string context for Ollama.
    """
    if not _knowledge_cache:
        load_knowledge_base()

    if not query or not _knowledge_cache:
        return ""

    query_tokens = [w.strip().lower() for w in query.split() if len(w.strip()) > 1]
    if not query_tokens:
        return ""

    results = []
    for item in _knowledge_cache:
        score = 0
        topic = item.get("topic", "").lower()
        keywords = [k.lower() for k in item.get("keywords", [])]
        content = item.get("content", "").lower()

        for token in query_tokens:
            if token in keywords:
                score += 3
            if token in topic:
                score += 2
            if token in content:
                score += 1

        if score > 0:
            results.append((score, item))

    # Sort by score descending
    results.sort(key=lambda x: x[0], reverse=True)
    top_matches = results[:top_k]

    if not top_matches:
        return ""

    formatted_docs = []
    for score, item in top_matches:
        examples_str = ""
        if item.get("examples"):
            ex_list = [f"{ex['sanskrit']} ({ex['meaning']})" for ex in item['examples']]
            examples_str = "\nExamples: " + "; ".join(ex_list)
        formatted_docs.append(
            f"Topic: {item.get('topic')}\nContent: {item.get('content')}{examples_str}"
        )

    return "\n\n".join(formatted_docs)
