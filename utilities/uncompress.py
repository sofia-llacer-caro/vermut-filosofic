import zipfile
import os
import re

def reassemble_from_zips(folder_path):
    # Find all part zip files in the folder
    zip_files = [f for f in os.listdir(folder_path) if re.match(r'.+_part\d+\.zip$', f)]
    
    if not zip_files:
        print("No part zip files found in the specified folder.")
        return

    # Group files by base name
    groups = {}
    for zf in zip_files:
        base_name = re.sub(r'_part\d+\.zip$', '', zf)
        groups.setdefault(base_name, []).append(zf)

    for base_name, parts in groups.items():
        # Sort parts numerically
        parts.sort(key=lambda x: int(re.search(r'_part(\d+)\.zip$', x).group(1)))

        # Determine output file extension from folder or default to original name
        output_file = os.path.join(folder_path, base_name + os.path.splitext(parts[0].replace(f"_part1", ""))[1])
        
        # Try to detect original extension from base_name
        output_file = os.path.join(folder_path, base_name)

        print(f"\nReassembling '{base_name}' from {len(parts)} parts...")

        with open(output_file, 'wb') as out_f:
            for part_zip in parts:
                zip_path = os.path.join(folder_path, part_zip)
                with zipfile.ZipFile(zip_path, 'r') as zf:
                    # Each zip contains a single .bin file
                    bin_file = zf.namelist()[0]
                    data = zf.read(bin_file)
                    out_f.write(data)
                print(f"  ✓ Processed {part_zip}")

        print(f"Output file: {output_file}")
        print(f"Size: {os.path.getsize(output_file) / (1024*1024):.2f} MB")


if __name__ == "__main__":
    folder = input("Enter the folder path containing the zip parts: ").strip()
    
    if not os.path.isdir(folder):
        print("Invalid folder path.")
    else:
        reassemble_from_zips(folder)