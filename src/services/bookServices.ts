import { Book } from '../models/book'
import * as repo from '../repository/bookRepositoryDb'
import s3Client from '../awsConfig'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { randomBytes } from 'crypto'

export { Book }

export const getBookByTitle = (title: string): Promise<Book[]> =>
  repo.getBookByTitle(title)
export const getAllBooks = (): Promise<Book[]> => repo.getAllBooks()
export const getBookById = (id: number): Promise<Book | undefined> =>
  repo.getBookById(id)
export const addBook = (newBook: Book): Promise<Book> => repo.addBook(newBook)

const generateSaltedFilename = (originalName: string): string => {
  const salt = randomBytes(16).toString('hex')
  const extension = originalName.split('.').pop() || ''
  return `${salt}.${extension}`
}

export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: Express.Multer.File
): Promise<string> => {
  const saltedFilename = generateSaltedFilename(file.originalname)
  const saltedFilePath = `${filePath}/${saltedFilename}`

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: saltedFilePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    )

    const publicUrl = `https://qiwwqmigxpucshdwfzup.supabase.co/storage/v1/object/public/images/${saltedFilePath}`
    console.log('File uploaded successfully:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}