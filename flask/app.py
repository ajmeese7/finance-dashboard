from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/hi")
def hi():
    return "Hi"

if __name__ == "__main__":
    app.run()