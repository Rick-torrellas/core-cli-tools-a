const chalk = require('chalk');
const {log} = console;
/**
 * Modulo para depurar el codigo, con una serie de logs, muestra mensajes para ayudar a visualizar donde esta el error.
 * @module services/debug
 */
/**
 * El mensaje para indicar que el modo debug esta activado.
 * @param {string} mensaje El mensaje para indicar que el modo debugger esta activado. 
 * @returns {void}
 */
function start(Debug,mensaje = 'Debug mode activated') {
    if (Debug) {
        log(`${chalk.red(mensaje)}`);
    }
}
/**
 * Sirve para dar un indentificador y dar un poco de contexto de la funcion, en el que se encuentra el debugger.
 * @param {string} name El nombre de la funcion.
 * @param {string} type La clasificacion de funcion que uno le quiera dar.
 * @returns {void}
 */
function name(Debug,name,type='no-type') {
    if (Debug) {
        log(`${chalk.bgCyan('Process Name:')} ${name} \n`,`${chalk.underline.cyan('Type')}: ${type}`);
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
function info(title,description="no description") {
        log(`${chalk.blue("Info")}: ${chalk.blue.underline(title)}\n`,description);
}
/**
 * Para dar alguna informacion. 
 * 
 * **Nota**: necesita tener el debug activado, si quieres usar una vercion que no necesite el debug activado usar {@link info}
 */
function data(Debug,title,description="no description") {
    if (Debug) {
        log(`${chalk.blue("Info")}: ${chalk.blue.underline(title)}\n`,description);
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
function error(title,error = 'no description') {
    console.error(`${chalk.red('ERROR')}: ${chalk.red.underline(title)}\n`,error);
}
/**
 * Indica que una operacion se ejecuto satisfactoriamente.
 *  @param {string} title El titulo de la operacion.
 */
function success(Debug,message='no-title') {
    if (Debug) {
        log(`${chalk.bgGreen('Success:')} ${message}`)
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
function warning(Debug,title,description='no description') {
    if (Debug) {
    return log(`${chalk.yellow('WARNING')}: ${chalk.yellow.underline(title)}\n`,description)
    }
}
/**
 * Muestra los valores que se usan en una funcion.
 * @param {*} values Valores de una funcion
 * @returns {void}
 */
function values(Debug,values) {
    if (Debug) {
        return log(`${chalk.green('Values')}:\n`, values);
    }
}
/**
 * Indica la finalisacion de un proceso o una funcion.
 * @param {*} title El titulo de la funcion.
 * @param {*} mensaje El mensaje final.
 * @returns 
 */
function done(Debug,title,mensaje = 'Done') {
    if (Debug) {
        return log(`${title}: ${chalk.blue(mensaje)}`);
    }
}
module.exports = {
    name,
    info,
    error,
    warning,
    values,
    start,
    success,
    done,
    data
}