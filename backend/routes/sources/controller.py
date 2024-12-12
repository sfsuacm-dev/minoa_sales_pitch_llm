from fastapi import APIRouter, HTTPException
from .model import all_source_info_response, source_info_response
from ...dependencies.firebase_interface import FirestoreWorker
import logging
router = APIRouter(
    prefix="/sources"
)

db_worker = FirestoreWorker()

@router.get("/all_sources", response_model=list[all_source_info_response])
def get_all_sources() -> all_source_info_response :
    
    try:
        all_sources_dict = db_worker.get_rag_sources_types()
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500, detail=e)
    
    return all_sources_dict


@router.get("/source/{source_id}")
def get_source(source_id : int) -> source_info_response:
    pass


