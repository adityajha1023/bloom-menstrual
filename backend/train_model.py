import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

print("Loading dataset...")

df = pd.read_csv("data.csv")

print("Columns found:", df.columns)

# Replace blank spaces with NaN
df = df.replace(" ", pd.NA)

# Convert required columns to numeric
cols = ["LengthofCycle", "MeanCycleLength", "EstimatedDayofOvulation"]

for col in cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Drop rows where required data is missing
df = df.dropna(subset=cols)

print("Data cleaned. Rows remaining:", len(df))

# Features
X = df[["LengthofCycle", "MeanCycleLength"]]

# Target
y = df["EstimatedDayofOvulation"]

print("Training model...")

model = RandomForestRegressor()
model.fit(X, y)

# Save model
joblib.dump(model, "model.pkl")

print("Model trained and saved successfully")