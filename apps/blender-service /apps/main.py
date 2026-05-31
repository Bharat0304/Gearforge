from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import os

app = FastAPI()

class Product(BaseModel):
    code: str
    id: str

@app.get('/')
def read_root():
    return {"server is running"}

@app.post('/render')
async def render(product: Product):
    script_path = f"generated/script.py"
    render_path = os.path.abspath(f"generated/render.png")
    
    os.makedirs("generated", exist_ok=True)
    
    # Force absolute path in the generated code
    modified_code = product.code.replace('"//render.png"', f'"{render_path}"')
    modified_code = modified_code.replace('"render.png"', f'"{render_path}"')
    
    # 2. Save the code as script.py.
    with open(script_path, 'w') as f:
        f.write(modified_code)
        
    # 3. Execute Blender using subprocess.
    result = subprocess.run(
        [
            "/Applications/Blender.app/Contents/MacOS/Blender",
            "-b",
            "-P",
            script_path
        ],
        capture_output=True,
        text=True
    )
    
    # 5. Detect execution failures.
    success = (result.returncode == 0)
    
    # 6. Verify render.png was generated.
    render_generated = os.path.exists(render_path)
    if success and not render_generated:
        success = False
        
    # 7. Return execution result.
    return {
        "success": success,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "renderPath": render_path if render_generated else None,
        "code": product.code,
        "id": product.id
    }

