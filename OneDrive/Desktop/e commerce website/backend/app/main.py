from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import products, recommendations

app = FastAPI(title="Ecom-ML API")

app.add_middleware(
    CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        
        
    )
    
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(recommendations.router, prefix="/api/recommend", tags=["recommender"])

