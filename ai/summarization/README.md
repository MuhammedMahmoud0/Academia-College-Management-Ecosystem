# Document Summarization Model

An AI-powered document summarization service that reads academic PDFs and long texts and returns concise, structured summaries.

[![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat-square&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-API-black?style=flat-square&logo=flask)](https://flask.palletsprojects.com)

---

## 🧠 How It Works

The model accepts PDF files or raw text as input. It uses **OCR** (for scanned/image-based PDFs) and **NLP summarization** to extract the key points and return a condensed summary. The model logic is explored in `SummerizationModelipynb_v3.ipynb`.

Exposed as a REST API so it can be called directly from the web dashboard or mobile app.

---

## 📂 Files

| File | Description |
|---|---|
| `api.py` | Flask API — handles HTTP requests and responses |
| `main.py` | Core summarization logic (OCR pipeline + NLP model) |
| `requirements.txt` | Python dependencies |
| `SummerizationModelipynb_v3.ipynb` | Model development and evaluation notebook |
| `postman/` | Postman collection for testing the API |
| `OCR_SETUP.md` | Guide to setting up OCR dependencies |
| `POSTMAN_DOC.md` | API endpoint documentation |
| `RUN_PROJECT.md` | Detailed run instructions |

---

## 🚀 Running Locally

### Prerequisites
- Python 3.8+
- pip
- Tesseract OCR installed on your system (see [`OCR_SETUP.md`](OCR_SETUP.md))

### Setup

```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python api.py
```

The API will be available at `http://localhost:5001`.

For detailed setup and usage instructions, see [`RUN_PROJECT.md`](RUN_PROJECT.md).

---

## 📡 API

```
POST /summarize
Content-Type: multipart/form-data

file: <PDF file>
```

Returns a structured text summary of the uploaded document.

See [`POSTMAN_DOC.md`](POSTMAN_DOC.md) for the full endpoint reference and example requests.
