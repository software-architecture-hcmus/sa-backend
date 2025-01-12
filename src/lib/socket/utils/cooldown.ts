let cooldownTimeout
let cooldownResolve

export const abortCooldown = () => {
  clearInterval(cooldownTimeout)

  if (cooldownResolve) {
    cooldownResolve()
  }
}

export const cooldown = (ms, io, room, playersSockets, socket ) => {
  let count = ms - 1

  return new Promise((resolve) => {
    cooldownResolve = resolve

    cooldownTimeout = setInterval(() => {
      if (!count) {
        clearInterval(cooldownTimeout)
        resolve()
      }
      socket.emit("game:cooldown", count)
      for(const playersSocket of playersSockets)
        {
          io.to(playersSocket).emit("game:cooldown", count)
        }
      count -= 1
    }, 1000)
  })
}

export const sleep = (sec) => new Promise((r) => setTimeout(r, sec * 1000))
