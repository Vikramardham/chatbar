## Running this extension

This chrome extension summarizes and lets you chat with it. The information remains private and no LLM API_KEYs are needed.

This repo has two parts:
1. Chrome extension
- load it as you would load any local extension. The code is available in the extension folder
2. Backend local server
- Install the requirements using pyproject.toml
- Make sure you have an Ollama server running in the background

Usage:
1. Load the extension by going to chrome://extensions with dev mode
2. Make sure ollama server is running
3. Start the backend server by navigating to the chat-server folder and running $uvicorn app:app --reload
4. Chat with the website and feel free to navigate any page

Limitations:
1. Context refreshes as soon as you move to a new page
2. The LLMs only consume and summarize text data. Image data is WIP
3. Works best for news articles, documents assuming the document is a single article.

Road map:
0. Summarize any kind of content not just documents (websites, emails etc.)
1. Add multiple chat panels for each tab
2. Ability to read long text
3. Add RAG
4. Add ability to consume images and videos
5. Add long-term memory
6. Add agentic capability
