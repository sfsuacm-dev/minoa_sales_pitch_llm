import re
import PyPDF2
import csv
import os

# This file will extract text from a PDF file and clean it

def extract_and_clean_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)

        text = []
        for page_num in range(num_pages):
            page = reader.pages[page_num]
            text.append(page.extract_text())

    full_text = '\n'.join(text)

    cleaned_lines = []
    for line in full_text.split('\n'):
        line = line.strip()
        if line:
            cleaned_lines.append(line)

    cleaned_text = '\n'.join(cleaned_lines)
    

    cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)  
    cleaned_text = re.sub(r'\s*-\s+', '-', cleaned_text)    
    cleaned_text = re.sub(r'\s*–\s+', '–', cleaned_text)   
    
    return cleaned_text.strip()

def main():
    pdf_path = "stat.pdf"  # CHANGE TO YOUR FILE PATH BEFORE RUNNING
    
    # Clean text 
    cleaned_text = extract_and_clean_pdf(pdf_path)
    
    if cleaned_text:
        # Extract line
        title = cleaned_text.split('\n')[0]
        
        # Save the cleaned text to a CSV file
        output_path = "csvcleanedpdf.csv"
        
        # Check if file exists to find out if headers need to be written or appended
        file_exists = os.path.isfile(output_path)
        
        with open(output_path, 'a', encoding='utf-8', newline='') as file:
            writer = csv.writer(file)
            
            # Write headers if file is new, otherwise skip
            if not file_exists:
                writer.writerow(['Title', 'Text'])
            
            # Write the title and each paragraph/sentence to the CSV
            for line in cleaned_text.split('\n'):
                writer.writerow([title, line])
        
        print(f"Text has been appended to {output_path}")
    else:
        print("Failed to process the PDF file. Check File Path.")

if __name__ == "__main__":
    main()