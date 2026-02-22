import csv
import json

# 1. Configuration
INPUT_FILE = 'asu-SpType-Sorted.tsv'
OUTPUT_FILE = 'stars.ts'

# Change these to match the EXACT column names in your TSV header
# If your file has no headers, we'll use indices instead
HIP_COL = 'HIP'
SP_COL = 'sptype'
VMAG_COL = 'mag'

def convert_tsv_to_ts():
    stars = []

    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            # Skip VizieR metadata lines starting with #
            # We also skip the very first few lines until we find data
            lines = (line for line in f if not line.startswith('#'))
            
            # Use DictReader if your TSV has a header row
            reader = csv.DictReader(lines, delimiter='\t')
            
            for row in reader:
                try:
                    # Create the star object
                    star = {
                        "hip": int(row[HIP_COL]),
                        "spType": row[SP_COL].strip(),
                        "vmag": float(row[VMAG_COL])
                    }
                    stars.append(star)
                except (ValueError, KeyError):
                    # Skip lines with missing data or bad formatting
                    continue

        # 2. Write the TypeScript file
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write("export interface Star {\n")
            f.write("  hip: number;\n")
            f.write("  spType: string;\n")
            f.write("  vmag: number;\n")
            f.write("}\n\n")
            f.write("export const stars: Star[] = ")
            # Use json.dumps to format the list as a valid JS array
            f.write(json.dumps(stars, indent=2))
            f.write(";\n")

        print(f"Successfully converted {len(stars)} stars to {OUTPUT_FILE}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    convert_tsv_to_ts()