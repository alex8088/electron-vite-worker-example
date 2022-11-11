import { fork } from 'child_process'
import { resolve } from 'path'

export default function call(): void {
  const child = fork(resolve(__dirname, 'child.js'), ['child'])
  child.on('message', function (message) {
    console.log(`Message from child: ${message}`)
  })
  child.on('close', function (code) {
    console.log('child process exited with code ' + code)
  })
  setTimeout(() => {
    child.send('ping')
  }, 2_500)
}
