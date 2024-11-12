# this will parse the pdf file without any cleaning

import PyPDF2

def parse_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

def save_to_txt(text, output_path):
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(text)

file_path = 'PATH_TO_PDF_HERE' # change to your file path
output_path = 'uncleanedpdf.txt'

parsed_text = parse_pdf(file_path)
save_to_txt(parsed_text, output_path)
print(f"Text has been saved to {output_path}")