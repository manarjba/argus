from groq import Groq
from app.config import settings
from sqlalchemy.orm import Session
from app.crud import article as crud_article
from app.schemas.article import ArticleUpdate
import json


class AIProcessor:
    def __init__(self):
        # Initialize Groq client
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def generate_summary(self, content: str, max_length: int = 150) -> str:
        """Generate a concise summary of the article content"""
        try:
            if not content:
                return "No content available for summary"

            response = self.client.chat.completions.create(
                model="groq/compound-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a cybersecurity expert. Create a concise summary."
                    },
                    {
                        "role": "user",
                        "content": f"Summarize this in {max_length} characters: {content[:3000]}"
                    }
                ],
                max_tokens=120
            )

            # التعديل هنا: استخدام .content بدل ["content"]
            summary = response.choices[0].message.content.strip()
            return summary[:max_length]

        except Exception as e:
            print(f"Error generating summary: {e}")
            return f"Summary unavailable: {str(e)}"

    def analyze_threat(self, title: str, content: str) -> dict:
        """Analyze the article to determine threat type and severity"""
        try:
            prompt = f"""
            Analyze this cybersecurity article and return ONLY a JSON object with:
            - threat_type: one of [ransomware, phishing, vulnerability, zero-day, apt, malware, ddos, data-breach, other]
            - severity: one of [critical, high, medium, low, informational]
            - confidence: number between 0.5 and 1.0

            Title: {title}
            Content: {content[:2000]}

            ONLY return valid JSON.
            """

            response = self.client.chat.completions.create(
                model="groq/compound-mini",
                messages=[
                    {"role": "system", "content": "You are a cybersecurity analyst."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200
            )

            # التعديل هنا أيضاً
            result = response.choices[0].message.content.strip()
            return json.loads(result)

        except Exception as e:
            print(f"Error analyzing threat: {e}")
            return {
                "threat_type": "other",
                "severity": "informational",
                "confidence": 0.5
            }

    def process_article(self, db: Session, article_id: int):
        """Process a single article with AI analysis"""
        try:
            article = crud_article.get_article(db, article_id)
            if not article:
                print(f"Article {article_id} not found")
                return False

            print(f"Generating summary for article {article_id}...")
            summary = self.generate_summary(article.content or article.title)

            print(f"Analyzing threat for article {article_id}...")
            threat_analysis = self.analyze_threat(article.title, article.content or "")

            update_data = ArticleUpdate(
                summary=summary,
                threat_type=threat_analysis.get("threat_type"),
                severity=threat_analysis.get("severity")
            )

            print(f"Updating article {article_id}...")
            crud_article.update_article(db, article_id, update_data)

            print(f"Successfully processed article {article_id}")
            return True

        except Exception as e:
            print(f"Error processing article {article_id}: {e}")
            return False


# Global instance
try:
    if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your-groq-key":
        ai_processor = AIProcessor()
        print("AI Processor initialized successfully (Groq AI enabled)")
    else:
        ai_processor = None
        print("AI Processor disabled - No Groq API key set")

except Exception as e:
    ai_processor = None
    print(f"AI Processor initialization failed: {e}")
