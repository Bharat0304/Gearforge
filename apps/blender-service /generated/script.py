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
bsdf.inputs['Roughness'].default_value = 0.3
base.data.materials.append(base_mat)

# Joint 1 - Base rotation
bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.12, location=(0, 0, 0.16))
joint1 = bpy.context.active_object
joint1.name = 'Joint1'
joint1_mat = bpy.data.materials.new(name='Joint1Material')
joint1_mat.use_nodes = True
bsdf1 = joint1_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf1.inputs['Base Color'].default_value = (0.8, 0.2, 0.2, 1.0)
bsdf1.inputs['Metallic'].default_value = 0.7
bsdf1.inputs['Roughness'].default_value = 0.2
joint1.data.materials.append(joint1_mat)

# Link 1 - First arm segment
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.35))
link1 = bpy.context.active_object
link1.name = 'Link1'
link1.scale = (0.06, 0.08, 0.3)
link1_mat = bpy.data.materials.new(name='Link1Material')
link1_mat.use_nodes = True
bsdf_l1 = link1_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf_l1.inputs['Base Color'].default_value = (0.3, 0.3, 0.8, 1.0)
bsdf_l1.inputs['Metallic'].default_value = 0.6
bsdf_l1.inputs['Roughness'].default_value = 0.4
link1.data.materials.append(link1_mat)

# Joint 2 - Shoulder
bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.1, location=(0, 0, 0.55))
joint2 = bpy.context.active_object
joint2.name = 'Joint2'
joint2.rotation_euler = (math.pi/2, 0, 0)
joint2.data.materials.append(joint1_mat)

# Link 2 - Upper arm
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.25, 0.55))
link2 = bpy.context.active_object
link2.name = 'Link2'
link2.scale = (0.05, 0.25, 0.06)
link2.data.materials.append(link1_mat)

# Joint 3 - Elbow
bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.08, location=(0, 0.5, 0.55))
joint3 = bpy.context.active_object
joint3.name = 'Joint3'
joint3.rotation_euler = (math.pi/2, 0, 0)
joint3.data.materials.append(joint1_mat)

# Link 3 - Forearm
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.7, 0.55))
link3 = bpy.context.active_object
link3.name = 'Link3'
link3.scale = (0.04, 0.2, 0.05)
link3.data.materials.append(link1_mat)

# Joint 4 - Wrist pitch
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.06, location=(0, 0.9, 0.55))
joint4 = bpy.context.active_object
joint4.name = 'Joint4'
joint4.rotation_euler = (math.pi/2, 0, 0)
joint4.data.materials.append(joint1_mat)

# Joint 5 - Wrist roll
bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.08, location=(0, 0.95, 0.55))
joint5 = bpy.context.active_object
joint5.name = 'Joint5'
joint5.data.materials.append(joint1_mat)

# Joint 6 - Wrist yaw
bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=0.04, location=(0, 1.0, 0.55))
joint6 = bpy.context.active_object
joint6.name = 'Joint6'
joint6.rotation_euler = (math.pi/2, 0, 0)
joint6.data.materials.append(joint1_mat)

# End effector - Gripper base
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 1.08, 0.55))
gripper_base = bpy.context.active_object
gripper_base.name = 'GripperBase'
gripper_base.scale = (0.04, 0.06, 0.03)
gripper_mat = bpy.data.materials.new(name='GripperMaterial')
gripper_mat.use_nodes = True
bsdf_g = gripper_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf_g.inputs['Base Color'].default_value = (0.9, 0.9, 0.1, 1.0)
bsdf_g.inputs['Metallic'].default_value = 0.9
bsdf_g.inputs['Roughness'].default_value = 0.1
gripper_base.data.materials.append(gripper_mat)

# Gripper finger 1
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.03, 1.12, 0.55))
finger1 = bpy.context.active_object
finger1.name = 'Finger1'
finger1.scale = (0.01, 0.04, 0.02)
finger1.data.materials.append(gripper_mat)

