from main_content_extractor import MainContentExtractor
from newspaper import Article
from html2text import HTML2Text


def extract_article(html):
    try:
        extractor = MainContentExtractor
        return extractor.extract(html, output_format="markdown")
    except Exception as e:
        print("Failed to extract article content with error:", e)
        try:
            h = HTML2Text()
            h.ignore_links = True
            return h.handle(html)
        except Exception as e:
            print("Failed to extract article content with error:", e)
            try:
                article = Article("")
                article.set_html(html)
                article.parse()
                return article.text
            except Exception as e:
                print("Failed to extract article content", e)
                return html
