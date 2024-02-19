import { fork } from 'child_process'

const server = fork('src/http-server.ts', { detached: true })

await new Promise((resolve, reject) => {
    server.on('message', (message) => {
        if (message === 'ready') {
            resolve(undefined)
        } else {
            reject(new Error('Unexpected message'))
        }
    })

    server.on('error', reject)
})

console.log('Server is ready')
process.exit(0)
