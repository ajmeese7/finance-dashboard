# stocks-dashboard
A dashboard to track performance of your stocks over time.

## Plan
- Use the Ameritrade API to search the ticker for current price:
	https://api.tdameritrade.com/v1/marketdata/quotes?apikey={key}&symbol=TCEHY
- Redux for state management
	- [Cookies?](https://medium.com/@bhavikbamania/a-beginner-guide-for-redux-with-next-js-4d018e1342b2)
- Run this command again to make sure it worked: `npx react-codemod rename-unsafe-lifecycles`
- Implement a `.env.dev` for production, like [here](https://nextjs.org/docs/basic-features/environment-variables)
and [here](https://blog.logrocket.com/using-authentication-in-next-js/)
- Need to kill Mongo connections after a certain amount of time somehow, and have a
procedure to re-establish connectivity should the need arise while a tab is still open.

## Wishlist
- Option to change profile picture; haven't added yet because so far I don't need to store
any images for this project and I wasn't looking to add storage outside MongoDB quite yet.
- "Joint Net Worth" feature to see how much money is shared by two profiles; can be used
for relationships/couples.
- 404 page for username that doesn't exist, and private page indicator if applicable

## Development
### Install
- `yarn`
- `yarn dev`
