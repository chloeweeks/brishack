import json
import os
import sys
import numpy as np
import pandas as pd


from generateTriangles import generate
from triangles import searchTriangles
from plotSky import plotSky




starTriangles = pd.read_csv("star_triangle_hash_table.csv")
stars2d = pd.read_csv("2D_app_star_database.csv")


print("Read data")


userVertices = [(2, 0)]
print("Finding Data")

foundStars = searchTriangles(userVertices, stars2d, starTriangles)

print("found stars:", foundStars)

if foundStars:

    for i, match in enumerate(foundStars):
        hips_to_plot = match['hips']
        vmag = match['averageVmag']
        
        print(f"Match {i+1}: Brightness = {vmag:.2f}")

        plotSky(hips_to_plot)