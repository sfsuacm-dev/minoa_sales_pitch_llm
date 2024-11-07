from fastapi import FastAPI
from .routes.generation.controller import router as generation_router
app = FastAPI()

app.include_router(generation_router)

@app.get("/")
def root():
    return {"message" : "hello world"}
