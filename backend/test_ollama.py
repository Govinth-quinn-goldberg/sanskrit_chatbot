import requests
import time

url = "http://localhost:11434/api/generate"

prompt = """
Analyze this Sanskrit sentence:

आत्मविश्वासः।

Return only JSON:
{
  "back_translation": "",
  "verified": true,
  "combined_meaning": "",
  "explanation": ""
}
"""

start = time.time()

response = requests.post(
    url,
    json={
        "model": "llama3.2:3b",
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 100
        }
    },
    timeout=60
)

print("Status:", response.status_code)
print("Time:", time.time() - start)
print("Response:")
print(response.json()["response"])