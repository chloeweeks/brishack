import json
import os
import sys
import numpy as np
import pandas as pd


from generateTriangles import generate
from triangles import searchTriangles
from triangles import get3dWinners
from plotSky import plotSky

# # generateChoice = input("Would you like to generate the files? Y for yes, nothing for No")

# # if generateChoice.upper() == "Y":
# #     generate()

# ## data is collected here

# starTriangles = pd.read_csv("star_triangle_hash_table.csv")
# stars2d = pd.read_csv("2D_app_star_database.csv")


# # userVertices = [(10,10), (100, 10), (10, 100), (100, 100)]
# # userVertices = [
# #     (0, 0),
# #     (0, 4),  
# #     (2, 2),  
# #     (4,4),
# #     (4,0)   
# # ]


# # userVertices = [(0, 0), (0, 5), (2, 5), (2.5, 3.5), (3, 5), (5, 5), (5, 0), (4, 0), (4, 3), (2.5, 1.5), (1, 3), (1, 0)]

# # userVertices = [(0, 10), (2.35, 3.25), (9.5, 3.1), (3.8, -1.2), (5.9, -8.1), (0, -4), (-5.9, -8.1), (-3.8, -1.2), (-9.5, 3.1), (-2.35, 3.25)]

# # userVertices = [(2, 0), (2, 1), (1, 1), (1, 2), (0, 2), (0, 5), (1, 5), (1, 6), (2, 6), (2, 7), (3, 7), (3, 6), (8, 6), (8, 7), (9, 7), (9, 6), (10, 6), (10, 5), (11, 5), (11, 2), (10, 2), (10, 1), (9, 1), (9, 0), (7, 0), (7, 1), (4, 1), (4, 0)]


# # userVertices = [(0.2943405624316911, 0.4494535519125683),
# # (0.2930772982152461, 0.25136612021857924),
# # (0.41687719142685864, 0.40846994535519127),
# # (0.48130366646555495, 0.2773224043715847),
# # (0.4989893654957853, 0.4426229508196721)]

# userVertices = [( 0.12069610227043004,  0.7773224043715847),
# (0.14782933456378253,  0.4562841530054645),
# (0.13098801796790857,  0.07650273224043716),
# (0.404191598300975,  0.5013661202185792),
# (0.512724527474385,  0.296448087431694),
# (0.6989146387287694,  0.09836065573770492),
# (0.7279191284216634,  0.819672131147541)]
# # user runs and uses canvas



# # search is applied

# # tolerance = int(input("Enter the tolerance for the model searching  "))
# tolerance = 0.005

# foundStars = searchTriangles(userVertices, stars2d, starTriangles)

# if foundStars:
#     for element in foundStars:
#         plotSky(foundStars)

# if foundStars:

#     for i, match in enumerate(foundStars):
#         hips_to_plot = match['hips']
#         vmag = match['averageVmag']
        
#         print(f"Match {i+1}: Brightness = {vmag:.2f}")

#         plotSky(hips_to_plot)


# results are shown


def starSearch(userVertices, tolerance = 0.005):
    userVertices = [
        np.array([p["x"], p["y"]])
        for p in userVertices
    ]

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    starTriangles = pd.read_csv(os.path.join(BASE_DIR, "star_triangle_hash_table.csv"))
    stars2d = pd.read_csv(os.path.join(BASE_DIR,"2D_app_star_database.csv"))

    foundStars = searchTriangles(userVertices, stars2d, starTriangles)

    # if foundStars:

    #     for i, match in enumerate(foundStars):
    #         hips_to_plot = match['hips']
    #         vmag = match['averageVmag']
            
    #         # print(f"Match {i+1}: Brightness = {vmag:.2f}")

    #         plotSky(hips_to_plot)
    for match in foundStars:
        winningHIPS = match["hips"]
        match["data3D"] = get3dWinners(winningHIPS, stars2d)


    return foundStars


if __name__ == "__main__":
    input = json.loads(sys.stdin.read())
    tolerance = input.get("tolerance", 0.005)
    vertices = input.get("vertices")
    result = starSearch(vertices, 0.005)
    
    print(json.dumps(result))
