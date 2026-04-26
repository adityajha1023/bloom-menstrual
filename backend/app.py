from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

print("Loading model...")
model = joblib.load("model.pkl")
print("Model loaded")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        cycle_length = float(data.get("cycle_length"))
        avg_cycle = float(data.get("avg_cycle", cycle_length))
        last_period = data.get("last_period")

        # ML prediction (ovulation day index)
        ovulation_day = model.predict([[cycle_length, avg_cycle]])[0]

        last_date = datetime.strptime(last_period, "%Y-%m-%d")

        next_period_date = last_date + timedelta(days=int(cycle_length))
        ovulation_date = last_date + timedelta(days=int(ovulation_day))

        return jsonify({
            "next_period": next_period_date.strftime("%Y-%m-%d"),
            "ovulation_date": ovulation_date.strftime("%Y-%m-%d"),
            "ovulation_day": int(ovulation_day)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)