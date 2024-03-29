from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ollama

app = FastAPI()

# Replace this with the actual URL of your LLM server
LLM_SERVER_URL = "http://localhost:11434/api/generate"
HEADERS = {"Content-Type": "application/json"}

# Set up the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.post("/send-html")
async def send_html(request: Request):
    html_content = await request.json()
    print("Received HTML content:", html_content)
    return {"message": "HTML received successfully"}


@app.post("/send-message")
async def send_message(request: Request):
    message_data = await request.json()
    message = message_data["message"]
    response = ollama.generate(model="mistral", prompt=message)

    return {"response": response["response"]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
