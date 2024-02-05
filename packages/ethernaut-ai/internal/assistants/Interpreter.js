const buildToolsSpec = require('./utils/build-tools-spec');
const Assistant = require('./Assistant');
const TaskCall = require('../TaskCall');
const { Select } = require('enquirer');
const Explainer = require('./Explainer');
const Thread = require('../threads/Thread');
const chalk = require('chalk');

class Interpreter extends Assistant {
  constructor(hre) {
    const config = require('./configs/interpreter.json');
    config.tools = buildToolsSpec(hre);

    super('interpreter', config);

    this.explainer = new Explainer(hre);
  }

  async processToolCalls(toolCalls) {
    const calls = toolCalls.map((tc) => new TaskCall(tc));

    const callsStrings = this.printCalls(calls);

    switch (await this.promptUser()) {
      case 'execute':
        return this.executeCalls(calls, hre);
      case 'explain':
        const userQuery = await this.thread.getLastMessage();
        await this.explain(userQuery, callsStrings);
        return await this.processToolCalls(toolCalls);
      case 'skip':
        return undefined;
    }
  }

  async explain(userQuery, callStrings) {
    const query = `Explain how the last user query would be resolved with the following calls:\n${callStrings.join(
      '\n'
    )}`;

    const secondaryThread = new Thread('explanation');
    await secondaryThread.post(userQuery);
    await secondaryThread.post(query);

    const response = await this.explainer.process(secondaryThread);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log('--------------------------------------');
    console.log(chalk.blue(response));
    console.log('--------------------------------------');
  }

  async executeCalls(calls, hre) {
    let outputs = [];

    for (const call of calls) {
      outputs.push(await call.execute(hre));
    }

    return outputs;
  }

  promptUser() {
    const prompt = new Select({
      message: 'How would you like to proceed?',
      choices: ['execute', 'explain', 'skip'],
    });

    return prompt.run().catch(() => process.exit(0));
  }

  printCalls(calls) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log('--------------------------------------');
    console.log(
      chalk.blue.bold('The assistant wants to run the following commands:')
    );

    const strings = [];
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      const msg = `${i + 1}. \`${call.toCliSyntax()}\``;
      console.log(msg);
      strings.push(msg);
    }
    console.log('--------------------------------------');

    return strings;
  }
}

module.exports = Interpreter;
