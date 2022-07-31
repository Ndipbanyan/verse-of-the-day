const PORT = 8000
import axios from 'axios'
import cheerio from 'cheerio'
import express from 'express'
const app = express()
import cors from 'cors'
app.use(cors())

const url = 'https://www.bible.com/verse-of-the-day'
let rawVerse

app.get('/', function (req, res) {
	res.json('Verse of the day scrapper')
})

app.get('/results', (_req, res) => {
	axios(url)
		.then((response) => {
			const html = response.data
			const $ = cheerio.load(html)
			const articles = []

			$('.usfm ', html).each(function () {
				const title = $(this).text()
				articles.push(title)
			})
			rawVerse = articles[0]
			res.json(articles[0])
		})
		.catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
