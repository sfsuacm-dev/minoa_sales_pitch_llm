from pydantic import BaseModel

class all_source_info_response(BaseModel):
    source_id : int
    source_name : str
    source_description : str

class source_info_response(BaseModel):
    source_id : int
    source_name : str
    source_description: str