const { Command } = require('commander');
const fs = require('fs');

const program = new Command();

program
  .option('-i, --input <path>', 'input file path')
  .option('-o, --output <path>', 'output file path')
  .option('-d, --display', 'display result in console')
  .option('-c, --cylinders', 'display model, cylinders and mpg')
  .option('-m, --mpg <value>', 'show only cars with mpg lower than given value');


program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}

const fileContent = fs.readFileSync(options.input, 'utf-8');

const lines = fileContent
  .split('\n')
  .filter(line => line.trim() !== '') 
  .map(line => JSON.parse(line)); 

let resultData = lines;

if (options.mpg) {
  const mpgLimit = parseFloat(options.mpg);
  resultData = resultData.filter(car => {
    const mpg = parseFloat(car.mpg);
    return !isNaN(mpg) && mpg < mpgLimit;
  });
}

if (options.cylinders) {
  resultData = resultData.map(car => ({
    model: car.model || 'unknown',
    cyl: car.cyl ?? 'N/A',
    mpg: car.mpg ?? 'N/A'
  }));
}

const result = resultData.map(car => `${car.model} ${car.cyl} ${car.mpg}`).join('\n');

if (options.output) {
  fs.writeFileSync(options.output, result);
}

if (options.display) {
  console.log(result);
}
