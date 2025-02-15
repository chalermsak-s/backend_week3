import express, { Request, Response } from 'express'
import {
  getAllEvents,
  getEventByCategory,
  getEventById,
  addEvent,
  Event,
} from './services/eventService'
import {
  getAllBooks,
  getBookByTitle,
  getBookById,
  addBook,
  Book,
} from './services/bookServices'
import add from './function'
const app = express()
app.use(express.json())
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Events API')
})

app.get('/events', (req, res) => {
  if (req.query.category) {
    const category = req.query.category as string
    const filteredEvents = getEventByCategory(category)
    res.json(filteredEvents)
  } else {
    res.json(getAllEvents())
  }
})

app.get('/events/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const event = getEventById(id)
  if (event) {
    res.json(event)
  } else {
    res.status(404).send('Event not found')
  }
})

app.post('/events', (req, res) => {
  const newEvent: Event = req.body
  addEvent(newEvent)
  res.json(newEvent)
})


app.get('/books', (req, res) => {
  if (req.query.title) {
    const title = req.query.title as string
    const filteredBooks = getBookByTitle(title)
    res.json(filteredBooks)
  } else {
    res.json(getAllBooks())
  }
})

app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const book = getBookById(id)
  if (book) {
    res.json(book)
  } else {
    res.status(404).send('Book not found')
  }
})

app.post('/books', (req, res) => {
  const newBook: Book = req.body
  addBook(newBook)
  res.json(newBook)
})

app.get('/add', (req, res) => {
  const a = parseInt(req.query.a as string)
  const b = parseInt(req.query.b as string)
  const result = add(a, b)
  res.json({ result })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
