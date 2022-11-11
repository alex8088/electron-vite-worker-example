console.log(`Hello from ${process.argv[2]}!`)

process.on('message', function (message) {
  console.log(`Message from main: ${message}`)
  process.send!('pong')
})

setTimeout(() => {
  process.exit()
}, 4_000)
