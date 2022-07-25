const verseElement = document.getElementById('verse')
let verse
let versions

fetch('http://localhost:8000/results')
	.then((res) => res.json())
	.then((data) => {
		verseElement.textContent = data
		const formatData = data.split('(')
		verse = formatData[0].trim()
		console.log(verse, 'here')
	})
	.catch((err) => console.log(err))
