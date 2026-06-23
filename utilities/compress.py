import zipfile
import os

def split_file_into_zips(file_path, chunk_size_mb=25):
    chunk_size = chunk_size_mb * 1024 * 1024
    
    with open(file_path, 'rb') as f:
        part_num = 1
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            
            # Create a zip file for each chunk
            zip_name = f"{os.path.splitext(file_path)[0]}_part{part_num}.zip"
            with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zf:
                zf.writestr(f"part{part_num}.bin", chunk)
            
            print(f"Created {zip_name}")
            part_num += 1

split_file_into_zips("./key09/1665_FMB01.key", chunk_size_mb=13)
