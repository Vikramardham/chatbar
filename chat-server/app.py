from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
from reader import extract_article
from gen_summary import generate_summary
from chat import Chat

app = FastAPI()

LLM_SERVER_URL = "http://localhost:11434/api/generate"
HEADERS = {"Content-Type": "application/json"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.websocket("/ws")
async def websocket_handler(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            data_json = json.loads(data)
            if "html" in data_json:
                html = data_json["html"]
                content = extract_article(html)
                # open("html.txt", "w").write(html)
                print(content)
                summary = generate_summary(content)
                app.state.summary = summary
                app.state.chat = Chat(context=content)
                await websocket.send_json(
                    {"type": "status", "message": "Updated Context!"}
                )

            elif "message" in data_json:
                print("Message received")
                message = data_json["message"]
                response = app.state.chat.respond(message)
                await websocket.send_json({"type": "message", "message": response})
            else:
                print("Waiting...")
    except Exception as e:
        print("Websocked close with error:", e)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
