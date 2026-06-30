# OCR Setup Guide

## Installation Steps

### 1. Install Python Packages
```bash
pip install pytesseract Pillow
```

### 2. Install Tesseract-OCR Engine

#### Windows:
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer (recommended: `tesseract-ocr-w64-setup-5.3.3.exe`)
3. During installation, note the installation path (default: `C:\Program Files\Tesseract-OCR`)
4. Add Tesseract to your Python script OR system PATH:

**Option A: Set in Python (Recommended)**
Add this to your code before using pytesseract:
```python
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

**Option B: Add to System PATH**
- Right-click "This PC" → Properties → Advanced System Settings
- Environment Variables → System Variables → Path → Edit
- Add: `C:\Program Files\Tesseract-OCR`

#### Mac:
```bash
brew install tesseract
```

#### Linux:
```bash
sudo apt-get install tesseract-ocr
```

### 3. Verify Installation
```bash
tesseract --version
```

## How OCR Preprocessing Works

1. **Automatic Fallback**: When pdfplumber extracts <20 words, OCR kicks in automatically
2. **Confidence Filtering**: Only accepts OCR results with >60% confidence (configurable)
3. **Best-of-Both**: Compares pdfplumber vs OCR and uses whichever extracted more text
4. **Smart Caching**: Converts pages to images only when needed

## Configuration

In `main.py`, adjust these settings:
```python
CONFIG = {
    "use_ocr": True,  # Enable/disable OCR
    "ocr_confidence_threshold": 60,  # 0-100, higher = more selective
    "dpi": 200,  # Higher = better OCR quality but slower
}
```

## Troubleshooting

**Error: "pytesseract not installed"**
- The script will work but without OCR enhancement
- Install: `pip install pytesseract pillow`

**Error: "tesseract is not installed"**
- Install Tesseract engine (see step 2 above)

**Error: "Failed to execute tesseract"**
- Set path manually: `pytesseract.pytesseract.tesseract_cmd = r'YOUR_PATH\tesseract.exe'`

**Poor OCR Quality**
- Increase DPI: `CONFIG["dpi"] = 300`
- Lower confidence threshold: `CONFIG["ocr_confidence_threshold"] = 50`
