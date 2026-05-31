from fastapi import FastAPI
from  pydantic import baseModel
app = FastAPI()
class Product(baseModel):
    code:str
    id:str
@app.get('/')
def read_root():
    return {"server is running"}
@app.post('/render')
async def render(product:Product):
    print (product.code)
    
    return {"result":"rendered",
             "code":product.code,
            "id":product.id
            }

@app.post('/generate')
async def generate(product:Product):
    with open('../generated/script.py', 'w') as f :
        f.write(Product.code)  
    result = subprocess.run(
        [
            "/Applications/Blender.app/Contents/MacOS/Blender",
            "-b",
            "-P",
            "generated/script.py"
        ],
        capture_output=True,
        text=True
    )

    return {
        "success": result.returncode == 0,
        "stdout": result.stdout,
        "stderr": result.stderr
    }





















