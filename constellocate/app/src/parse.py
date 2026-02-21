import pandas as pd
import numpy as np
from triangles import generateTriangles


def parse_hipparcos(file_path):
    # splits by tab, and removes the comment data from the table
    star_db = pd.read_csv(file_path, sep='\t', comment='#')
    
    
    # remove rows where data is missing
    star_db = star_db.dropna()
    
    # if want to make only for visible stars:
    # visible_stars = star_db[star_db['Vmag'] <= 6.0]
    
    return star_db


def project_stars_to_2d(ra_star, dec_star, ra_center, dec_center):
    """
    Converts RA and Dec (in degrees) to flat x, y coordinates.
    Works for single stars or entire pandas columns (arrays) of stars.
    """
    alpha = np.radians(ra_star)
    delta = np.radians(dec_star)
    alpha_0 = np.radians(ra_center)
    delta_0 = np.radians(dec_center)
    
    denominator = 1 + np.sin(delta_0) * np.sin(delta) + np.cos(delta_0) * np.cos(delta) * np.cos(alpha - alpha_0)
    k = 2 / denominator
    
    x = k * np.cos(delta) * np.sin(alpha - alpha_0)
    y = k * (np.cos(delta_0) * np.sin(delta) - np.sin(delta_0) * np.cos(delta) * np.cos(alpha - alpha_0))
    
    return x, y

raw_data_file = '../../resources/asu.tsv'
clean_star_database = parse_hipparcos(raw_data_file)

# print(f"Total visible stars for the app: {len(clean_star_database)}")

clean_star_database.to_csv('app_star_database.csv', index=False)
print("Saved clean database successfully!")



clean_star_database = clean_star_database.iloc[2:]

clean_star_database['RAICRS'] = pd.to_numeric(clean_star_database['RAICRS'])
clean_star_database['DEICRS'] = pd.to_numeric(clean_star_database['DEICRS'])

clean_star_database['x_coord'], clean_star_database['y_coord'] = project_stars_to_2d(clean_star_database['RAICRS'], clean_star_database['DEICRS'], ra_center=84, dec_center=-1)

print("Stars successfully projected to 2D!")
clean_star_database.to_csv('2D_app_star_database.csv', index=False)


# def get_clean_star_database_2D():
#     return clean_star_database

print("Saved 2d database successfully!")



triangle_db = generateTriangles(clean_star_database)

print(f"Successfully generated {len(triangle_db)} unique triangles!")

triangle_db.to_csv('star_triangle_hash_table.csv', index=False)