from sqlalchemy.orm import Session
from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate
from typing import List, Optional

def get_article(db: Session, article_id: int):
    return db.query(Article).filter(Article.id == article_id).first()

def get_articles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Article).offset(skip).limit(limit).all()

def get_article_by_url(db: Session, url: str):
    return db.query(Article).filter(Article.url == url).first()

def create_article(db: Session, article: ArticleCreate):
    # Check if article already exists
    db_article = get_article_by_url(db, url=article.url)
    if db_article:
        return db_article
    
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def update_article(db: Session, article_id: int, article):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article:
        # Handle both Pydantic models and dict inputs
        if hasattr(article, 'dict'):
            update_data = article.dict(exclude_unset=True)
        else:
            update_data = article
        for field, value in update_data.items():
            setattr(db_article, field, value)
        db.commit()
        db.refresh(db_article)
    return db_article

def delete_article(db: Session, article_id: int):
    db_article = db.query(Article).filter(Article.id == article_id).first()
    if db_article:
        db.delete(db_article)
        db.commit()
    return db_article

def get_all_articles(db: Session):
    """Return all articles in the database"""
    return db.query(Article).all()
