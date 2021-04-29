from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
from werkzeug.exceptions import HTTPException
import os
from dotenv import load_dotenv
load_dotenv("../.env")

app = Flask(__name__)
CORS(app)

# IDEA: maybe scrolling options box beneath input as they type, performing
# dynamic lookups on keypress with a slight delay to not send too
# many in a short time frame if they're still typing
@app.route("/get_tickers/<name>")
def get_tickers(name):
	r = requests.get(
		"http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={}&region=1&lang=en"
		.format(name)
	)
	tickers = json.loads(r.text)["ResultSet"]["Result"]

	# Return a max of three securities
	filtered_tickers = [x for x in tickers if x['type'] == 'S'][:3]

	# NOTE: The Ameritrade ticker lookup only supports type 'S'; will need
	# to look into other APIs for 'M', probably securities and mutual funds
	return jsonify(filtered_tickers)

# https://stackoverflow.com/a/41547163/6456163
@app.route("/get_ticker_data/<ticker>")
def get_ticker_data(ticker):
	r = requests.get(
		"https://api.tdameritrade.com/v1/marketdata/quotes?apikey={}&symbol={}"
		.format(os.environ.get("AMERITRADE_API_KEY"), ticker)
	)

	# TODO: Additional error checking here, in case ticker is unavailable or API is down
	tickerData = json.loads(r.text)["" + ticker]
	return tickerData

if __name__ == "__main__":
	# TODO: Have a better way to do this with environ vars or something
	app.testing = True
	app.run(host="localhost", port=8080)

# TODO: Ensure this works as expected
@app.errorhandler(HTTPException)
def handle_exception(e):
	"""Return JSON instead of HTML for HTTP errors."""
	response = e.get_response()
	response.data = json.dumps({
		"code": e.code,
		"name": e.name,
		"description": e.description,
	})
	response.content_type = "application/json"
	return response