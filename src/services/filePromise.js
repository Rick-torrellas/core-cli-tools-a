const { existsSync,writeFileSync} = require("fs");
const debug = require("./debug");
//TODO: comentar mejor 🍡
/**
 * Vertifica si existe un archivo
 * @return Retorna `true` si existe, `false` si no existe
 */
function checkFile({file},{Debug}) {
    const name = "checkFile";
    debug.name(Debug, name);
    return new Promise((resolve) => {
        if (existsSync(file)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}
/**
 * Va a reamplazar el contenido de un archivo ya existente.
 * @param {{
    file: string
    content: string
 * }}
 * @param {boolean} force Creara un nuevo archivo si no existe. Y le agregara el contenido. 
 * @returns 
 */
function putContent({file,content},{Debug,force}={Debug:false,force:false}) {
//TODO: crear una vercion de esta funcion, que anada contenido al contendo ya existente del archivo, addContent usando fs.appendFile
    const name = putContent.name;
    debug.name(Debug, name);
    return new Promise((resolve,reject) => {
    //TODO: ejecutar esto como una promesa, checkfile, es una promesa no se puede ejecutar asi, mirar createFile.
    if (!checkFile({file},{Debug})) {
        if (force) {
            writeFileSync(file, content);
            debug.data(Debug, name, "Archivo creado");
            debug.done(Debug, name);
            resolve(true); 
        }
        reject(new Error(`El archivo: ${file} no existe`));
    } 
        //PROCESS
        writeFileSync(file, content);
        debug.data(Debug, name, "Archivo creado");
        debug.done(Debug, name);
        resolve(true);
    });
}
/**
 * Crea un archivo que no exista.
 * @returns Retorna true si logro crearlo. regresa un error si el achivo ya existe.
 */
function createFile({file,content},{Debug}={Debug:false}) {
    const name = createFile.name;
    debug.name(Debug, name);
    return new Promise((resolve) => {
        resolve(checkFile({file},{Debug}));
    })
    .then(res => {
        if (res) {
            throw new Error(`El archivo: ${file} ya existe`); 
        } 
        writeFileSync(file, content);
        debug.data(Debug, name, `Archivo: ${file} creado`);
        debug.done(Debug, name);
        return true; 
    })
    .catch(err => {
        debug.error(name, err);
        console.log(err.lineNumber);
        debug.done(Debug, name);
        return err;
    });
}
module.exports = {
    checkFile,
    putContent,
    createFile,
}