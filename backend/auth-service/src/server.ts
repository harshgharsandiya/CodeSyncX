import app from './app'
import { config } from './config/env'

app.listen(config.port, () => {
    console.log(`Auth Service running on port ${config.port}`)
})
