const { Terminal, keys } = require('ethernaut-common/src/terminal')

describe('navigate scope', function () {
  const terminal = new Terminal()

  describe('when entering navigation at a particular scope', function () {
    before('run navigate util', async function () {
      await terminal.run('npx hardhat navigate util', 1000)
    })

    it('displays the main prompt', async function () {
      terminal.has('Pick a task or scope')
    })

    it('doesnt display any scopes', async function () {
      terminal.notHas('[')
    })

    it('shows utils', async function () {
      terminal.has('bytes')
      terminal.has('string')
      terminal.has('unit')
    })

    it('shows the up nav', async function () {
      terminal.has('up')
    })

    describe('when navigating up', function () {
      before('navigate', async function () {
        await terminal.input(keys.ENTER, 100)
      })

      it('does not show utils', async function () {
        terminal.notHas('bytes')
        terminal.notHas('string')
        terminal.notHas('unit')
      })

      it('shows the util scope', async function () {
        terminal.has('[util]')
      })
    })
  })
})
