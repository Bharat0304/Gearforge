import bpy

# Clear existing mesh objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Create base frame rails (X-axis)
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0.1))
base_rail_1 = bpy.context.active_object
base_rail_1.name = 'Base_Rail_X1'
base_rail_1.scale = (2, 0.04, 0.04)

bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0.8, 0.1))
base_rail_2 = bpy.context.active_object
base_rail_2.name = 'Base_Rail_X2'
base_rail_2.scale = (2, 0.04, 0.04)

# Create Y-axis rails
bpy.ops.mesh.primitive_cube_add(size=2, location=(-1.8, 0.4, 0.1))
y_rail_1 = bpy.context.active_object
y_rail_1.name = 'Y_Rail_1'
y_rail_1.scale = (0.04, 0.5, 0.04)

bpy.ops.mesh.primitive_cube_add(size=2, location=(1.8, 0.4, 0.1))
y_rail_2 = bpy.context.active_object
y_rail_2.name = 'Y_Rail_2'
y_rail_2.scale = (0.04, 0.5, 0.04)

# Create gantry (movable X-carriage)
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0.4, 0.3))
gantry = bpy.context.active_object
gantry.name = 'Gantry'
gantry.scale = (0.06, 0.5, 0.06)

# Create Z-axis rail
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0.4, 0.8))
z_rail = bpy.context.active_object
z_rail.name = 'Z_Rail'
z_rail.scale = (0.04, 0.04, 0.4)

# Create spindle mount
bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.3, location=(0, 0.4, 0.5))
spindle_mount = bpy.context.active_object
spindle_mount.name = 'Spindle_Mount'

# Create spindle motor
bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.25, location=(0, 0.4, 0.35))
spindle_motor = bpy.context.active_object
spindle_motor.name = 'Spindle_Motor'

# Create stepper motors
bpy.ops.mesh.primitive_cube_add(size=2, location=(-2.2, 0.4, 0.1))
x_motor = bpy.context.active_object
x_motor.name = 'X_Motor'
x_motor.scale = (0.15, 0.15, 0.1)

bpy.ops.mesh.primitive_cube_add(size=2, location=(0, -0.8, 0.1))
y_motor = bpy.context.active_object
y_motor.name = 'Y_Motor'
y_motor.scale = (0.15, 0.15, 0.1)

bpy.ops.mesh.primitive_cube_add(size=2, location=(0.3, 0.4, 0.9))
z_motor = bpy.context.active_object
z_motor.name = 'Z_Motor'
z_motor.scale = (0.1, 0.1, 0.15)

# Create lead screws
bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=1.6, location=(-2, 0.4, 0.1))
x_leadscrew = bpy.context.active_object
x_leadscrew.name = 'X_Leadscrew'
x_leadscrew.rotation_euler = (0, 1.5708, 0)

bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.8, location=(0, -0.6, 0.1))
y_leadscrew = bpy.context.active_object
y_leadscrew.name = 'Y_Leadscrew'
y_leadscrew.rotation_euler = (1.5708, 0, 0)

bpy.ops.mesh.primitive_cylinder_add(radius=0.008, depth=0.6, location=(0.2, 0.4, 0.6))
z_leadscrew = bpy.context.active_object
z_leadscrew.name = 'Z_Leadscrew'

# Create linear bearings
for i, pos in enumerate([(-1.5, 0, 0.1), (-1, 0, 0.1), (-0.5, 0, 0.1), (0, 0, 0.1)]):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.06, location=pos)
    bearing = bpy.context.active_object
    bearing.name = f'Linear_Bearing_X{i+1}'
    bearing.rotation_euler = (0, 1.5708, 0)

for i, pos in enumerate([(0, 0.1, 0.1), (0, 0.3, 0.1), (0, 0.5, 0.1), (0, 0.7, 0.1)]):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.015, depth=0.06, location=pos)
    bearing = bpy.context.active_object
    bearing.name = f'Linear_Bearing_Y{i+1}'
    bearing.rotation_euler = (1.5708, 0, 0)

# Create work bed
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0.4, -0.05))
work_bed = bpy.context.active_object
work_bed.name = 'Work_Bed'
work_bed.scale = (1.5, 0.4, 0.02)

# Create electronics enclosure
bpy.ops.mesh.primitive_cube_add(size=2, location=(-2.5, 0.4, 0.4))
electronics_box = bpy.context.active_object
electronics_box.name = 'Electronics_Enclosure'
electronics_box.scale = (0.2, 0.3, 0.2)

# Create materials
steel_mat = bpy.data.materials.new(name='Steel')
steel_mat.use_nodes = True
bsdf = steel_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf.inputs[0].default_value = (0.3, 0.3, 0.4, 1.0)
bsdf.inputs[7].default_value = 0.8
steel_mat.node_tree.links.new(bsdf.outputs[0], steel_mat.node_tree.nodes['Material Output'].inputs[0])

aluminum_mat = bpy.data.materials.new(name='Aluminum')
aluminum_mat.use_nodes = True
bsdf_al = aluminum_mat.node_tree.nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf_al.inputs[0].default_value = (0.7, 0.7, 0.8, 1.0)
bsdf_al.inputs[7].default_value = 0.9
aluminum_mat.node_tree.links.new(bsdf_al.outputs[0], aluminum_mat.node_tree.nodes['Material Output'].inputs[0])

# Assign materials
for obj_name in ['Base_Rail_X1', 'Base_Rail_X2', 'Y_Rail_1', 'Y_Rail_2', 'Gantry', 'Z_Rail']:
    if obj_name in bpy.data.objects:
        bpy.data.objects[obj_name].data.materials.append(aluminum_mat)

for obj_name in ['Spindle_Motor', 'X_Motor', 'Y_Motor', 'Z_Motor']:
    if obj_name in bpy.data.objects:
        bpy.data.objects[obj_name].data.materials.append(steel_mat)

# Add camera
bpy.ops.object.camera_add(location=(5, -5, 3))
camera = bpy.context.active_object
camera.rotation_euler = (1.1, 0, 0.785)

# Add lighting
bpy.ops.object.light_add(type='SUN', location=(3, 3, 5))
light = bpy.context.active_object
light.data.energy = 3

# Set render settings
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.render.filepath = '/Users/user/Projects/GearForge/apps/blender-service /generated/render_8d86121f-b71e-4a71-9031-aef93783934d.png'
bpy.context.scene.camera = camera

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
    bpy.context.scene.render.filepath = '/Users/user/Projects/GearForge/apps/blender-service /generated/render_8d86121f-b71e-4a71-9031-aef93783934d.png'
    bpy.ops.render.render(write_still=True)
except Exception as e:
    print('Render Failed:', e)
try:
    bpy.ops.wm.save_as_mainfile(filepath='/Users/user/Projects/GearForge/apps/blender-service /generated/scene_8d86121f-b71e-4a71-9031-aef93783934d.blend')
except Exception as e:
    print('Blend save failed:', e)
try:
    bpy.ops.export_scene.gltf(filepath='/Users/user/Projects/GearForge/apps/blender-service /generated/model_8d86121f-b71e-4a71-9031-aef93783934d.glb', export_format='GLB')
except Exception as e:
    print('GLB Export Failed:', e)
