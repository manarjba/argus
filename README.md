# Argus – Cybersecurity Threat Intelligence Platform

Argus is a backend-focused cybersecurity threat intelligence platform designed to collect, analyze, and organize security-related information from multiple sources.

The project demonstrates backend architecture, API design, data processing, and integration of AI-based analysis within a full-stack system.

---

## Overview

The platform collects cybersecurity articles from multiple feeds, analyzes them using AI, extracts indicators of compromise (IOCs), and presents structured threat information through a dashboard.

The main focus of this project is backend development, system design, and data processing workflows.

---

## Key Features

- Automated collection of cybersecurity articles from RSS feeds
- AI-assisted threat classification and severity analysis
- Extraction of indicators such as IP addresses, domains, and file hashes
- RESTful API built with FastAPI
- Web-based dashboard for viewing and filtering threats

---

## Architecture

The system is composed of three main layers:

- **Backend (FastAPI)**  
  Handles APIs, data processing, database integration, and AI analysis.

- **Frontend (React)**  
  Provides a dashboard for visualizing threats and performing searches.

- **Processing Pipeline**  
  Collects articles, analyzes content, extracts indicators, and stores structured results.

---

## Technology Stack

**Backend**
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL / SQLite

**Frontend**
- React
- TypeScript

**AI & Processing**
- AI-based text analysis
- NLP-based classification
- Pattern-based IOC extraction

---

## What This Project Demonstrates

- Backend system design and modular architecture
- REST API development
- Database modeling and data pipelines
- Integration of AI services into backend workflows
- Full project structure from ingestion to presentation

---

## Status

This project was developed as part of an academic and personal learning initiative and is not intended for production use.

---

## License

MIT License
