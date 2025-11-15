from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional, Dict, Any

class ArticleBase(BaseModel):
    title: str
    url: str
    content: Optional[str] = None
    source: Optional[str] = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    summary: Optional[str] = None
    threat_type: Optional[str] = None
    severity: Optional[str] = None
    iocs: Optional[Dict[str, Any]] = None

class Article(ArticleBase):
    id: int
    summary: Optional[str] = None
    threat_type: Optional[str] = None
    severity: Optional[str] = None
    iocs: Optional[Dict[str, Any]] = None
    published_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        orm_mode = True
