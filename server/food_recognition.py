from transformers import pipeline
import sys

MODEL_NAME = "prithivMLmods/Indian-Western-Food-34"

classifier = pipeline(
    "image-classification",
    model=MODEL_NAME
)

if len(sys.argv) < 2:
    print("Please provide an image path.")
    print("Example: python food_recognition.py /path/to/food.jpg")
    sys.exit(1)

image_path = sys.argv[1]

results = classifier(image_path)

import json

top_result = results[0]

print(json.dumps({
    "foodName": top_result["label"],
    "score": top_result["score"]
}))