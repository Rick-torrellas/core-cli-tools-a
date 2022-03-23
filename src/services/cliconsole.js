/**
 * Modulo para depurar el codigo, con una serie de logs, muestra mensajes para ayudar a visualizar donde esta el error.
 * @module services/debug
 */
const chalk = require("chalk");
const { log } = console;

export let cliconsole = {};
//TODO: crear una funcion command, que sirve para iniciar un comando, que muestre los argumentos pasados, informacion,etc.
/**
 * El mensaje para indicar que el modo debug esta activado.
 * @param {string} mensaje El mensaje para indicar que el modo debugger esta activado.
 * @returns {void}
 */
function start(
  { verbose, message } = { verbose: false, message: "vebose mode activated" }
) {
  if (verbose) {
    log(`${chalk.red(message)}`);
  }
}
/**
 * Sirve para dar un indentificador y dar un poco de contexto de la funcion, en el que se encuentra el debugger.
 * @param {string} name El nombre de la funcion.
 * @param {string} type La clasificacion de funcion que uno le quiera dar.
 * @returns {void}
 */
function name(name, { verbose } = { verbose: false }) {
  if (verbose) {
    log(`${chalk.bgCyan("Process Name:")} ${name}`);
  }
}
/**
 * Para dar alguna informacion.
 *
 * **Nota**: no necesita tener el debug activado, si quieres usar una vercion con el debug activado usar {@link data}
 * @param {string} title El titulo de la informacion.
 * @param {string} description La descripcion de la informacion.
 * @returns {void}
 */
function info(title, { description } = { description: "no-description" }) {
  log(`${chalk.blue("Info")}: ${chalk.blue.underline(title)}\n`, description);
}
/**
 * Para dar alguna informacion.
 *
 * **Nota**: necesita tener el debug activado, si quieres usar una vercion que no necesite el debug activado usar {@link info}
 */
function data(
  title,
  { description, verbose } = { description: "no description", verbose: false }
) {
  if (verbose) {
    log(`${chalk.blue("Info")}: ${chalk.blue.underline(title)}\n`, description);
  }
}
/**
 * Para indicar que existe un error critico.
 *
 * Tambien puedes hacer una advertencia con {@link warning}
 * @param {string} title El titulo del error.
 * @param {*} error Una explicacion detallada del error.
 * @returns {void}
 */
function error(error) {
  if (
    error.name == undefined ||
    error.message == undefined ||
    error.stack == undefined
  ) {
    console.error(`${chalk.red("ERROR")}: `, `${error}`);
  } else {
    const { name, message, stack } = error;
    console.error(
      `${chalk.red("ERROR")}: `,
      `${name}:| ${message} \n ${stack}`
    );
  }
}
/**
 * Indica que una operacion se ejecuto satisfactoriamente.
 *  @param {string} title El titulo de la operacion.
 */
function success(
  name,
  { message, verbose } = { message: "no message", verbose: false }
) {
  if (verbose) {
    log(`${chalk.bgGreen("Success: ")}${name} - ${message}`);
  }
}
/**
 * Indica una advertencia, sobre algo que puede causar un error, o que podria ser mas optimo.
 *
 * Para indicar un {@link error}
 * @param {*} title El titulo de la advertencia.
 * @param {*} description La descripcion de la advertencia.
 * @returns {void}
 */
function warning(
  title,
  { description, verbose } = { description: "no description", verbose: false }
) {
  if (verbose) {
    return log(
      `${chalk.yellow("WARNING")}: ${chalk.yellow.underline(title)}\n`,
      description
    );
  }
}
/**
 * Muestra los valores que se usan en una funcion.
 * @param {*} values Valores de una funcion
 * @returns {void}
 */
function values(values, { verbose } = { verbose: false }) {
  //TODO: tal vez implemntar console.table.
  if (verbose) {
    return log(`${chalk.green("Values")}:\n`, values);
  }
}
/**
 * Indica la finalisacion de un proceso o una funcion.
 * @param {*} title El titulo de la funcion.
 * @param {*} mensaje El mensaje final.
 * @returns
 */
function done(
  title,
  { mensaje, verbose } = { mensaje: "Done", verbose: false }
) {
  if (verbose) {
    return log(`${title}: ${chalk.blue(mensaje)}`);
  }
}
cliconsole.start = start;
cliconsole.name = name;
cliconsole.info = info;
cliconsole.data = data;
cliconsole.error = error;
cliconsole.success = success;
cliconsole.warning = warning;
cliconsole.values = values;
cliconsole.done = done;
