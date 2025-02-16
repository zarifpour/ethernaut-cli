const { Terminal } = require('ethernaut-common/src/terminal')
const { getNetworkName } = require('ethernaut-common/src/network')

describe('completing level 2 of ethernaut with ai', function () {
  const terminal = new Terminal()

  before('check network', async function () {
    if (getNetworkName(hre) !== 'sepolia') {
      throw new Error('This test must be run on the sepolia network')
    }
  })

  before('run command', async function () {
    await terminal.run(
      'ethernaut ai interpret "complete level 2 of the ethernaut challenges" --no-confirm --new-thread --model "gpt-4"',
    )
  })

  it('completes the level', async function () {
    terminal.has('Level completed')
  })
})
