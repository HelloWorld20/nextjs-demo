export default async function handler(req, res) {

  // console.log('%c [ req ]-3', 'font-size:13px; background:pink; color:#bf2c9f;', Object.getOwnPropertyNames(req))
  // console.log('req.query', req.query)

  const { appid } = req.query

  if (!appid) res.json({ msg: false })

  let appData = {};

  try {
    appData = require(`../../../datas/${appid}`);
  } catch (error) {
    res.json({ msg: '404' })
  }

  if (!appData) res.json({ msg: '404' })

  res.json(appData)
}