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
    
    # Save the generated scene so that we can use it to generate the video
    scene_path = os.path.abspath(f"generated/scene_{product.id}.blend")
    glb_path = os.path.abspath(f"generated/model_{product.id}.glb")
    
    modified_code += f"\n\nimport bpy\n"
    modified_code += f"bpy.ops.wm.save_as_mainfile(filepath='{scene_path}')\n"
    modified_code += f"try:\n    bpy.ops.export_scene.gltf(filepath='{glb_path}', export_format='GLB')\nexcept Exception as e:\n    print('GLB Export Failed:', e)\n"

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
        "glbPath": glb_path if success and os.path.exists(glb_path) else None,
        "blendPath": scene_path if success and os.path.exists(scene_path) else None,
        "code": product.code,
        "id": product.id
    }

@app.post("/generate-video")
def generate_video(product: Product):

    scene_path = f"generated/scene_{product.id}.blend"

    video_path = os.path.abspath(
        f"generated/video_{product.id}.mp4"
    )
    
    script_path = f"generated/turntable_{product.id}.py"
    with open("templates/turntable.py", "r") as f:
        template_code = f.read()
    template_code = template_code.replace('"//preview.mp4"', f'"{video_path}"')
    
    with open(script_path, "w") as f:
        f.write(template_code)

    result = subprocess.run(
        [
            "/Applications/Blender.app/Contents/MacOS/Blender",
            "-b",
            scene_path,
            "-P",
            script_path
        ],
        capture_output=True,
        text=True
    )

    success = (
        result.returncode == 0 and
        os.path.exists(video_path)
    )

    return {
        "success": success,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "videoPath": video_path if success else None,
        "id": product.id
    }