const ora = require("ora");
const colors = require("colors");
console.log("");
const spinner = ora('Running Project').start();

const exportThis = {
    outputMessages: (text, color) => 
    {
        spinner.start();
        spinner.color = color;
        spinner.text = text;
    },
    stopSpinner: () =>
    {
        spinner.stop()
    },
    everythingWorked: (text) => 
    {
        spinner.succeed(text.green);
    },
    somethingWrong: (text) => 
    {
        spinner.fail(text.red);
    }
}

module.exports = exportThis;