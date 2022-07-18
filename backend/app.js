const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())

const url = 'https://www.bible.com/verse-of-the-day'

app.get('/', function (req, res) {
	res.json('This is my webscraper')
})

app.get('/results', (req, res) => {
	axios(url)
		.then((response) => {
			const html = response.data
			const $ = cheerio.load(html)
			const articles = []

			$('.usfm ', html).each(function () {
				const title = $(this).text()
				articles.push(title)
			})
			res.json(articles[0])
		})
		.catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
