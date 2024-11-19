import PyPDF2
import csv
import re
import os
import argparse
from dependencies.firebase_interface import FirestoreWorker

def extract_title(text):
    lines = text.split('\n')
    title = ""
    for i in range(len(lines)):
        if i == 0:
            continue
        
        if i > 1:
            title+=" "

        title += lines[i].strip()
    return title
    # return ' '.join([lines[1].strip(), lines[2].strip()]).strip() if lines else 'Untitled Document'

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
        
        with open(csv_path, mode='a', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            # writer.writerow(['Title', 'Description'])
            
            for page in reader.pages:
                text = page.extract_text()
                description = extract_description(text)
                if description:
                    writer.writerow([document_title, description])

def ingest_data(csv_path, source_class : str):
    firestore_obj = FirestoreWorker()

    with open(csv_path, mode="r", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        header = next(reader, None)

        for row in reader:
            document_title = row["Title"]
            text_chunk = row["Chunk"]
            firestore_obj.write_rag_document_chunk(document_title, text_chunk, source_class)

def main():
    # pdf_path = 'graph.pdf' # Change to our file path before running
    # csv_path = './results.csv' # does not append to existing file
    # clean_pdf_to_csv(pdf_path, csv_path)
    parser = argparse.ArgumentParser(description="Process PDFs in inputted directory")
    parser.add_argument("--directory_name", type=str, required=True, help="Directory with PDFs")
    parser.add_argument("--source_type", type=int, required=True, help="The source category being inputted")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))

    results_csv_path = os.path.join(script_dir, "results.csv")

    with open(results_csv_path, mode="a", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(["Title", "Chunk"])

    args = parser.parse_args()
    folder_path = os.path.join(script_dir, args.directory_name)

    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        print(f"parsing file: {file}...")
        clean_pdf_to_csv(file_path, results_csv_path)

    ingest_data(results_csv_path, args.source_type)

if __name__ == "__main__":
    main()