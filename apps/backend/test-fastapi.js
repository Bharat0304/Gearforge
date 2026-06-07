import axios from 'axios';
async function main() {
  try {
    console.log("Sending request to FastAPI...");
    const res = await axios.post('http://127.0.0.1:8000/render', {
      code: "import bpy\nbpy.ops.mesh.primitive_cube_add()",
      id: "test1234"
    });
    console.log("Response:", res.data);
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}
main();
