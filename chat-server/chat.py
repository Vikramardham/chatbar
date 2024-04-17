from ollama import chat


class Chat:
    def __init__(self, model="mistral", context=None, history=10):
        self.model = model
        self.context = {
            "role": "system",
            "content": f"""You are an AI chat assistant. Specialized in answering questions based on the context. The context is extracted from a webpage html.
            Use the following text as context about the website whenever asked: \n
            ### Context:
            {context}""",
        }
        self.history = history
        self.memory = [self.context]

    def respond(self, message):
        if len(self.memory) > self.history:
            self.memory = [self.context] + self.memory[-self.history :]
        self.memory.append({"role": "user", "content": message})
        response = chat(
            self.model,
            messages=self.memory,
            options={
                "num_predict": 512,
                "temperature": 0.0,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0,
            },
        )

        self.memory.append(
            {"role": "system", "content": response["message"]["content"]}
        )

        return response["message"]["content"]
