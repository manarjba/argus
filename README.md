Argus Cybersecurity Threat Intelligence Platform

Status

Python

FastAPI

React

AI

Argus is an AI-driven cybersecurity threat intelligence platform that collects, analyzes, and prioritizes security threats from multiple sources. It delivers real-time threat intelligence, automated analysis, and actionable insights for security teams.

Features
Core Capabilities

Automated threat collection with real-time RSS feed monitoring

AI-powered threat analysis using Groq

IOC extraction including IPs, domains, and hashes

Professional React-based dashboard

Advanced search and filtering capabilities

Threat Intelligence

Real-time monitoring of multiple cybersecurity feeds

Automated classification of threats (e.g., ransomware, phishing, zero-day)

Severity scoring with defined risk levels

Structured IOC management

Analytics and Reporting

Real-time dashboard metrics

Threat filtering and search capabilities

Batch processing of multiple articles

System monitoring and status endpoints

Architecture
Argus Platform
├── Backend (FastAPI)
│   ├ RESTful API
│   ├ SQLAlchemy ORM with PostgreSQL/SQLite
│   ├ AI processing with Groq
│   ├ RSS feed ingestion
│   └ IOC extraction
├── Frontend (React + TypeScript)
│   ├ Threat dashboard
│   ├ Search and filtering
│   ├ Severity-based threat cards
│   └ Responsive design
└── Processing Pipeline
    ├ Collection → Analysis → IOC Extraction
    ├ Batch processing
    └ Real-time updates

Technology Stack
Backend

Python 3.8+

FastAPI

SQLAlchemy

Groq AI

Uvicorn

Pydantic

Alembic

Frontend

React 18

TypeScript

Axios

CSS3

AI and Processing

Groq API for inference

NLP pipelines for classification

Regex-based IOC detection

Batch analysis

Installation and Setup
Prerequisites

Python 3.8+

Node.js 16+

Groq API account

Backend Setup
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Frontend Setup
cd frontend
npm install
npm start

Access

Frontend: http://localhost:3000

API Docs: http://localhost:8000/docs

Health Check: http://localhost:8000/health

Configuration

Create a .env file in the backend directory:

DATABASE_URL=sqlite:///./argus.db
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_secret_key

RSS Sources

The platform monitors:

The Hacker News

Krebs on Security

CVE databases

Additional configurable sources

Usage
Basic Operations

Fetch new threats via the dashboard

AI analysis for classification and severity

Full-text search and filtering

View IOCs extracted from articles

Example API Endpoints
Endpoint	Method	Description
/api/v1/articles	GET	Retrieve all threats
/api/v1/articles/{id}	GET	Retrieve a specific threat
/api/v1/operations/fetch-articles	POST	Fetch new threats
/api/v1/articles/{id}/process	POST	AI process a specific threat
/api/v1/batch/process-all	POST	Process all unprocessed threats
/api/v1/operations/status	GET	Check system status
Project Structure
argus-cybersecurity/
├── backend/
│   ├── app/
│   │   ├── api/endpoints
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   ├── config.py
│   │   └── database.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components
│   │   ├── services
│   │   └── App.tsx
│   └── package.json
└── scripts/
    ├── test_ai_operations.py
    └── deployment/

AI Capabilities
Threat Classification

Ransomware

Phishing

Vulnerability

Zero-Day

APT

DDoS

Data Breach

Severity Levels

Critical

High

Medium

Low

Informational

IOC Extraction

IP addresses

Domains

File hashes (MD5, SHA1, SHA256)

Email addresses

URLs

Deployment
Docker
docker-compose up -d
docker-compose logs -f

Cloud Options

AWS

Google Cloud

Azure

Heroku

Contributing

Contributions are welcome.

Steps:

Fork the repository

Create a feature branch

Commit your changes

Push the branch

Open a pull request

Reporting Issues

Use the GitHub Issues page for bugs or feature requests.

License

This project is distributed under the MIT License.

Security

Input validation for all endpoints

SQL injection protection

CORS configuration

Environment-based secrets

Regular updates and dependency checks
