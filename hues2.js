import Song from './Song.js'
import input from './songs/magenta.js'

let song = new Song(input)
console.log(song)

let audio
let inner, outer

let index = 0
let current = {}
let pretimer = 0, lastpretimer = 0
let lastPosition = 0, currentPosition = 0


document.addEventListener('DOMContentLoaded', () => {
  inner = document.querySelector('.inner')
  outer = document.querySelector('.outer')

  audio = document.querySelector('audio')
  audio.volume = 0.1

  document.addEventListener('click', () => {
    audio.src = song.filename
    let f = () => {
      console.log('canplay')
      audio.removeEventListener('canplay', f)
      audio.play()
      start()
    }
    
    audio.addEventListener('canplay', f)
  })

  function makeState(thisOne, otherOne) {
    return {
      _current: 0,
      cache: 0,
      on: function () {
        let next = Math.floor(Math.random() * song.colors.length)
        while(next == this._current) next = Math.floor(Math.random() * song.colors.length)
        this._current = next
        this._cache = this._current
        thisOne.style.backgroundColor = song.colors[this._current]
      },
      off: function() {
        this._current = -1
        thisOne.style.backgroundColor = song.background
      },
      match: function () {
        this.current = otherOne.state.current
      },
      recall: function () {
        this._current = this.cache
        thisOne.style.backgroundColor = song.colors[this._current]
      },
      get current() { return this._current },
      set current(value) {
        this._current = value
        thisOne.style.backgroundColor = song.colors[value]
      }
    }
  }

  inner.state = makeState(inner, outer)

  outer.state = makeState(outer, inner)
})

let opFunctions = {
  'keep': t => { },
  'on': t => {
    t.state.on()
  },
  'off': t => {
    t.state.off()
  },
  'recall': t => {
    t.state.recall()
  },
  'match': t => {
    t.state.match()
  }
}

function start() {
  index = 0
  current = song.actions[index]
  lastpretimer = performance.now()
  pretimer = 0
  requestAnimationFrame(pretimeAnimationFrame)
}

function seek(seconds) {
  audio.currentTime = seconds
  currentPosition = seconds - song.timeBeforeStart
  index = song.actions.findIndex(x => x.start < currentPosition && x.end > currentPosition)
  console.log(index)
  current = song.actions[index]
  if(lastPosition > currentPosition) lastPosition = currentPosition
}

function pretimeAnimationFrame(timestamp) {
  let delta = timestamp - lastpretimer
  pretimer += (delta / 1000)
  // console.log(pretimer)
  if (pretimer >= song.timeBeforeStart) {
    runAction(current)
    lastPosition = performance.now()
    // seek(10)
    requestAnimationFrame(animationFrame)
  } else {
    lastpretimer = timestamp
    requestAnimationFrame(pretimeAnimationFrame)
  }
}

function animationFrame(timestamp) {
  let delta = timestamp - lastPosition
  currentPosition += (delta / 1000)
  
  if (currentPosition > current.end) {
    console.log(index)
    index++
    current = song.actions[index]
    if(current) runAction(current)
  }

  if (current) {
    lastPosition = timestamp
    requestAnimationFrame(animationFrame)
  } else {
    audio.pause()
  }
}

function runAction(action) {
  // console.log(action)
  let parts = action.action.split(' ')
  runPart(parts[0], inner)
  runPart(parts[1], outer)
}

function runPart(action, target) {
  opFunctions[action](target)
}