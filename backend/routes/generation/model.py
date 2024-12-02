from pydantic import BaseModel

class pitch_generation_request(BaseModel):
    seller_name : str
    company_name : str
    linkedin_url : str | None=None
    client_name : str | None=None
    client_additional_info : str | None=None
    product_name : str
    product_description : str
    selected_source_ids : list[int] | None=None #list of source ids

class pitch_generation_response(BaseModel):
    generated_sales_pitch : str
    name_documents_used : list[str] | None=None
    links_to_documents : list[str] | None=None

