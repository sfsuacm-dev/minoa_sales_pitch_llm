import PyPDF2
import csv
import re

def extract_title(text):
    lines = text.split('\n')
    
    return ' '.join([lines[1].strip(), lines[2].strip()]).strip() if lines else 'Untitled Document'

def extract_description(text):
    match = re.search(r'Description:(.*?)(?:Read more|Note\(s\):)', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ''

def clean_pdf_to_csv(pdf_path, csv_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        
        # Extract the title from the first page
        first_page = reader.pages[0]
        document_title = extract_title(first_page.extract_text())
        
        with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Title', 'Description'])
            
            for page in reader.pages:
                text = page.extract_text()
                description = extract_description(text)
                if description:
                    writer.writerow([document_title, description])

# Usage
pdf_path = 'graph.pdf' # Change to our file path before running
csv_path = 'csvcleanedpdf.csv' # does not append to existing file
clean_pdf_to_csv(pdf_path, csv_path)