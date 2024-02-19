import express from 'express'

const app = express()

app.use(express.static('assets'))

app.listen(3000, () => {
    if (process.send) {
        process.send('ready')
    }
})

