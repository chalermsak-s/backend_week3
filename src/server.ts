import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import eventRoute from './routes/eventRoute';
import bookRoute from './routes/bookRoute';
dotenv.config()
const app = express()
app.use(express.json())
app.use('/event',eventRoute);
app.use('/book',bookRoute);
const port = 3000
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
