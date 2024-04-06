import ollama


def generate_summary(text):
    response = ollama.generate(
        model="mistral",
        prompt=f"Summarize the below text by highlighting only the non-obvious things without missing any details: \n{text} \n\nSummary:",
        options={
            "num_predict": 1024,
            "temperature": 0.0,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
        },
    )

    return response["response"]
