from main_content_extractor import MainContentExtractor
from newspaper import Article
from html2text import HTML2Text
import nltk

nltk.download("punkt")

file = open("captured.html", "r").read()
# 1
extractor = MainContentExtractor
html = file
print(extractor.extract(html, output_format="markdown"))

print("----" * 20)
# 2
article = Article("")
article.set_html(file)
article.parse()
article.nlp()
# print(article.summary)
print(article.text)
print("----" * 20)
# 2
# 3
h = HTML2Text()
h.ignore_links = True
print(h.handle(file))
print("----" * 20)
# 2
