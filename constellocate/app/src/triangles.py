from scipy.spatial import KDTree
import numpy as np
import itertools
import pandas as pd
# from parse.py import get_clean_star_database_2D

def generateTriangles(df, num_neighbours=10):
    coordinates = np.column_stack((df["x_coord"], df["y_coord"]))
    star_ids = df['HIP'].values


    cluster=KDTree(coordinates)


    distances, indices = cluster.query(coordinates, k=num_neighbours)
    triangles = []
    seenTriangles = set()

    for neighbourCluster in indices:
        for combination in itertools.combinations(neighbourCluster, 3):
            sortedCombination = tuple(sorted(combination))
            if sortedCombination in seenTriangles:
                continue
            seenTriangles.add(sortedCombination)


            [p1, p2, p3] = [coordinates[x] for x in sortedCombination]

            L1 = np.linalg.norm(p1-p2)
            L2 = np.linalg.norm(p2-p3)
            L3 = np.linalg.norm(p3-p1)

            sides = sorted([L1, L2, L3])
            [a,b,c] = [x for x in sides]

            if c == 0:
                continue
            
            ratio1 = a/c
            ratio2 = b/c

            hip1 = star_ids[sortedCombination[0]]
            hip2 = star_ids[sortedCombination[1]]
            hip3 = star_ids[sortedCombination[2]]    

            triangles.append({
                'hip1': hip1, 'hip2': hip2, 'hip3': hip3,
                'ratio1': ratio1, 'ratio2': ratio2
            })

    return pd.DataFrame(triangles)

    print(cluster)

