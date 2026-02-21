import os

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np


def plotSky(inputCoords):

    # 1. Load your clean database
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    raw_data_file = os.path.join(BASE_DIR, "app_star_database.csv")
    df = pd.read_csv(raw_data_file, skiprows=[1, 2])

    df['HIP'] = pd.to_numeric(df['HIP'], errors='coerce')
    df['RAICRS'] = pd.to_numeric(df['RAICRS'], errors='coerce')
    df['DEICRS'] = pd.to_numeric(df['DEICRS'], errors='coerce')
    df['Vmag'] = pd.to_numeric(df['Vmag'], errors='coerce')

    targetHipid = inputCoords
    targetStars = df[df['HIP'].isin(targetHipid)]

    # Create an ordered list to draw the lines in the correct sequence
    target_ordered = targetStars.set_index('HIP').loc[targetHipid]

    # 3. Find the "Bounding Box" to frame the camera
    min_ra, max_ra = targetStars['RAICRS'].min(), targetStars['RAICRS'].max()
    min_dec, max_dec = targetStars['DEICRS'].min(), targetStars['DEICRS'].max()

    # Add a 5-degree padding around the edges so the constellation isn't cut off
    padding_ra = max(5.0, (max_ra - min_ra) * 2)
    padding_dec = max(5.0, (max_dec - min_dec) * 2)

    # Get all the background stars in that padded neighborhood
    bg_stars = df[
        (df['RAICRS'] >= min_ra - padding_ra) & (df['RAICRS'] <= max_ra + padding_ra) &
        (df['DEICRS'] >= min_dec - padding_dec) & (df['DEICRS'] <= max_dec + padding_dec)
    ]

    # 4. Draw the Map!
    plt.figure(figsize=(10, 8), facecolor='#050515') # Deep space color
    ax = plt.gca()
    ax.set_facecolor('#050515')

    # INVERT the X-axis because we are looking up at the sky
    ax.invert_xaxis()

    # Calculate dot size for background stars based on magnitude
    vmag_values = bg_stars['Vmag'].fillna(6)
    bg_sizes = np.maximum(1, 8 - vmag_values) ** 2

    # Plot Background
    plt.scatter(bg_stars['RAICRS'], bg_stars['DEICRS'], color='white', s=bg_sizes, alpha=0.5)

    # Plot the Constellation Lines
    plt.plot(target_ordered['RAICRS'], target_ordered['DEICRS'], color='yellow', linestyle='-', linewidth=2, alpha=0.7)

    # Plot the Constellation Stars
    plt.scatter(targetStars['RAICRS'], targetStars['DEICRS'], color='cyan', s=150, zorder=5, edgecolors='white', linewidth=1.5)

    # Add Labels
    for _, row in targetStars.iterrows():
        plt.annotate(f"HIP {int(row['HIP'])}", (row['RAICRS'], row['DEICRS']), 
                    color='yellow', xytext=(10,10), textcoords='offset points', fontsize=12)

    plt.xlabel('Right Ascension (Degrees)', color='white')
    plt.ylabel('Declination (Degrees)', color='white')
    plt.title('Your Found Constellation Mapped on the Sky', color='white', fontsize=16)
    ax.tick_params(colors='white')
    plt.grid(True, linestyle=':', alpha=0.3, color='white')

    # Save it as an image file
    plt.savefig('constellation_map.png', bbox_inches='tight')
    # print("Successfully generated constellation map!")

    plt.show()