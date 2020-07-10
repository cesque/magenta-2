export default class Song {
  constructor(song) {
    this.filename = song.settings.filename
    this.bpm = song.settings.bpm || 60
    this.background = song.settings.background || '#000000'
    this.timeBeforeStart = song.settings.timeBeforeStart || 0
    this.colors = song.settings.colors || [
      '#ff4757',
      '#ff6348',
      '#ffa502',
      '#2ed573',
      '#1e90ff',
      '#3742fa',
    ]

    this.tokeniseInput(song.actions)
  }

  tokeniseInput(actions) {
    this.actions = []

    let tokens = [
      ' ',
      '\n',
      '\r',
      '\t',
      '.',
      'x',
      'o',
      '<',
      '>',
      '{',
      '}',
      '[',
      ']',
      '|',
      'u',
      'd',
    ]

    let divideBeats = 4
    let time = 0
    let index = 0

    function makeAction(inner, outer, index, length, time) {
      return {
        index: index,
        action: inner + ' ' + outer,
        length: length,
        start: time,
        end: time + length,
      }
    }

    // inner outer
    // . keep keep
    // x off off
    // o on on
    // < on off
    // > off on
    // { on keep
    // } keep on
    // [ keep off
    // ] off keep
    // | on match

    for (let i = 0; i < actions.length; i++) {
      let length = ((1 / this.bpm) * 60) / divideBeats
      if (tokens.includes(actions[i])) {
        switch (actions[i]) {
          case ' ': case '\n': case '\r': case '\t':
            // ignore whitespace
            break
          case 'u':
            divideBeats *= 2
            break;
          case 'd':
            divideBeats /= 2
            break
          case '.':
            this.actions.push(makeAction('keep', 'keep', index, length, time))
            index += 1
            time += length
            break
          case 'x':
            this.actions.push(makeAction('off', 'off', index, length, time))
            index += 1
            time += length
            break
          case 'o':
            this.actions.push(makeAction('on', 'on', index, length, time))
            index += 1
            time += length
            break
          case '<':
            this.actions.push(makeAction('on', 'off', index, length, time))
            index += 1
            time += length
            break
          case '>':
            this.actions.push(makeAction('off', 'on', index, length, time))
            index += 1
            time += length
            break
          case '{':
            this.actions.push(makeAction('on', 'keep', index, length, time))
            index += 1
            time += length
            break
          case '}':
            this.actions.push(makeAction('keep', 'on', index, length, time))
            index += 1
            time += length
            break
          case '[':
            this.actions.push(makeAction('keep', 'off', index, length, time))
            index += 1
            time += length
            break
          case ']':
            this.actions.push(makeAction('off', 'keep', index, length, time))
            index += 1
            time += length
            break
          case '|':
            this.actions.push(makeAction('on', 'match', index, length, time))
            index += 1
            time += length
            break
          default:
            throw 'this should never happen - unknown operation ' + actions[i]
        }
      } else {
        console.log('unrecognised operation: ' + actions[i])
      }
    }
  }
}