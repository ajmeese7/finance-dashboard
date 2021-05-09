# stocks-dashboard
A dashboard to track performance of your stocks over time.

## Plan
- Use the Ameritrade API to search the ticker for current price:
	https://api.tdameritrade.com/v1/marketdata/quotes?apikey={key}&symbol=TCEHY
- Redux for state management
	- [Cookies?](https://medium.com/@bhavikbamania/a-beginner-guide-for-redux-with-next-js-4d018e1342b2)
- Run this command again to make sure it worked: `npx react-codemod rename-unsafe-lifecycles`
- Implement a `.enc.dev` for production, like [here](https://nextjs.org/docs/basic-features/environment-variables)
and [here](https://blog.logrocket.com/using-authentication-in-next-js/)

## Development
### Install
- `yarn`
- `yarn dev`