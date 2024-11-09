import random
import sys
import time
import base64
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
# READY

from google.oauth2 import service_account
from PIL import Image, ImageDraw, ImageFont

# Define project information
PROJECT_ID = "kitsunewrapper"  # @param {type:"string"}
LOCATION = "europe-west2"  # @param {type:"string"}
saveFolder = './public/'

# Initialize Vertex AI

def genImages():
    credentials = service_account.Credentials.from_service_account_file(
        './key.json')
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    print("generating...")
    imagen_model = ImageGenerationModel.from_pretrained("imagen-3.0-fast-generate-001")

    image_paths = None
    image_prompt = None
    image_prompt = 'a male street-fighter chibi pocket fighter male character similair to ken pocket fighter, with akuma hair, furry arms, ブランカ, ユウ, furry back, wild fangs, claws, wild beast man, pocket figther, full body, face and arms of blanka pocket fighter style, high-poly 3d mofrl, full body, standing in a typical A-pose, green skin, blue hair, akuma, blanka, ken mashup street fighter pocket characrter, standin, A-pose, furry blanka beast, street-fighter monster, crazy, ken pocket fighter mix, BLANKA, high-poly 3d model, pocket fighter character, a cute pocket fighter style street fighter character similar to ken but bald headed, wearing a dark almost grey navy garbage pail uniform with torn sleeve and lage boots, standing full body in a typical A-pose'
     #image_prompt = 'high-poly 3d model, pocket fighter character, a cute pocket fighter style street fighter character similar to ken but bald headed, wearing a dark almost grey navy garbage pail uniform with torn sleeve and lage boots, standing full body in a typical A-pose'
    prompt_prefix = 'generate a design sheet for the subject matter, no background shadows, high-poly 3d model, Proffesional studio quality level of workmanship and super realistic depiction of subject against a plain white background with no distractions... The SUBJECT MATTER is : '
    prompt_suffix = '. Highest possible detail against a blank white background, 4k textures, ultra-realistic materials, ultra-high resolution. ANGLE OF VIEW IS VERY VERY IMPORTANT. rotated character at a view of - '
    final_prompt = prompt_prefix + image_prompt + prompt_suffix
    #print(final_prompt)
    view_angles = ["FRONT - 0 degrees", "90 degrees - SIDE VIEW - LEFT", "BACK VIEW - 180 degrees"]  # Define view angles
    angles=[0, 90, 180]
    basic_angles = ["0 degrees","90 degrees - SIDE VIEW","180 degrees"]  # Define view angles
    image_paths = []  # Store paths to generated images
    converted_images = []
    converted_string = ''
    ang = 0;
    angle = None
    MeshyCall = True

    # Define the text properties
    font = ImageFont.truetype(saveFolder+"Font.ttf", 32)
    text_color = (0, 0, 0)
    ang = 0

    for angle in view_angles:
      try:
        meshresponse = None
        exresponse = None
        modelresponse = None
        data = None
        prompt_with_angle = f"{final_prompt} rotated at {angle}, IMPORTANT rotate the subject by {angle}"  # Add angle to prompt
        response = imagen_model.generate_images(
            prompt=prompt_with_angle,
        )

        time.sleep(5)
        print(response.images[0])

        image = response.images[0]
        image_path = f"{saveFolder}_generated_image_{str(ang)}.png"  # Unique filename                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    generated_image_{angle.replace(' ', '_')}.png"  # Unique filename
        image.save(image_path)
        image_paths.append(image_path)  # Add path to list
        image = Image.open(image_path)
        draw = ImageDraw.Draw(image)
        # ...
        # Define the text properties
        text = basic_angles[ang]

        # Calculate text width to center it
        text_width = draw.textlength(text, font)
        x = (image.width - text_width) / 2
        y = image.height - 40  # Align to the top

        draw.text((x, y), text, fill=text_color, font=font)
        image.save(image_path)  # Save the image with the text
        with open(image_path, "rb") as image2string:
          converted_images.append(base64.b64encode(image2string.read()))

        # Display the image (optional, depends on your environment)
        #display(image)  # Use this for Google Colab or Jupyter Notebook
        image.show()        # Use this for a local environment

        ang += 1
        time.sleep(0+random.randint(1, 3))
      except Exception as e:
        print(f"imagen fail {e}")
        break

    fullpaths = '{ "success" : {'
    ipnum = 0
    if len(converted_images) > 0:
        for ipath in converted_images:
            if ipnum < len(image_paths)-1:
                fullpaths = fullpaths +'"'+ str(ipnum) +'" : "' + str(ipath) + '", '
            else:
                fullpaths = fullpaths +'"'+ str(ipnum) +'" : "' + str(ipath) + '" } }'
            ipnum+=1
    else:
        fullpaths = '{ "error" : "imagenfail" }'

    print(fullpaths)
    return fullpaths

def random_string_generator():
    strings = ["apple", "banana", "cherry", "date", "elderberry"]
    return random.choice(strings)

if __name__ == "__main__":
    random_string = random_string_generator()
    print(random_string)