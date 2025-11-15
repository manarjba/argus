from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.article import Article, ArticleCreate, ArticleUpdate
from app.crud import article as crud_article

router = APIRouter()

@router.post("/articles/", response_model=Article)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    return crud_article.create_article(db=db, article=article)

@router.get("/articles/", response_model=List[Article])
def read_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    articles = crud_article.get_articles(db, skip=skip, limit=limit)
    return articles

@router.get("/articles/{article_id}", response_model=Article)
def read_article(article_id: int, db: Session = Depends(get_db)):
    db_article = crud_article.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@router.put("/articles/{article_id}", response_model=Article)
def update_article(article_id: int, article: ArticleUpdate, db: Session = Depends(get_db)):
    db_article = crud_article.update_article(db, article_id=article_id, article=article)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

@router.delete("/articles/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    db_article = crud_article.delete_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}