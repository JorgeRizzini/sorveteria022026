import { app } from './app.js'
import { env } from './config/env.js'

app.listen(env.PORT, () => {
  console.log(`ArcadeCream API disponível em http://localhost:${env.PORT}`)
})
