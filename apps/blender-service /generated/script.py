import bpy
import bmesh
from mathutils import Vector

# Clear existing mesh objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Create Drone collection
drone_collection = bpy.data.collections.new("Drone")
bpy.context.scene.collection.children.link(drone_collection)

# Materials
def create_material(name, color):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs[0].default_value = (*color, 1.0)
    bsdf.inputs[4].default_value = 0.2
    bsdf.inputs[7].default_value = 0.8
    return mat

body_mat = create_material("BodyMaterial", (0.2, 0.2, 0.2))
arm_mat = create_material("ArmMaterial", (0.15, 0.15, 0.15))
propeller_mat = create_material("PropellerMaterial", (0.1, 0.1, 0.1))
camera_mat = create_material("CameraMaterial", (0.05, 0.05, 0.05))
battery_mat = create_material("BatteryMaterial", (0.3, 0.1, 0.1))
leg_mat = create_material("LegMaterial", (0.8, 0.8, 0.8))

# Create main drone body
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
drone_body = bpy.context.object
drone_body.name = "DroneBody"
drone_body.scale = (0.12, 0.12, 0.04)
bpy.ops.object.transform_apply(transform_type='SCALE')
drone_body.data.materials.append(body_mat)
drone_collection.objects.link(drone_body)
bpy.context.scene.collection.objects.unlink(drone_body)

# Create four arms
arm_positions = [
    (0.15, 0.15, 0),   # Front Left
    (-0.15, 0.15, 0),  # Front Right  
    (-0.15, -0.15, 0), # Rear Left
    (0.15, -0.15, 0)   # Rear Right
]

arm_names = ["Arm_FL", "Arm_FR", "Arm_RL", "Arm_RR"]

for i, (pos, name) in enumerate(zip(arm_positions, arm_names)):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.2, location=pos)
    arm = bpy.context.object
    arm.name = name
    arm.rotation_euler = (0, 1.5708, 0)
    bpy.ops.object.transform_apply(transform_type='ROTATION')
    arm.data.materials.append(arm_mat)
    drone_collection.objects.link(arm)
    bpy.context.scene.collection.objects.unlink(arm)

# Create four propellers
propeller_positions = [
    (0.25, 0.15, 0.02),   # Front Left
    (-0.25, 0.15, 0.02),  # Front Right
    (-0.25, -0.15, 0.02), # Rear Left
    (0.25, -0.15, 0.02)   # Rear Right
]

propeller_names = ["Propeller_FL", "Propeller_FR", "Propeller_RL", "Propeller_RR"]

for pos, name in zip(propeller_positions, propeller_names):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=0.003, location=pos)
    propeller = bpy.context.object
    propeller.name = name
    
    # Create propeller blades
    bpy.ops.object.mode_set(mode='EDIT')
    bm = bmesh.from_mesh(propeller.data)
    
    # Extrude and shape propeller
    bmesh.ops.inset_faces(bm, faces=bm.faces, thickness=0.12, depth=0.0)
    for face in bm.faces:
        if face.select:
            bmesh.ops.extrude_face_region(bm, geom=[face])
    
    bm.to_mesh(propeller.data)
    bm.free()
    bpy.ops.object.mode_set(mode='OBJECT')
    
    propeller.data.materials.append(propeller_mat)
    drone_collection.objects.link(propeller)
    bpy.context.scene.collection.objects.unlink(propeller)

# Create camera mount
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0.08, -0.025))
camera_mount = bpy.context.object
camera_mount.name = "CameraMount"
camera_mount.scale = (0.03, 0.025, 0.015)
bpy.ops.object.transform_apply(transform_type='SCALE')
camera_mount.data.materials.append(camera_mat)
drone_collection.objects.link(camera_mount)
bpy.context.scene.collection.objects.unlink(camera_mount)

# Create camera
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0.12, -0.025))
camera_obj = bpy.context.object
camera_obj.name = "Camera"
camera_obj.scale = (0.025, 0.02, 0.02)
bpy.ops.object.transform_apply(transform_type='SCALE')
camera_obj.data.materials.append(camera_mat)
drone_collection.objects.link(camera_obj)
bpy.context.scene.collection.objects.unlink(camera_obj)

# Create battery compartment
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, -0.06, -0.015))
battery = bpy.context.object
battery.name = "BatteryCompartment"
battery.scale = (0.08, 0.04, 0.025)
bpy.ops.object.transform_apply(transform_type='SCALE')
battery.data.materials.append(battery_mat)
drone_collection.objects.link(battery)
bpy.context.scene.collection.objects.unlink(battery)

# Create landing legs
leg_positions = [
    (0.1, 0.1, -0.06),
    (-0.1, 0.1, -0.06),
    (-0.1, -0.1, -0.06),
    (0.1, -0.1, -0.06)
]

for i, pos in enumerate(leg_positions):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.004, depth=0.08, location=pos)
    leg = bpy.context.object
    leg.name = f"LandingLeg_{i+1}"
    leg.data.materials.append(leg_mat)
    drone_collection.objects.link(leg)
    bpy.context.scene.collection.objects.unlink(leg)

# Group legs under one object
bpy.ops.object.select_all(action='DESELECT')
for obj in drone_collection.objects:
    if "LandingLeg" in obj.name:
        obj.select_set(True)

bpy.ops.object.join()
bpy.context.object.name = "LandingLegs"

# Add render camera
bpy.ops.object.camera_add(location=(0.8, -0.8, 0.4))
render_camera = bpy.context.object
render_camera.rotation_euler = (1.1, 0, 0.785)

# Add lighting
bpy.ops.object.light_add(type='SUN', location=(2, 2, 4))
sun_light = bpy.context.object
sun_light.data.energy = 3

bpy.ops.object.light_add(type='AREA', location=(-1, 1, 2))
area_light = bpy.context.object
area_light.data.energy = 50
area_light.data.size = 2

# Set active camera
bpy.context.scene.camera = render_camera

# Configure render settings
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.resolution_percentage = 100
bpy.context.scene.cycles.samples = 128

# Set render output
bpy.context.scene.render.filepath = "/Users/user/Projects/GearForge/apps/blender-service /generated/render.png"

# Render
bpy.ops.render.render(write_still=True)