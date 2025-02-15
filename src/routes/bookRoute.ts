import express, { Request, Response } from 'express'
import {
  getAllBooks,
  getBookByTitle,
  getBookById,
  addBook
} from '../services/bookServices'
import type {Book} from '../models/book'
import add from '../function'
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })
import { uploadFile } from '../services/uploadFileService';
const router = express.Router()

router.get('/', async (req, res) => {
  if (req.query.title) {
    const title = req.query.title as string
    const filteredBooks = getBookByTitle(title)
    res.json(filteredBooks)
  } else {
    res.json(await getAllBooks())
  }
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const book = await getBookById(id)
  if (book) {
    res.json(book)
  } else {
    res.status(404).send('Book not found')
  }
})

router.post('/', async (req, res) => {
  const newBook: Book = req.body
  await addBook(newBook)
  res.json(newBook)
})

router.get('/add', async (req, res) => {
  const a = parseInt(req.query.a as string)
  const b = parseInt(req.query.b as string)
  const result = add(a, b)
  res.json({ result })
})

router.post('/upload', upload.single('file'), async (req: any, res: any) => {
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

export default router
