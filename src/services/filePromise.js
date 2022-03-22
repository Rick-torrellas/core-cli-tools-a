import { existsSync, writeFileSync } from "fs";
import { cliconsole } from "./cliconsole";
//TODO: comentar mejor 🍡
/**
 * Vertifica si existe un archivo
 * @return Retorna `true` si existe, `false` si no existe
 */
function checkFile(file, { verbose } = { verbose: false }) {
  const name = checkFile.name;
  cliconsole.name(name, { verbose });
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
function putContent(
  file,
  content,
  { verbose, force } = { verbose: false, force: false }
) {
  //TODO: crear una vercion de esta funcion, que anada contenido al contendo ya existente del archivo, addContent usando fs.appendFile
  const name = putContent.name;
  cliconsole.name(name, { verbose });
  return new Promise((resolve, reject) => {
    //TODO: ejecutar esto como una promesa, checkfile, es una promesa no se puede ejecutar asi, mirar createFile.
    if (!checkFile(file, { verbose })) {
      if (force) {
        writeFileSync(file, content);
        cliconsole.data(name, { description: "Archivo creado", verbose });
        cliconsole.done(name, { verbose });
        resolve(true);
      }
      reject(new Error(`El archivo: ${file} no existe`));
    }
    //PROCESS
    writeFileSync(file, content);
    cliconsole.data(name, { description: "Archivo creado", verbose });
    cliconsole.done(name, { verbose });
    resolve(true);
  });
}
/**
 * Crea un archivo que no exista.
 * @returns Retorna true si logro crearlo. regresa un error si el achivo ya existe.
 */
function createFile(file, content, { verbose } = { verbose: false }) {
  const name = createFile.name;
  cliconsole.name(name, { verbose });
  let e = new Error();
  return new Promise((resolve) => {
    resolve(checkFile(file, { verbose }));
  })
    .then((res) => {
      if (res) {
        e.message = `El archivo: ${file} ya existe`;
        e.name = name;
        throw e;
      }
      writeFileSync(file, content);
      cliconsole.data(name, {
        description: `Archivo: ${file} creado`,
        verbose,
      });
      cliconsole.done(name, { verbose });
      return true;
    })
    .catch((err) => {
      cliconsole.done(name, { verbose });
      cliconsole.error(name, err);
      return err;
    });
}
export let filePromise = {};
filePromise.checkFile = checkFile;
filePromise.putContent = putContent;
filePromise.createFile = createFile;
