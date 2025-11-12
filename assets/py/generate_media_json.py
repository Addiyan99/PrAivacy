#!/usr/bin/env python3
"""
Script to automatically generate media.json from the Media folder structure
Place this script in the root of your project and run it to update media.json
"""

import os
import json
import re
from pathlib import Path

# Configuration
# Paths are relative to the script location (src/assets/py/)
MEDIA_FOLDER = "../images/media"
OUTPUT_FILE = "../data/media.json"

# Supported image extensions
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}

def extract_folder_number(folder_name):
    """Extract the leading number from folder name (e.g., '01' from '01 - Event Name')"""
    match = re.match(r'^(\d+)', folder_name)
    return match.group(1) if match else None

def extract_folder_title(folder_name):
    """Extract the title without the leading number (e.g., 'Event Name' from '01 - Event Name')"""
    cleaned = re.sub(r'^\d+\s*[-_]?\s*', '', folder_name)
    return cleaned.strip()

def is_image_file(filename):
    """Check if file is an image based on extension"""
    return Path(filename).suffix.lower() in IMAGE_EXTENSIONS

def scan_media_folder(media_path):
    """Scan the media folder and return structured data"""
    folders_data = []
    
    if not os.path.exists(media_path):
        print(f"Warning: Media folder not found at {media_path}")
        return folders_data
    
    # Get all subdirectories in the Media folder
    subdirs = [d for d in os.listdir(media_path) 
               if os.path.isdir(os.path.join(media_path, d))]
    
    for folder_name in subdirs:
        folder_path = os.path.join(media_path, folder_name)
        folder_number = extract_folder_number(folder_name)
        folder_title = extract_folder_title(folder_name)
        
        if not folder_number:
            print(f"Warning: Folder '{folder_name}' doesn't start with a number, skipping...")
            continue
        
        try:
            all_files = os.listdir(folder_path)
            image_files = sorted([f for f in all_files if is_image_file(f)])
            
            folders_data.append({
                "number": folder_number,
                "name": folder_title,
                "images": image_files
            })
            
            print(f"Found folder {folder_number}: {folder_title} ({len(image_files)} images)")
            
        except Exception as e:
            print(f"Error reading folder {folder_name}: {e}")
    
    # Sort by folder number (ascending)
    folders_data.sort(key=lambda x: int(x['number']))

    # Reverse the list so first becomes last
    folders_data.reverse()
    
    return folders_data

def generate_media_json():
    """Main function to generate media.json"""
    print("Scanning media folder...")
    
    folders_data = scan_media_folder(MEDIA_FOLDER)
    
    if not folders_data:
        print("No folders found or error occurred.")
        return
    
    # Create output data structure
    output_data = {
        "folders": folders_data
    }
    
    # Ensure output directory exists
    output_dir = os.path.dirname(OUTPUT_FILE)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")
    
    # Write to JSON file
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Successfully generated {OUTPUT_FILE}")
        print(f"  Total folders: {len(folders_data)}")
        print(f"  Total images: {sum(len(f['images']) for f in folders_data)}")
        print("  (Order reversed — first folder is now last)")
        
    except Exception as e:
        print(f"Error writing JSON file: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("Media Gallery JSON Generator (Reversed Order)")
    print("=" * 60)
    generate_media_json()
    print("=" * 60)
