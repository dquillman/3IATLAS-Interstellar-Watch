import os
from PIL import Image, ImageDraw, ImageFilter

def create_comet_icon():
    size = (256, 256)
    # Create a dark background
    img = Image.new('RGBA', size, (10, 15, 30, 255))
    draw = ImageDraw.Draw(img)

    # Draw some stars
    import random
    for _ in range(50):
        x = random.randint(0, 255)
        y = random.randint(0, 255)
        brightness = random.randint(100, 255)
        draw.point((x, y), fill=(255, 255, 255, brightness))

    # Draw the comet tail (gradient)
    # Start from top-right to bottom-left
    for i in range(150):
        alpha = int(200 * (1 - i/150))
        width = int(40 * (1 - i/150))
        
        # Calculate position (moving diagonally)
        start_x = 180 - i
        start_y = 80 + i
        
        draw.ellipse([start_x - width/2, start_y - width/2, start_x + width/2, start_y + width/2], 
                     fill=(56, 189, 248, alpha))

    # Draw the comet head (bright core)
    head_pos = (180, 80)
    head_radius = 25
    
    # Glow
    for r in range(head_radius + 20, head_radius, -1):
        alpha = int(100 * (1 - (r - head_radius)/20))
        draw.ellipse([head_pos[0]-r, head_pos[1]-r, head_pos[0]+r, head_pos[1]+r], 
                     fill=(14, 165, 233, 20))

    # Core
    draw.ellipse([head_pos[0]-head_radius, head_pos[1]-head_radius, 
                  head_pos[0]+head_radius, head_pos[1]+head_radius], 
                 fill=(240, 249, 255, 255))
    
    # Save as PNG
    img.save('app.png')
    
    # Save as ICO
    img.save('app.ico', format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
    print("Icons created successfully: app.png, app.ico")

if __name__ == "__main__":
    try:
        create_comet_icon()
    except Exception as e:
        print(f"Error creating icon: {e}")
