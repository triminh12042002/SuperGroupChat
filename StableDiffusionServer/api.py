from auth_token import auth_token
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
from io import BytesIO
import base64
import multiprocessing

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials = True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
device = "cpu"
model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float32, use_auth_token = auth_token, safety_checker = None,)
pipe.to(device)

# model_id: The model identifier for the Stable Diffusion model you want to use. This can be the name of a Hugging Face model or the path to a locally stored model.
# revision: The revision ID of the model checkpoint you want to use. If you don't have a specific revision in mind, you can omit this parameter, and it will default to the latest revision available.
# torch_dtype: The torch data type to use for computations. In this case, you can set it to torch.float32 to use 32-bit floating-point precision.
# device: The device on which you want to run the inference. By setting it to "cpu", you ensure that the computation will be performed on the CPU.

def generate_image(prompt):
    image = pipe(prompt, guidance_scale=7.5, num_inference_steps=2).images[0]
    return image

@app.get("/")
def generate(prompt: str):
    # with autocast(device):
    # Create a pool of worker processes
    # pool = multiprocessing.Pool()

    # Map the prompts to the worker processes
    # image = pool.map(generate_image, prompt)
    image = pipe(prompt, guidance_scale=7.5, num_inference_steps=1).images[0]

    # pool.close()
    # pool.join()
    
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    imgstr = base64.b64encode(buffer.getvalue())

    image.save("testimg.png")

    return Response(content=imgstr, media_type="image/png")


