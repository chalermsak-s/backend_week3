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

import multer from 'multer'
import { uploadFile } from './services/uploadFileService'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
const port = 3000

const upload = multer({ storage: multer.memoryStorage() })

app.post('/upload', upload.single('file'), async (req: any, res: any) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).send('No file uploaded.')
    }

    const bucket = process.env.SUPABASE_BUCKET_NAME
    const filePath = process.env.UPLOAD_DIR

    if (!bucket || !filePath) {
      return res.status(500).send('Bucket name or file path not configured.')
    }
    const ouputUrl = await uploadFile(bucket, filePath, file)
    res.status(200).send(ouputUrl)
  } catch (error) {
    res.status(500).send('Error uploading file.')
  }
})

app.post('/book/upload', upload.single('file'), async (req: any, res: any) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).send('No file uploaded.')
    }
    const bucket = process.env.SUPABASE_BUCKET_NAME
    const filePath = process.env.UPLOAD_DIR

    if (!bucket || !filePath) {
      return res.status(500).send('Bucket name or file path not configured.')
    }
    const ouputUrl = await uploadFile(bucket, filePath, file)
    res.status(200).send(ouputUrl)
  } catch (error) {
    res.status(500).send('Error uploading file.')
  }
})

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Events API')
})

app.get('/events', async (req, res) => {
  if (req.query.category) {
    const category = req.query.category as string
    const filteredEvents = await getEventByCategory(category)
    res.json(filteredEvents)
  } else {
    res.json(await getAllEvents())
  }
})

app.get('/events/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const event = await getEventById(id)
  if (event) {
    res.json(event)
  } else {
    res.status(404).send('Event not found')
  }
})

app.post('/events', async (req, res) => {
  const newEvent: Event = req.body
  await addEvent(newEvent)
  res.json(newEvent)
})

app.get('/books', async (req, res) => {
  if (req.query.title) {
    const title = req.query.title as string
    const filteredBooks = getBookByTitle(title)
    res.json(filteredBooks)
  } else {
    res.json(await getAllBooks())
  }
})

app.get('/books/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const book = await getBookById(id)
  if (book) {
    res.json(book)
  } else {
    res.status(404).send('Book not found')
  }
})

app.post('/books', async (req, res) => {
  const newBook: Book = req.body
  await addBook(newBook)
  res.json(newBook)
})

app.get('/add', async (req, res) => {
  const a = parseInt(req.query.a as string)
  const b = parseInt(req.query.b as string)
  const result = add(a, b)
  res.json({ result })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
