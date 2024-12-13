from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes.generation.controller import router as generation_router
from .routes.sources.controller import router as sources_router
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

app.include_router(generation_router)
app.include_router(sources_router)

app.mount("/", StaticFiles(directory="build", html=True), name = "static")
