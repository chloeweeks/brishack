import pandas as pd

# 1. Configuration
input_file = 'asu-SpType.tsv'
output_file = 'asu-SpType-Sorted.tsv'
sort_column = 'HIP'  # Change this to 'HIP', 'B-V', etc.
ascending_order = True # True for A-Z/Small-to-Large, False for Z-A

try:
    # 2. Load the TSV file
    # sep='\t' tells pandas to look for tabs instead of commas
    # comment='#' ignores header info/metadata lines typical in VizieR files
    df = pd.read_csv(input_file, sep='\t', comment='#', low_memory=False)

    # 3. Sort the data
    # na_position='last' puts stars with missing data at the bottom
    df_sorted = df.sort_values(by=sort_column, ascending=ascending_order, na_position='last')

    # 4. Save to a new TSV
    df_sorted.to_csv(output_file, sep='\t', index=False)
    
    print(f"Successfully sorted by '{sort_column}' and saved to {output_file}")
    print(df_sorted.head()) # Preview the top 5 rows

except FileNotFoundError:
    print(f"Error: The file '{input_file}' was not found.")
except KeyError:
    print(f"Error: The column '{sort_column}' does not exist in the file.")