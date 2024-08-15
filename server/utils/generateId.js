const crypto = require('crypto')

function generateId() {
    const digits = 8
    const id = crypto.randomInt(10**digits, 10**(digits+1) - 1)
    return id
}

module.exports = generateId