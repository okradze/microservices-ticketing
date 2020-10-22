import express from 'express'
import bodyParser from 'body-parser'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signupRouter } from './routes/signup'
import { signoutRouter } from './routes/signout'

const app = express()
app.use(bodyParser.json())

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.listen(3000, () => {
  console.log('Listening on port 3000!')
})