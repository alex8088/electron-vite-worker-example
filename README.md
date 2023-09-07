# electron-vite-worker-example

![electron version](https://img.shields.io/github/package-json/dependency-version/alex8088/electron-vite-worker-example/dev/electron)
![electron vite version](https://img.shields.io/github/package-json/dependency-version/alex8088/electron-vite-worker-example/dev/electron-vite)

> electron-vite worker and fork example

---

[Check out the documentation to learn more](https://electron-vite.org/guide/assets.html#importing-worker-threads).

## Repo Setup

Clone this repo to your local machine and install the dependencies.

```bash
pnpm i
```

## Worker Example

```js
// main/worker.ts
import { parentPort, workerData } from 'worker_threads'

const port = parentPort
if (!port) throw new Error('IllegalState')

port.on('message', () => {
  port.postMessage(`hello ${workerData}`)
})
```

```js
// main/index.ts
import createWorker from './worker?nodeWorker'
createWorker({ workerData: 'worker' })
    .on('message', (message) => {
      console.log(`Message from worker: ${message}`)
    })
    .postMessage('')
```
## Fork Example

```js
// main/child.ts
console.log(`Hello from ${process.argv[2]}!`)

process.on('message', function (message) {
  console.log(`Message from main: ${message}`)
  process.send!('pong')
})

setTimeout(() => {
  process.exit()
}, 4_000)

```

```js
// main/index.ts
import { fork } from 'child_process'
import { resolve } from 'path'

function call(): void {
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

call()
```

```js
// electron.vite.config.ts
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
          child: resolve(__dirname, 'src/main/child.ts')
        }
      }
    }
  },
  // ...
})

```
