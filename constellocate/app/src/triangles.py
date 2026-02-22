from scipy.spatial import KDTree
import numpy as np
import itertools
import pandas as pd
from collections import Counter
from skimage.transform import SimilarityTransform
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

    # print(cluster)


def searchTriangles(userVertices, starDb, starTriangleDb, ratioTolerance=0.01, physicalTolerance=0.1, topN=3):
    
    #builds a tree for finding similar shape ratios
    databaseRatios = np.column_stack((starTriangleDb['ratio1'], starTriangleDb['ratio2']))
    ratioTree = KDTree(databaseRatios)
    
    # compares the tree locations to real places on the map
    starCoords = np.column_stack((starDb['x_coord'], starDb['y_coord']))
    skyMapTree = KDTree(starCoords)
    starHipsArray = starDb['HIP'].values # Fast lookup array
    
    # convert user points
    userPoints = np.array(userVertices)
    numPoints = len(userPoints)

    if numPoints < 3:
        if numPoints == 2:
            dx = abs(userVertices[0][0] - userVertices[1][0])
            dy = abs(userVertices[0][1] - userVertices[1][1])
            if dx == 0:
                grad = 0
            else:
                grad = dy/dx
            c = userVertices[0][1] - (userVertices[0][0] * grad)

            if grad == 0:
                totalY = sum([x[-1] for x in userVertices])
                newUserVertices = userVertices.append((userVertices[0][0], totalY*2))
            else:

                newX = sum([x[0] for x in userVertices])
                # print(newX, "newX")
                respectiveY = (grad * newX) + c
                # print(respectiveY, "respectiveY")
                newUserVertices = userVertices.append((newX*2, respectiveY))
            numPoints = 3
        elif numPoints == 1:
            return[{
                    "hips": [11767],
                    "averageVmag": 1.97
                    }]
        else:
            print("AHHDFHASDIFJDKNERGKSDJAF")

        userPoints = np.array(userVertices)
        # if numPoints == 2:
        # elif numPoints == 1:

    
    # get indices of the user data points
    pointIndices = list(range(numPoints))

    foundMatches = []
    seenConstellations = set()
    breaking = False
    
    # Generate Triangles from the drawing
    for combo in itertools.combinations(pointIndices, 3):
        if breaking:
            break
        idx1, idx2, idx3 = combo
        p1, p2, p3 = userPoints[idx1], userPoints[idx2], userPoints[idx3]

        area = 0.5 * abs(p1[0]*(p2[1] - p3[1]) + p2[0]*(p3[1] - p1[1]) + p3[0]*(p1[1] - p2[1]))
        
        # if area < 1.0:
        #     continue
        #lengths
        L1 = np.linalg.norm(p1 - p2)
        L2 = np.linalg.norm(p2 - p3)
        L3 = np.linalg.norm(p3 - p1)
        
        sides = sorted([L1, L2, L3])
        if sides[2] == 0: continue
            
        userRatio1 = sides[0] / sides[2]
        userRatio2 = sides[1] / sides[2]
        
        # find similar ratios
        matches = ratioTree.query_ball_point([userRatio1, userRatio2], r=ratioTolerance)
        
        # now compare using "anchor" of matching index and looks to see if the other coords match
        for matchId in matches:
            match = starTriangleDb.iloc[matchId]
            
            anchorHips = [match['hip1'], match['hip2'], match['hip3']]
            
            anchorStarsCoords = starDb[starDb['HIP'].isin(anchorHips)][['x_coord', 'y_coord']].values
            
            if len(anchorStarsCoords) != 3: continue
                
            # see how much it takes to transform real points to user points
            userAnchorPoints = np.array([p1, p2, p3])
            tform = SimilarityTransform()
            tform.estimate(userAnchorPoints, anchorStarsCoords) 

            #now apply that same transformation to every other drawn point, and see if they map to real stars in the map
            projection = tform(userPoints)
            
            # query() returns the distance to the nearest star and the index of that star
            distances, closestIndices = skyMapTree.query(projection)
            
            # checks if all points land within physical tolerance
            validHits = np.sum(distances < physicalTolerance)
            
            if validHits == numPoints: 
                #FOUND
                winningHIPS = starHipsArray[closestIndices]

                if len(set(winningHIPS)) == numPoints:

                    


                    sortedHIPS = tuple(sorted(winningHIPS.tolist()))

                    # print("VMAGS", starDb[starDb['HIP'].isin(sortedHIPS)]['Vmag'])

                    if sortedHIPS not in seenConstellations:
                        # print("Found a win!!!!")
                        # print(winningHIPS.tolist())
                        seenConstellations.add(sortedHIPS)

                        vmag = starDb[starDb['HIP'].isin(sortedHIPS)]['Vmag'].mean() #gives avg brightness
                
                        foundMatches.append({
                            "hips": winningHIPS.tolist(),
                            "averageVmag": vmag
                        })

                        if len(foundMatches) > 5:
                            breaking = True
                            break
                    # else: print("Found a duplicate")

                    
                    # return winningHIPS.tolist()
    if not foundMatches:            
        return "No matches found"
    foundMatches = sorted(foundMatches, key=lambda x : x["averageVmag"])

    # print(foundMatches[:topN])

    return foundMatches[:topN]


def get3dWinners(winningHIPS, star_db):
    stars = star_db[star_db['HIP'].isin(hip_ids)].copy()
    stars['Plx'] = pd.to_numeric(stars['Plx'], errors='coerce').fillna(1.0)
    stars.loc[stars['Plx'] <= 0, 'Plx'] = 1.0

    stars['distance'] = 1000.0 / stars['Plx']

    ra_rad = np.radians(stars['RAICRS'])
    dec_rad = np.radians(stars['DEICRS'])

    stars['x_3d'] = stars['distance'] * np.cos(dec_rad) * np.cos(ra_rad)
    stars['y_3d'] = stars['distance'] * np.cos(dec_rad) * np.sin(ra_rad)
    stars['z_3d'] = stars['distance'] * np.sin(dec_rad)

    result = []
    for _, row in stars.iterrows():
        result.append({
            'hip': int(row['HIP']),
            'x': row['x_3d'],
            'y': row['y_3d'],
            'z': row['z_3d'],
            'vmag': row['Vmag']
        })
        
    return result