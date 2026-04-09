import os
import asyncio
import subprocess
from factory_store import LuminaVault, ProjectState

class LuminaAssembler:
    def __init__(self):
        self.ffmpeg_path = "ffmpeg"

    async def get_audio_duration(self, audio_path: str) -> float:
        cmd = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", audio_path
        ]
        process = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        if stdout:
            return float(stdout.decode().strip())
        return 0.0

    async def assemble_output(self, vault: LuminaVault):
        vault.update_status(ProjectState.ASSEMBLING)
        
        scenes = vault.data.get("assets", {}).get("scenes", [])
        if not scenes:
            raise Exception("No assets found to assemble.")

        output_dir = os.path.join(vault.path, "output")
        os.makedirs(output_dir, exist_ok=True)
        
        # We need to resolve absolute local paths from the URLs stored in metadata
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        scene_files = []
        
        try:
            for i, scene in enumerate(scenes):
                # Resolve local paths
                # URLs are e.g. "/projects_vault/lp_id/audio/scene_1.mp3"
                audio_local = os.path.join(project_root, scene["audio"].lstrip("/"))
                image_local = os.path.join(project_root, scene["image"].lstrip("/"))
                
                duration = await self.get_audio_duration(audio_local)
                scene_output = os.path.join(output_dir, f"scene_{i+1}.mp4")
                
                # Create a clip for this scene
                # Loop image for 'duration' seconds, add audio, encode as H.264
                cmd = [
                    self.ffmpeg_path, "-y",
                    "-loop", "1", "-i", image_local,
                    "-i", audio_local,
                    "-c:v", "libx264", "-tune", "stillimage", "-c:a", "aac", "-b:a", "192k",
                    "-pix_fmt", "yuv420p", "-shortest", "-t", str(duration),
                    "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
                    scene_output
                ]
                
                process = await asyncio.create_subprocess_exec(
                    *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
                )
                await process.communicate()
                scene_files.append(scene_output)

            # Final Concatenation
            concat_list_path = os.path.join(output_dir, "concat_list.txt")
            with open(concat_list_path, "w") as f:
                for sf in scene_files:
                    f.write(f"file '{sf.replace('\\', '/')}'\n")

            final_video = os.path.join(output_dir, "final_video.mp4")
            concat_cmd = [
                self.ffmpeg_path, "-y", "-f", "concat", "-safe", "0",
                "-i", concat_list_path, "-c", "copy", final_video
            ]
            
            process = await asyncio.create_subprocess_exec(
                *concat_cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()

            vault.data["output_video"] = f"/projects_vault/{vault.id}/output/final_video.mp4"
            vault.update_status(ProjectState.COMPLETED)
            
        except Exception as e:
            vault.data["status"] = ProjectState.ERROR
            vault.data["error_log"] = f"Assembler Error: {str(e)}"
            vault.save()

assembler = LuminaAssembler()
