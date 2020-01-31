const rp = require('request-promise-native')

exports.getAsync = async (url, opt = {}, headers = {}) => {
  const options = Object.assign({},
    {
      uri: url,
      json: true,
      headers: Object.assign(
        {
          'Content-Encoding': 'gzip',
          'User-Agent': 'Request-Promise'
        },
        Object.keys(headers).length ? headers : {}
      ),
      rejectUnauthorized: false
    },
    Object.keys(opt).length ? opt : {}
  )

  try {
    const res = await rp(options)
    return res
  } catch (e) {
    console.log('e ===> ', e)
    throw e
  }

}
