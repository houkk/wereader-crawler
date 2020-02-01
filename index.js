const BooksCrawler = require('./crawler')
const { parse } = require('json2csv')
const fs = require('fs')
const interactive = require('./interactive')

const toCsvFile = async (fields, data, filePath) => {
  const csv = parse(data, { fields, withBOM: true })
  await fs.writeFileSync('./out.csv', csv)
}

;(async () => {
  try {
    const star = 80 // 书籍评分
    const booksList = await new BooksCrawler(star).run()
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
})

;(async () => {
  try {
    const star = 90 // 书籍评分
    const booksList = await new BooksCrawler(star).run()
    console.log('books ==> ', JSON.stringify(booksList, null, 2))
  } catch (e) {
    console.log('e ======> ', e)
  }
})

;(async () => {
  const star = interactive.range(40, 99) // 输入评分限制
  const booksCrawler = await new BooksCrawler(star)
  let categories = await booksCrawler.getCategory()

  const cateIndex = interactive.simple('选择指定榜单或全部榜单', categories.map(_cate => _cate.text), { cancel: 'ALL' })
  categories = (cateIndex === -1) ? categories : [ categories[cateIndex] ]

  const booksList = await new BooksCrawler(star).run(categories)
  console.log('books ==> ', JSON.stringify(booksList, null, 2))

})()