# Gripper finger 2
bpy.ops.mesh.primitive_cube_add(size=1, location=(-0.03, 1.12, 0.55))
finger2 = bpy.context.active_object
finger2.name = 'Finger2'
finger2.scale = (0.01, 0.04, 0.02)
finger2.data.materials.append(gripper_mat)

# Add servo motors at joints
for i, loc in enumerate([(0, 0, 0.22), (0, -0.1, 0.55), (0, 0.45, 0.55), (0, 0.85, 0.55), (0, 0.92, 0.55), (0, 0.98, 0.55)]):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    servo = bpy.context.active_object
    servo.name = f'Servo{i+1}'
    servo.scale = (0.04, 0.06, 0.03)
    servo_mat = bpy.data.materials.new(name=f'ServoMaterial{i+1}')
    servo_mat.use_nodes = True
    bsdf_s = servo_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf_s.inputs['Base Color'].default_value = (0.1, 0.1, 0.1, 1.0)
    bsdf_s.inputs['Metallic'].default_value = 0.9
    bsdf_s.inputs['Roughness'].default_value = 0.2
    servo.data.materials.append(servo_mat)

# Add control box
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.3, 0, 0.1))
control_box = bpy.context.active_object
control_box.name = 'ControlBox'
control_box.scale = (0.15, 0.2, 0.08)
control_mat = bpy.data.materials.new(name='ControlMaterial')
control_mat.use_nodes = True
bsdf_c = control_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf_c.inputs['Base Color'].default_value = (0.15, 0.15, 0.15, 1.0)
bsdf_c.inputs['Metallic'].default_value = 0.3
bsdf_c.inputs['Roughness'].default_value = 0.7
control_box.data.materials.append(control_mat)

# Add cables
for i in range(6):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.005, depth=0.8, location=(0.1 + i*0.02, 0, 0.4))
    cable = bpy.context.active_object
    cable.name = f'Cable{i+1}'
    cable.rotation_euler = (math.pi/2, 0, 0)
    cable_mat = bpy.data.materials.new(name=f'CableMaterial{i+1}')
    cable_mat.use_nodes = True
    bsdf_cable = cable_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf_cable.inputs['Base Color'].default_value = (0.2, 0.2, 0.2, 1.0)
    bsdf_cable.inputs['Metallic'].default_value = 0.0
    bsdf_cable.inputs['Roughness'].default_value = 0.9
    cable.data.materials.append(cable_mat)

# Add camera if none exists
if not any(obj.type == 'CAMERA' for obj in bpy.data.objects):
    bpy.ops.object.camera_add(location=(2, -2, 1.5))
    camera = bpy.context.active_object
    camera.rotation_euler = (1.1, 0, 0.785)

# Add light if none exists
if not any(obj.type == 'LIGHT' for obj in bpy.data.objects):
    bpy.ops.object.light_add(type='SUN', location=(3, 3, 5))
    light = bpy.context.active_object
    light.data.energy = 5

# Configure render settings
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.render.filepath = '/Users/user/Projects/GearForge/apps/blender-service /generated/render_8f8ad971-7549-4e66-9774-842929912bbb.png'
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080

# Set camera as active
camera = bpy.data.objects['Camera']
bpy.context.scene.camera = camera

import bpy
try:
    bpy.context.scene.render.filepath = '/Users/user/Projects/GearForge/apps/blender-service /generated/render_8f8ad971-7549-4e66-9774-842929912bbb.png'
    bpy.ops.render.render(write_still=True)
except Exception as e:
    print('Render Failed:', e)
try:
    bpy.ops.wm.save_as_mainfile(filepath='/Users/user/Projects/GearForge/apps/blender-service /generated/scene_8f8ad971-7549-4e66-9774-842929912bbb.blend')
except Exception as e:
    print('Blend save failed:', e)
try:
    bpy.ops.export_scene.gltf(filepath='/Users/user/Projects/GearForge/apps/blender-service /generated/model_8f8ad971-7549-4e66-9774-842929912bbb.glb', export_format='GLB')
except Exception as e:
    print('GLB Export Failed:', e)
