import bpy
import math

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Create cube
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
cube = bpy.context.active_object

# Animation settings
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 150

# Frame 1
cube.rotation_euler = (0, 0, 0)
cube.keyframe_insert(data_path="rotation_euler", frame=1)

# Frame 150 (350 degrees)
cube.rotation_euler = (0, 0, math.radians(350))
cube.keyframe_insert(data_path="rotation_euler", frame=150)

# Make rotation linear
action = cube.animation_data.action
for fcurve in action.fcurves:
    for keyframe in fcurve.keyframe_points:
        keyframe.interpolation = 'LINEAR'

print("Cube rotation animation created successfully!")