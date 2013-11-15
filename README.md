nodeOCR:
======
Uses nodecr to run tesseract on base64 encoded images from POST and returns the OCR'ed text.

To install:
===
 1. Install [node.js.](http://nodejs.org)
 2. Install [tesseract-3.01.](https://code.google.com/p/tesseract-ocr/downloads/detail?name=tesseract-ocr-setup-3.01-1.exe)
 3. Open install.bat to install nodecr.
 2. Open run.bat to start nodeOCR.
 3. Local webserver will run at [http://localhost:8888.](http://localhost:8888)
 4. Send XHR with jpeg base64 encoded image as POST body.
 5. nodeOCR will run tesseract on image and return OCR'ed text.
