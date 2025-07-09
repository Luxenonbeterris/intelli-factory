import cors from 'cors'
import express from 'express'
import categoriesRouter from './routes/categories'
import offersRouter from './routes/offers'
import requestsRouter from './routes/requests'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/categories', categoriesRouter)
app.use('/api/offers', offersRouter)
app.use('/api/requests', requestsRouter)

export default app
