// https://github.com/vercel/next.js/issues/1365#issuecomment-822628701
module.exports = {
  future: {
    webpack5: true,
  },
  publicRuntimeConfig: {
    // TODO: Fix as detailed in README
    IS_LOCAL_DEV: process.argv.includes('dev')
  }
}