const buildToolsSpec = require('./utils/build-tools-spec')
const Assistant = require('./Assistant')
const Action = require('../Action')
const debug = require('ethernaut-common/src/debug')

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json')
    config.tools = buildToolsSpec(hre)

    super('interpreter', config)

    this.injectAdditionalInstructions(
      hre.config.ethernaut.ai.interpreter.additionalInstructions,
    )

    this.on('tool_calls_required', this.processToolCalls)

    this.hre = hre
  }

  async processToolCalls(toolCalls) {
    debug.log(`Tool calls required: ${toolCalls.length}`, 'ai')
    debug.log(toolCalls, 'ai-deep')

    const actions = toolCalls.map((tc) => new Action(tc, hre))
    const actionDescriptions = actions.map((a) => a.getDescription())

    debug.log('Emitting calls_required event', 'ai')

    this.emit('actions_required', actions, actionDescriptions)
  }
}

module.exports = Interpreter
