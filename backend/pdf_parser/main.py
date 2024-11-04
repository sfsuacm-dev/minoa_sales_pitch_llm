import PyPDF2
import re

def extract_and_clean_pdf(pdf_path):
    """
    Extract text from PDF and clean it with enhanced filtering for table of contents
    and data tables.
    """
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            full_text = ""
            
            for page in pdf_reader.pages:
                text = page.extract_text()
                # First cleaning pass before adding to full text
                text = initial_clean(text)
                full_text += text + "\n"
            
            # Final cleaning
            cleaned_text = deep_clean(full_text)
            return cleaned_text
                
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        return None

def initial_clean(text):
    """
    Initial cleaning pass to handle basic formatting and remove obvious non-narrative content
    """
    # Remove table of contents entries (pattern: text followed by page number)
    text = re.sub(r'^.*?\s+\d+\s*$', '', text, flags=re.MULTILINE)
    
    # Remove source citations
    text = re.sub(r'Sources?: .*?(?=\n|$)', '', text, flags=re.MULTILINE)
    
    # Remove lines that are just numbers or percentages
    text = re.sub(r'^\s*[\d,.]+%?\s*$', '', text, flags=re.MULTILINE)
    
    # Remove data table rows (pattern: text followed by numbers and/or percentages)
    text = re.sub(r'^.*?\s+[\d,.]+(\s+[\d,.]+)*\s*%?\s*$', '', text, flags=re.MULTILINE)
    
    return text

def deep_clean(text):
    """
    Deep cleaning to remove unwanted elements while preserving narrative content
    """
    # Split into lines for better processing
    lines = text.split('\n')
    cleaned_lines = []
    
    # Patterns to identify non-narrative content
    patterns_to_remove = [
        r'^\s*Table of contents.*$',  # Table of contents headers
        r'^\s*CHAPTER\s+\d+\s*$',     # Chapter numbers
        r'^\s*\d+\s*$',               # Standalone numbers
        r'^.*?\s+\d+\s*$',            # Text followed by page number
        r'^\s*[\d,.]+%?\s*$',         # Standalone numbers or percentages
        r'^.*?\s+[\d,.]+(\s+[\d,.]+)*\s*%?\s*$',  # Data table rows
        r'^\s*\([12]\)\s*$',          # Footnote references
        r'^\s*Notes?: ',              # Notes sections
        r'^\s*Overview\s*\d*\s*$',    # Overview headers with optional numbers
        r'.*Stock\s+in\s+\d{4}.*$',   # Stock data headers
        r'.*Share\s+in\s+the\s+total.*$',  # Share data headers
        r'^\s*[A-Za-z\s-]+\s*:\s*\d+\s*$'  # Label: number format
    ]
    
    # Flag to track if we're in a table of contents or data table section
    in_toc_or_table = False
    
    for line in lines:
        line = line.strip()
        
        # Skip empty lines
        if not line:
            continue
        
        # Check for section headers that indicate start of TOC or data tables
        if re.search(r'Table of contents|Overview|Comparison|Analysis', line, re.IGNORECASE):
            in_toc_or_table = True
            continue
            
        # Check for patterns that might indicate end of TOC or data table section
        if in_toc_or_table and re.match(r'^[A-Z][a-z]+.*?[.!?]', line):
            in_toc_or_table = False
            
        # Skip lines if we're in TOC or data table section
        if in_toc_or_table:
            continue
            
        # Check against patterns to remove
        should_keep = True
        for pattern in patterns_to_remove:
            if re.match(pattern, line):
                should_keep = False
                break
        
        if should_keep:
            # Clean up the line
            cleaned_line = re.sub(r'\s{2,}', ' ', line)  # Remove extra spaces
            cleaned_line = re.sub(r'\s+([,.!?])', r'\1', cleaned_line)  # Fix punctuation spacing
            cleaned_line = re.sub(r'([,.!?])([^\s])', r'\1 \2', cleaned_line)
            
            if cleaned_line:
                cleaned_lines.append(cleaned_line)
    
    # Join lines back together
    cleaned_text = '\n'.join(cleaned_lines)
    
    # Final cleanup
    cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)  # Remove excessive newlines
    cleaned_text = re.sub(r'\s*-\s+', '-', cleaned_text)    # Fix hyphenation
    cleaned_text = re.sub(r'\s*–\s+', '–', cleaned_text)    # Fix en-dashes
    
    return cleaned_text.strip()

def main():
    # Define the PDF path
    pdf_path = "PATH_TO_PDF_HERE"  # Change to your file path
    
    # Extract and clean the text
    cleaned_text = extract_and_clean_pdf(pdf_path)
    
    if cleaned_text:
        # Save the cleaned text to a file
        output_path = "cleanedpdf.txt"
        with open(output_path, 'w', encoding='utf-8') as file:
            file.write(cleaned_text)
        print(f"Cleaned text has been saved to {output_path}")
    else:
        print("Failed to process the PDF file.")
if __name__ == "__main__":
    main()