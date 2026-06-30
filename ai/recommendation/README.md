# Course Recommendation Model

An AI-powered course recommendation service that suggests relevant courses to students based on their interests and academic profile.

[![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat-square&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-API-black?style=flat-square&logo=flask)](https://flask.palletsprojects.com)

---

## 🧠 How It Works

The model uses **cross-score similarity** on course data sourced from the Coursera dataset (`Coursera.csv`). Given a student's interests or enrolled courses, it computes similarity scores and returns the top recommended courses ranked by relevance.

The core logic is documented and explored in `Course_Recommendation_cross_score_gem.ipynb`.

---

## 📂 Files

| File | Description |
|---|---|
| `app.py` | Flask API server exposing the recommendation endpoint |
| `requirements.txt` | Python dependencies |
| `Course_Recommendation_cross_score_gem.ipynb` | Model training and exploration notebook |
| `Coursera.csv` | Course dataset used for recommendations |

---

## 🚀 Running Locally

### Prerequisites
- Python 3.8+
- pip

### Setup

```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

The API will be available at `http://localhost:5000`.

---

## 📡 API

```
POST /recommend
Content-Type: application/json

{
  "interests": ["machine learning", "data science"]
}
```

Returns a ranked list of recommended courses.
