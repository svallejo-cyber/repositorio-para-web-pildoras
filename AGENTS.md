# Repo Rules

## Pildora PDFs with images

- Do not publish a pill PDF with embedded screenshots or photos until the final PDF has been rendered to page images and visually checked.
- Any sign of clipping, right-edge truncation, overlap, or unreadable scaling is a blocking defect.
- For wide screenshots, prefer fixed image widths and pre-scaled assets instead of only fluid `max-width` rules in the HTML source.
- The release check for image-based PDFs is:
  1. regenerate PDF
  2. render PDF pages to PNG
  3. inspect rendered pages
  4. only then commit and push
