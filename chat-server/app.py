from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ollama
import asyncio
import json
from reader import extract_article
from gen_summary import generate_summary
from chat import Chat

app = FastAPI()
# app.state.chat = None

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
    html = await request.json()

    content = extract_article(html["html"])
    summary = generate_summary(content)
    app.state.summary = summary

    app.state.chat = Chat(context=content)
    print("Chat context:", content)
    return {"message": "HTML received and processed"}


@app.post("/send-message")
async def send_message(request: Request):
    message_data = await request.json()
    message = message_data["message"]
    response = app.state.chat.respond(message)
    return {"response": response}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
