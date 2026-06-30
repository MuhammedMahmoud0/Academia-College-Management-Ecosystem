# Postman API Guide

This document shows how to test your API endpoints with Postman.

## Files Created

- `postman/PDF_Summarization_API.postman_collection.json`
- `postman/PDF_Summarization_API.postman_environment.json`

## Prerequisites

1. Activate your virtual environment.
2. Start Ollama and ensure `llava` model is available.
3. Start FastAPI server:

```powershell
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

## Import into Postman

1. Open Postman.
2. Click **Import**.
3. Import these two files:
   - `postman/PDF_Summarization_API.postman_collection.json`
   - `postman/PDF_Summarization_API.postman_environment.json`
4. Select environment: **PDF Summarization Local**.

## Endpoints in Collection

1. **Root**
   - Method: `GET`
   - URL: `{{baseUrl}}/`

2. **Health**
   - Method: `GET`
   - URL: `{{baseUrl}}/health`

3. **Summarize Upload**
   - Method: `POST`
   - URL: `{{baseUrl}}/summarize/upload`
   - Body: `form-data`
   - Field: `file` (type `File`)
   - Action: Pick a PDF from your machine in Postman.

4. **Summarize Path**
   - Method: `POST`
   - URL: `{{baseUrl}}/summarize/path`
   - Body: raw JSON

```json
{
  "pdf_path": "{{pdfPath}}"
}
```

5. **Summarize Upload Structured**
    - Method: `POST`
    - URL: `{{baseUrl}}/summarize/upload/structured`
    - Body: `form-data`
    - Field: `file` (type `File`)

6. **Summarize Path Structured**
    - Method: `POST`
    - URL: `{{baseUrl}}/summarize/path/structured`
    - Body: raw JSON

```json
{
   "pdf_path": "{{pdfPath}}"
}
```

## Expected Response Type

All endpoints return `application/json`.

Success response examples include fields like:
- `status`, `ollama`
- `filename`, `summary`, `output_file`
- `pdf_path`, `summary`, `output_file`
- `structured_pages`, `page_count`

Each item in `structured_pages` includes:
- `page_number`
- `source_type` (`text` or `visual`)
- `main_topic`
- `key_points` (array)
- `terms_to_remember` (array)
- `exam_tip`
- `one_line_recap`
- `raw_text`

Error responses use:

```json
{
  "detail": "error message"
}
```

## Notes

- The first summarize request may be slower due to model loading.
- Keep Ollama running before sending summarize requests.
