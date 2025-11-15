from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.data_collector import rss_collector
from app.services.ai_processor import ai_processor
from app.services.ioc_extractor import ioc_extractor
from app.crud import article as crud_article
from app.schemas.article import ArticleUpdate

router = APIRouter()

# -------------------------------
# Fetch articles from RSS feeds
# -------------------------------
@router.post("/operations/fetch-articles")
def fetch_articles(db: Session = Depends(get_db)):
    try:
        new_count = rss_collector.save_articles_to_db(db)
        return {
            "message": f"Successfully fetched {new_count} new articles",
            "new_articles": new_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch articles: {str(e)}")


# -------------------------------
# Process a single article
# -------------------------------
@router.post("/articles/{article_id}/process")
def process_article(article_id: int, db: Session = Depends(get_db)):
    try:
        if ai_processor is None:
            return {
                "message": "AI processing is currently disabled. Please set GROQ_API_KEY in your .env file.",
                "ai_enabled": False
            }

        success = ai_processor.process_article(db, article_id)
        if success:
            return {"message": f"Article {article_id} processed successfully", "ai_enabled": True}
        else:
            raise HTTPException(status_code=404, detail=f"Article {article_id} not found or processing failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process article: {str(e)}")


# -------------------------------
# Extract IOCs from a single article
# -------------------------------
@router.post("/articles/{article_id}/extract-iocs")
def extract_iocs_for_article(article_id: int, db: Session = Depends(get_db)):
    try:
        article = crud_article.get_article(db, article_id)
        if not article:
            raise HTTPException(status_code=404, detail=f"Article {article_id} not found")

        text_to_analyze = f"{article.title} {article.content}"
        iocs = ioc_extractor.extract_iocs(text_to_analyze)

        update_data = ArticleUpdate(iocs=iocs)
        crud_article.update_article(db, article_id, update_data)

        return {
            "message": f"Extracted {sum(len(v) for v in iocs.values())} IOCs from article {article_id}",
            "iocs": iocs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract IOCs: {str(e)}")


# -------------------------------
# Operations status
# -------------------------------
@router.get("/operations/status")
def get_operations_status():
    return {
        "ai_processing": ai_processor is not None,
        "rss_feeds": len(rss_collector.feeds),
        "ioc_extraction": True,
        "message": "AI Processing: " + ("ENABLED" if ai_processor else "DISABLED - Set GROQ_API_KEY to enable")
    }


# -------------------------------
# Batch process all articles safely
# -------------------------------
@router.post("/batch/process-all")
def process_all_articles(db: Session = Depends(get_db)):
    if ai_processor is None:
        return {"message": "AI processing is currently disabled.", "ai_enabled": False}

    articles = crud_article.get_all_articles(db)
    processed_count = 0
    failed_articles = []

    for article in articles:
        try:
            success = ai_processor.process_article(db, article.id)
            if success:
                processed_count += 1
        except Exception as e:
            failed_articles.append({"article_id": article.id, "error": str(e)})

    return {
        "message": f"Batch processing completed. {processed_count} articles processed.",
        "ai_enabled": True,
        "total_articles": len(articles),
        "processed_articles": processed_count,
        "failed_articles": failed_articles
    }
