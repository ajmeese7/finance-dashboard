# stocks-dashboard
A dashboard to track performance of your stocks over time.

## Plan
- Use the Yahoo API as follows to turn names to stock tickers:
    http://d.yimg.com/autoc.finance.yahoo.com/autoc?query={tencent}&region=1&lang=en&callback=YAHOO.Finance.SymbolSuggest.ssCallback
    - Potentially can use Google as an alternative:
    https://stackoverflow.com/a/1954823/6456163
- Use the Ameritrade API to search the ticker for current price:
    https://api.tdameritrade.com/v1/marketdata/quotes?apikey={key}&symbol=TCEHY
- Use Python (Flask) and Next.js to practice two new things, following this example:
    https://medium.com/swlh/build-a-twitter-login-component-using-nextjs-and-python-flask-44c17f057096

## Development
### Flask App
#### Install
- `cd flask`
- `python -m venv ./venv`
- `venv/scripts/Activate.ps1` for Powershell, `venv/scripts/activate.bat` for cmd
- `pip install -r requirement.txt`

#### Run
- `venv/scripts/Activate.ps1`
- `python app.py`

#### Add new packages
- `pip install package_names`
- `pip freeze > requirements.txt`

### NextJS App
#### Install
- `yarn`
- `yarn dev`