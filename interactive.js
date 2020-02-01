const readlineSync = require('readline-sync')

const simple = (question = '???', answerArr = [], opt = {}) => {
  // opt { cancel: 'ALL' (default: CANCEL)}
  return answerArr.length ? readlineSync.keyInSelect(answerArr, question, opt) : readlineSync.question(question)
}

const range = (min, max, val) => {
  console.log('\n\n' + (new Array(20)).join(' ') + '[Z] <- -> [M]  FIX: [SPACE] Exit: [Q]\n')

  let value = val || parseInt((max - min) / 2 + min)
  let quite = false
  while (true) {
    console.log(
      '\x1B[1A\x1B[K|' +
      (new Array(max - value + 1)).join('-') + 'O' +
      (new Array(value - min + 1)).join('-') + '| ' + value
    )
    key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'zmq ' });

    if (key === 'z') {
      if (value < max) value++
    }
    else if (key === 'm') {
      if (value > min) value--
    }
    else {
      if (key === 'q') quite = true
      break
    }
  }
  if (quite) {
    console.log('Exit ......')
    process.exit(0)
  }
  console.log('\nA value the user requested: ' + value);
  return value
}

module.exports = {
  simple,
  range,
  ...readlineSync
}