const { getAsync } = require('./request')
const cheerio = require('cheerio')
const _ = require('lodash')

class Crawler {
  constructor(star = 90) {
    this.weUrl = 'https://weread.qq.com/'
    this.categoryUrl = 'https://weread.qq.com/web/category'
    this.star = star // 评分 90 => 9.0
    this.pageNum = 20 // 暂时貌似无法修改
  }

  /**
   * @description 爬取书籍列表, 并根据评分筛选
   * @param {*} url categeory url (需要转换成 list api)
   * @param {*} maxIndex 每页开始 Index (default 0)
   * @param {*} rank (top 榜单, rank = 1)
   */
  async getBook(url, maxIndex = 0, rank = 0) {
    // bookListInCategory 可为 booklist api
    url = url.replace('category', 'bookListInCategory')

    let bookList = []
    const qs = {
      maxIndex,
      rank
    }

    const res = await getAsync(url, { qs })
    const books = res.books

    books.forEach(book => {
      const bookInfo = book.bookInfo
      // console.log('bookInfo ==> ', bookInfo.star)
      if (bookInfo.star > this.star) {
        bookList.push({ title: bookInfo.title, star: bookInfo.star })
      }
    })

    const hasMore = res.hasMore

    if (hasMore) {
      const res = await this.getBook(url, qs.maxIndex + this.pageNum, rank)
      bookList = bookList.concat(res)
    }

    return bookList
  }

  /**
   * @description 获取微信阅读所有分类
   */
  async getCategory() {
    const categories = []

    const url = this.categoryUrl
    const res = await getAsync(url, {
        json: false
      },
      {
        'Content-Type': 'text/html'
      }
    )

    const $ = cheerio.load(res)
    $('.ranking_list_item').each(function (i, e) {
      const aLabel = $(this).find('a')
      const url = aLabel.attr('href')
      const rankText = aLabel.find('.ranking_list_item_txt').text().trim()
      const text = rankText|| aLabel.text().trim()
      categories.push({ url, text, rank: rankText ? 1 : 0 })
    })
    return categories
  }

  async run (cates = []) {
    // 1. 获取分类
    const categories = cates.length ? cates : await this.getCategory()

    const books = []

    // 2. 按照分类分别获取书籍列表, 可优化没必要
    for (let i in categories) {
      const cate = categories[i]

      console.log(`${cate.text} start`)
      console.time(cate.text)
      const res = await this.getBook(this.weUrl + cate.url.substring(1), 0, cate.rank)
      console.timeEnd(cate.text)

      books.push({
        cate: cate.text,
        bookList: res.sort((a, b) => b.star - a.star)
      })
    }
    return books
  }
}

module.exports = Crawler
