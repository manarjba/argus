import feedparser
import requests
from sqlalchemy.orm import Session
from app.crud import article as crud_article
from app.schemas.article import ArticleCreate
import time
from datetime import datetime

class RSSDataCollector:
    def __init__(self):
        self.feeds = [
            {
                "url": "https://feeds.feedburner.com/TheHackersNews",
                "source": "The Hacker News"
            },
            # We'll add more feeds later
        ]

    def fetch_articles(self) -> list:
        all_articles = []
        for feed in self.feeds:
            try:
                print(f"Fetching from {feed['source']}...")
                parsed_feed = feedparser.parse(feed["url"])
                
                for entry in parsed_feed.entries:
                    # Convert published_parsed to datetime if available
                    published_date = None
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        published_date = datetime.fromtimestamp(time.mktime(entry.published_parsed))
                    
                    article_data = {
                        "title": entry.title,
                        "url": entry.link,
                        "content": self.get_article_content(entry),
                        "source": feed["source"],
                        "published_date": published_date
                    }
                    all_articles.append(article_data)
                    
                print(f"Found {len(parsed_feed.entries)} articles from {feed['source']}")
                
            except Exception as e:
                print(f"Error fetching from {feed['url']}: {e}")
        
        return all_articles

    def get_article_content(self, entry):
        # Try to get the full content, but if not available, use summary
        if hasattr(entry, 'content'):
            return entry.content[0].value
        elif hasattr(entry, 'summary'):
            return entry.summary
        else:
            return entry.title  # Fallback to title if no content

    def save_articles_to_db(self, db: Session):
        articles = self.fetch_articles()
        new_articles_count = 0
        
        for article_data in articles:
            # Check if article already exists by URL
            existing_article = crud_article.get_article_by_url(db, url=article_data["url"])
            if not existing_article:
                article_create = ArticleCreate(**article_data)
                crud_article.create_article(db, article=article_create)
                new_articles_count += 1
                
        return new_articles_count

# Create a global instance
rss_collector = RSSDataCollector()