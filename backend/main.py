from fastapi import FastAPI
from .routes.generation.controller import router as generation_router
from .routes.sources.controller import router as sources_router
app = FastAPI()

app.include_router(generation_router)
app.include_router(sources_router)

@app.get("/")
def root():
    return {"message" : "hello world"}
