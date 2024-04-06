# %%
from llama_index.readers.web import (
    ReadabilityWebPageReader,
    MainContentExtractorReader,
)

# 1
# from main_content_extractor import MainContentExtractor
# extractor = MainContentExtractor

# html = open("sample.html", "r").read()
# print(extractor.extract(html, output_format="markdown"))


# 2
# from newspaper import Article
# article = Article("")
# article.set_html(open("sample.html").read())
# article.parse()
# article.nlp()
# print(article.summary)

# 3
from html2text import HTML2Text

h = HTML2Text()
h.ignore_links = True

print(h.handle(open("sample.html").read()))
