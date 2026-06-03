import bpy
import math
from mathutils import Vector


def setup_turntable():

    scene = bpy.context.scene

    # --------------------------------------------------
    # Find mesh objects
    # --------------------------------------------------

    meshes = [obj for obj in scene.objects if obj.type == "MESH"]

    if not meshes:
        print("No mesh objects found.")
        return

    # --------------------------------------------------
    # Calculate bounding box
    # --------------------------------------------------

    min_coords = Vector((float("inf"), float("inf"), float("inf")))
    max_coords = Vector((float("-inf"), float("-inf"), float("-inf")))

    for obj in meshes:

        bpy.context.view_layer.update()

        for vertex in obj.data.vertices:
            world = obj.matrix_world @ vertex.co

            min_coords.x = min(min_coords.x, world.x)
            min_coords.y = min(min_coords.y, world.y)
            min_coords.z = min(min_coords.z, world.z)

            max_coords.x = max(max_coords.x, world.x)
            max_coords.y = max(max_coords.y, world.y)
            max_coords.z = max(max_coords.z, world.z)

    center = (min_coords + max_coords) / 2

    dimensions = max_coords - min_coords
    max_dim = max(dimensions.x, dimensions.y, dimensions.z)

    if max_dim <= 0:
        max_dim = 1.0

    # --------------------------------------------------
    # Target Empty
    # --------------------------------------------------

    bpy.ops.object.empty_add(
        type="PLAIN_AXES",
        location=center
    )

    target = bpy.context.active_object
    target.name = "TurntableTarget"

    # --------------------------------------------------
    # Orbit Rig Empty
    # --------------------------------------------------

    bpy.ops.object.empty_add(
        type="PLAIN_AXES",
        location=center
    )

    orbit_rig = bpy.context.active_object
    orbit_rig.name = "OrbitRig"

    # --------------------------------------------------
    # Camera
    # --------------------------------------------------

    cameras = [obj for obj in scene.objects if obj.type == "CAMERA"]

    if cameras:
        camera = cameras[0]
    else:
        bpy.ops.object.camera_add()
        camera = bpy.context.active_object

    scene.camera = camera

    # --------------------------------------------------
    # Camera Distance
    # --------------------------------------------------

    fov = camera.data.angle

    distance = (max_dim * 1.5) / (
        2 * math.tan(fov / 2)
    )

    distance = max(distance, max_dim * 2.0)

    camera.location = center + Vector(
        (
            0,
            -distance,
            max_dim * 0.5
        )
    )

    camera.rotation_euler = (0, 0, 0)

    # --------------------------------------------------
    # Parent Camera to Orbit Rig
    # --------------------------------------------------

    original_matrix = camera.matrix_world.copy()

    camera.parent = orbit_rig
    camera.matrix_parent_inverse = (
        orbit_rig.matrix_world.inverted()
    )

    camera.matrix_world = original_matrix

    # --------------------------------------------------
    # Track To Constraint
    # --------------------------------------------------

    for c in camera.constraints:
        if c.type == "TRACK_TO":
            camera.constraints.remove(c)

    track = camera.constraints.new(type="TRACK_TO")

    track.target = target
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"

    # --------------------------------------------------
    # Timeline
    # --------------------------------------------------

    scene.frame_start = 1
    scene.frame_end = 150
    scene.render.fps = 30

    # --------------------------------------------------
    # Orbit Animation
    # --------------------------------------------------

    orbit_rig.rotation_mode = "XYZ"

    orbit_rig.rotation_euler.z = 0
    orbit_rig.keyframe_insert(
        data_path="rotation_euler",
        index=2,
        frame=1
    )

    orbit_rig.rotation_euler.z = math.radians(
        359.9
    )

    orbit_rig.keyframe_insert(
        data_path="rotation_euler",
        index=2,
        frame=150
    )

    if (
        orbit_rig.animation_data
        and orbit_rig.animation_data.action
    ):

        for fcurve in orbit_rig.animation_data.action.fcurves:

            if (
                fcurve.data_path == "rotation_euler"
                and fcurve.array_index == 2
            ):

                for kp in fcurve.keyframe_points:
                    kp.interpolation = "LINEAR"

    # --------------------------------------------------
    # Render Engine
    # --------------------------------------------------

    scene.render.engine = "CYCLES"

    try:
        scene.cycles.device = "GPU"
    except:
        scene.cycles.device = "CPU"

    scene.cycles.samples = 64
    scene.cycles.use_adaptive_sampling = True

    # --------------------------------------------------
    # Transparent Background
    # --------------------------------------------------

    scene.render.film_transparent = True

    # --------------------------------------------------
    # Render PNG
    # --------------------------------------------------

    scene.frame_set(1)

    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = "//render.png"

    print("Rendering image...")

    bpy.ops.render.render(
        write_still=True
    )

    # --------------------------------------------------
    # Render MP4
    # --------------------------------------------------

    scene.render.image_settings.file_format = "FFMPEG"

    scene.render.ffmpeg.format = "MPEG4"
    scene.render.ffmpeg.codec = "H264"

    scene.render.ffmpeg.constant_rate_factor = "HIGH"

    scene.render.filepath = "/Users/user/Projects/GearForge/apps/blender-service /generated/video_456a6acd-6eb0-468a-8432-200646243c9c.mp4"

    print("Rendering animation...")

    bpy.ops.render.render(
        animation=True
    )

    # --------------------------------------------------
    # Export GLB
    # --------------------------------------------------

    print("Exporting GLB...")

    bpy.ops.export_scene.gltf(
        filepath="//model.glb",
        export_format="GLB"
    )

    print("Done!")
    print("Generated:")
    print(" - render.png")
    print(" - preview.mp4")
    print(" - model.glb")


setup_turntable()