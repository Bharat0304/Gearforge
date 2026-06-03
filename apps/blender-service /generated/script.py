import bpy

# Clear existing mesh objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Create drone frame center
bpy.ops.mesh.primitive_cube_add(size=0.15, location=(0, 0, 0))
frame_center = bpy.context.object
frame_center.name = "Frame_Center"

# Create four arms
arm_positions = [(0.2, 0, 0), (-0.2, 0, 0), (0, 0.2, 0), (0, -0.2, 0)]
arm_rotations = [(0, 0, 0), (0, 0, 0), (0, 0, 1.5708), (0, 0, 1.5708)]

for i, (pos, rot) in enumerate(zip(arm_positions, arm_rotations)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    arm = bpy.context.object
    arm.name = f"Arm_{i+1}"
    arm.scale = (0.25, 0.05, 0.02)
    arm.rotation_euler = rot

# Create motors at arm ends
motor_positions = [(0.32, 0, 0.02), (-0.32, 0, 0.02), (0, 0.32, 0.02), (0, -0.32, 0.02)]

for i, pos in enumerate(motor_positions):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=0.04, location=pos)
    motor = bpy.context.object
    motor.name = f"Motor_{i+1}"

# Create propellers
propeller_positions = [(0.32, 0, 0.05), (-0.32, 0, 0.05), (0, 0.32, 0.05), (0, -0.32, 0.05)]

for i, pos in enumerate(propeller_positions):
    # Create propeller blade 1
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    prop1 = bpy.context.object
    prop1.name = f"Propeller_{i+1}_Blade1"
    prop1.scale = (0.12, 0.02, 0.002)
    
    # Create propeller blade 2
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    prop2 = bpy.context.object
    prop2.name = f"Propeller_{i+1}_Blade2"
    prop2.scale = (0.02, 0.12, 0.002)

# Create landing gear
bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.15, location=(0.25, 0.25, -0.075))
leg1 = bpy.context.object
leg1.name = "Landing_Gear_1"

bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.15, location=(-0.25, 0.25, -0.075))
leg2 = bpy.context.object
leg2.name = "Landing_Gear_2"

bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.15, location=(0.25, -0.25, -0.075))
leg3 = bpy.context.object
leg3.name = "Landing_Gear_3"

bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.15, location=(-0.25, -0.25, -0.075))
leg4 = bpy.context.object
leg4.name = "Landing_Gear_4"

# Create camera gimbal
bpy.ops.mesh.primitive_cube_add(size=0.08, location=(0, -0.1, -0.04))
camera_gimbal = bpy.context.object
camera_gimbal.name = "Camera_Gimbal"

# Create battery
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.03))
battery = bpy.context.object
battery.name = "Battery"
battery.scale = (0.08, 0.04, 0.025)

# Add materials
# Frame material (carbon fiber look)
frame_mat = bpy.data.materials.new(name="Frame_Material")
frame_mat.use_nodes = True
frame_mat.node_tree.nodes.clear()
bsdf = frame_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
output = frame_mat.node_tree.nodes.new(type='ShaderNodeOutputMaterial')
frame_mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
bsdf.inputs['Base Color'].default_value = (0.1, 0.1, 0.1, 1.0)
bsdf.inputs['Roughness'].default_value = 0.2

# Apply materials
frame_center.data.materials.append(frame_mat)
for obj in bpy.data.objects:
    if 'Arm' in obj.name:
        obj.data.materials.append(frame_mat)

# Motor material
motor_mat = bpy.data.materials.new(name="Motor_Material")
motor_mat.use_nodes = True
motor_mat.node_tree.nodes.clear()
bsdf_motor = motor_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
output_motor = motor_mat.node_tree.nodes.new(type='ShaderNodeOutputMaterial')
motor_mat.node_tree.links.new(bsdf_motor.outputs['BSDF'], output_motor.inputs['Surface'])
bsdf_motor.inputs['Base Color'].default_value = (0.3, 0.3, 0.3, 1.0)
bsdf_motor.inputs['Metallic'].default_value = 0.8

for obj in bpy.data.objects:
    if 'Motor' in obj.name:
        obj.data.materials.append(motor_mat)

# Add camera
bpy.ops.object.camera_add(location=(1.5, -1.5, 1.2))
camera = bpy.context.object
camera.rotation_euler = (1.1, 0, 0.785)

# Add light
bpy.ops.object.light_add(type='SUN', location=(2, 2, 5))
light = bpy.context.object
light.data.energy = 3

# Set camera as active
bpy.context.scene.camera = camera

# Configure render settings
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.filepath = "/Users/user/Projects/GearForge/apps/blender-service /generated/render.png"

# Render
bpy.ops.render.render(write_still=True)

import bpy
bpy.ops.wm.save_as_mainfile(filepath='/Users/user/Projects/GearForge/apps/blender-service /generated/scene_c7726e72-fd94-4dd0-885b-bab36d2c45b9.blend')
try:
    bpy.ops.export_scene.gltf(filepath='/Users/user/Projects/GearForge/apps/blender-service /generated/model_c7726e72-fd94-4dd0-885b-bab36d2c45b9.glb', export_format='GLB')
except Exception as e:
    print('GLB Export Failed:', e)
