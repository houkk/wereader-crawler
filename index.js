const booksCrawler = require('./crawler')
const { parse } = require('json2csv')
const fs = require('fs')

const toCsvFile = async (fields, data, filePath) => {
  const csv = parse(data, { fields, withBOM: true })
  await fs.writeFileSync('./out.csv', csv)
}

;(async () => {
  try {
    const star = 80 // 书籍评分
    const booksList = await new booksCrawler(star).run()
    const allBooks = []
    for (let i in booksList) {
      const booksWithCate = booksList[i]
      const cate = booksWithCate.cate
      for (let j in booksWithCate.bookList) allBooks.push(Object.assign({ cate }, booksWithCate.bookList[j]))
    }
    await toCsvFile([ 'cate', 'title', 'star' ], allBooks)

    console.log('Get date from ./out.csv')
    console.log('Get date from ./out.csv')
    console.log('Get date from ./out.csv')
    console.log('Get date from ./out.csv')

  } catch (error) {
    console.log('e ===> ', error)
  }
})()

;(async () => {
  try {
    const star = 90 // 书籍评分
    const booksList = await new booksCrawler(star).run()
    console.log('books ==> ', JSON.stringify(allBooks, null, 2))
  } catch (e) {
    console.log('e ======> ', e)
  }
})