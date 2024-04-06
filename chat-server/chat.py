from ollama import chat


class Chat:
    def __init__(self, model="mistral", context=None, history=10):
        self.model = model
        self.context = {
            "role": "system",
            "content": f"Use the following context from the website whenever asked: \n {context}",
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
                "num_predict": 1024,
                "temperature": 0.0,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0,
            },
        )

        self.memory.append(
            {"role": "system", "content": response["message"]["content"]}
        )

        print(self.memory)

        return response["message"]["content"]
