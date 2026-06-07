import bpy
import bmesh
from mathutils import Vector
import math

# Clear existing mesh objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Create base
bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=0.1, location=(0, 0, 0.05))
base = bpy.context.active_object
base.name = 'Base'

# Create base material
base_mat = bpy.data.materials.new(name='BaseMaterial')
base_mat.use_nodes = True
bsdf = base_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf.inputs['Base Color'].default_value = (0.2, 0.2, 0.2, 1.0)
bsdf.inputs['Metallic'].default_value = 0.8
base.data.materials.append(base_mat)

# Create shoulder joint
bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.12, location=(0, 0, 0.16))
shoulder_joint = bpy.context.active_object
shoulder_joint.name = 'ShoulderJoint'
shoulder_joint.rotation_euler = (math.radians(90), 0, 0)

# Create upper arm
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.3, location=(0, 0.15, 0.16))
upper_arm = bpy.context.active_object
upper_arm.name = 'UpperArm'
upper_arm.rotation_euler = (math.radians(90), 0, 0)

# Create elbow joint
bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.1, location=(0, 0.3, 0.16))
elbow_joint = bpy.context.active_object
elbow_joint.name = 'ElbowJoint'
elbow_joint.rotation_euler = (0, math.radians(90), 0)

# Create forearm
bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.25, location=(0.125, 0.3, 0.16))
forearm = bpy.context.active_object
forearm.name = 'Forearm'
forearm.rotation_euler = (0, math.radians(90), 0)

# Create wrist joint 1
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.08, location=(0.25, 0.3, 0.16))
wrist_joint1 = bpy.context.active_object
wrist_joint1.name = 'WristJoint1'
wrist_joint1.rotation_euler = (0, math.radians(90), 0)

# Create wrist joint 2
bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.06, location=(0.29, 0.3, 0.16))
wrist_joint2 = bpy.context.active_object
wrist_joint2.name = 'WristJoint2'
wrist_joint2.rotation_euler = (math.radians(90), 0, 0)

# Create end effector base
bpy.ops.mesh.primitive_cube_add(size=0.06, location=(0.32, 0.3, 0.16))
end_effector = bpy.context.active_object
end_effector.name = 'EndEffector'

# Create gripper finger 1
bpy.ops.mesh.primitive_cube_add(size=0.02, location=(0.34, 0.32, 0.18))
finger1 = bpy.context.active_object
finger1.name = 'Finger1'
finger1.scale = (1, 0.5, 2)

# Create gripper finger 2
bpy.ops.mesh.primitive_cube_add(size=0.02, location=(0.34, 0.28, 0.18))
finger2 = bpy.context.active_object
finger2.name = 'Finger2'
finger2.scale = (1, 0.5, 2)

# Create servo motors at joints
servo_locations = [(0, 0, 0.1), (0, 0, 0.22), (0, 0.3, 0.22), (0.25, 0.3, 0.22), (0.29, 0.3, 0.22), (0.32, 0.3, 0.22)]
for i, loc in enumerate(servo_locations):
    bpy.ops.mesh.primitive_cube_add(size=0.06, location=loc)
    servo = bpy.context.active_object
    servo.name = f'Servo{i+1}'
    servo.scale = (1.5, 0.8, 0.6)
    # Apply servo material
    servo_mat = bpy.data.materials.new(name=f'ServoMaterial{i+1}')
    servo_mat.use_nodes = True
    servo_bsdf = servo_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
    servo_bsdf.inputs['Base Color'].default_value = (0.1, 0.1, 0.8, 1.0)
    servo.data.materials.append(servo_mat)

# Create wiring
bpy.ops.mesh.primitive_cylinder_add(radius=0.005, depth=0.5, location=(0.15, 0.15, 0.16))
wiring = bpy.context.active_object
wiring.name = 'Wiring'
wiring.rotation_euler = (0, math.radians(45), 0)
wiring_mat = bpy.data.materials.new(name='WiringMaterial')
wiring_mat.use_nodes = True
wiring_bsdf = wiring_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
wiring_bsdf.inputs['Base Color'].default_value = (1.0, 0.2, 0.2, 1.0)
wiring.data.materials.append(wiring_mat)

# Apply materials to arm segments
arm_mat = bpy.data.materials.new(name='ArmMaterial')
arm_mat.use_nodes = True
arm_bsdf = arm_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
arm_bsdf.inputs['Base Color'].default_value = (0.6, 0.6, 0.6, 1.0)
arm_bsdf.inputs['Metallic'].default_value = 0.5

for obj_name in ['UpperArm', 'Forearm', 'ShoulderJoint', 'ElbowJoint', 'WristJoint1', 'WristJoint2', 'EndEffector']:
    if obj_name in bpy.data.objects:
        bpy.data.objects[obj_name].data.materials.append(arm_mat)

# Gripper material
gripper_mat = bpy.data.materials.new(name='GripperMaterial')
gripper_mat.use_nodes = True
gripper_bsdf = gripper_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
gripper_bsdf.inputs['Base Color'].default_value = (0.8, 0.8, 0.1, 1.0)
for obj_name in ['Finger1', 'Finger2']:
    if obj_name in bpy.data.objects:
        bpy.data.objects[obj_name].data.materials.append(gripper_mat)

# Add camera if none exists
if not any(obj.type == 'CAMERA' for obj in bpy.data.objects):
    bpy.ops.object.camera_add(location=(1.0, -1.0, 0.8))
    camera = bpy.context.active_object
    camera.rotation_euler = (math.radians(60), 0, math.radians(45))

# Add lighting
if not any(obj.type == 'LIGHT' for obj in bpy.data.objects):
    bpy.ops.object.light_add(type='SUN', location=(2, 2, 4))
    light = bpy.context.active_object
    light.data.energy = 3.0
    
    # Add fill light
    bpy.ops.object.light_add(type='AREA', location=(-1, -1, 2))
    fill_light = bpy.context.active_object
    fill_light.data.energy = 1.5

# Set render settings
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.render.filepath = '/Users/user/Projects/GearForge/apps/blender-service /generated/render_99ffd852-7dd9-4417-8738-83b33d56254f.png'
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.cycles.samples = 128

# Set camera as active
for obj in bpy.data.objects:
    if obj.type == 'CAMERA':
        bpy.context.scene.camera = obj
        break

import bpy

try:
    if not any(obj.type == 'CAMERA' for obj in bpy.data.objects):
        bpy.ops.object.camera_add(location=(5, -5, 5))
        cam = bpy.context.active_object
        cam.rotation_euler = (1.0, 0.0, 0.785)
        bpy.context.scene.camera = cam
    if not any(obj.type == 'LIGHT' for obj in bpy.data.objects):
        bpy.ops.object.light_add(type='SUN', location=(5, 5, 5))
except Exception as e:
    print('Failed to add default camera/light:', e)
try:
    bpy.context.scene.render.filepath = '/Users/user/Projects/GearForge/apps/blender-service /generated/render_99ffd852-7dd9-4417-8738-83b33d56254f.png'
    bpy.ops.render.render(write_still=True)
except Exception as e:
    print('Render Failed:', e)
try:
    bpy.ops.wm.save_as_mainfile(filepath='/Users/user/Projects/GearForge/apps/blender-service /generated/scene_99ffd852-7dd9-4417-8738-83b33d56254f.blend')
except Exception as e:
    print('Blend save failed:', e)
try:
    bpy.ops.export_scene.gltf(filepath='/Users/user/Projects/GearForge/apps/blender-service /generated/model_99ffd852-7dd9-4417-8738-83b33d56254f.glb', export_format='GLB')
except Exception as e:
    print('GLB Export Failed:', e)
