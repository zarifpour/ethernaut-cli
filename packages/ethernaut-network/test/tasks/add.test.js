const assert = require('assert')
const { Terminal } = require('ethernaut-common/src/terminal')
const storage = require('ethernaut-network/src/internal/storage')

describe('add', function () {
  const terminal = new Terminal()

  const removeTestNetworks = function () {
    const networks = storage.readNetworks()
    if ('test__1' in networks) delete networks.test__1
    if ('test__2' in networks) delete networks.test__2
    storage.storeNetworks(networks)
  }

  before('remove test networks', removeTestNetworks)
  after('remove test networks', removeTestNetworks)

  before('run add', async function () {
    await terminal.run(
      'npx hardhat network add test__1 --url http://localhost:8545',
    )
  })

  it('adds the network', async function () {
    const networks = storage.readNetworks()
    assert.deepEqual(networks.test__1, { url: 'http://localhost:8545' })
  })
})
