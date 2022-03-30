import { existsSync, writeFileSync } from "fs";
import { cliconsole } from "@core_/cli-console";
//TODO: comentar mejor 🍡
/**
 * Vertifica si existe un archivo
 * @return Retorna `true` si existe, `false` si no existe
 */
function checkFile(file, { verbose = false } = {}) {
  const name = checkFile.name;
  cliconsole.process_start({ name, verbose });
  return new Promise((resolve) => {
    if (existsSync(file)) {
      cliconsole.process_done({ name, verbose, status: true });
      resolve(true);
    } else {
      cliconsole.process_done({ name, verbose, status: false });
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
function putContent(file, content, { verbose = false, force = false } = {}) {
  //TODO: crear una vercion de esta funcion, que anada contenido al contendo ya existente del archivo, addContent usando fs.appendFile
  const name = putContent.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({ name, verbose });
  return new Promise((resolve, reject) => {
    //TODO: ejecutar esto como una promesa, checkfile, es una promesa no se puede ejecutar asi, mirar createFile.
    if (!checkFile(file, { verbose })) {
      if (force) {
        writeFileSync(file, content);
        cliconsole.data({ name, message: "Archivo creado", verbose });
        cliconsole.process_done({ name, verbose, status: true });
        resolve(true);
      }
      e.message = `El archivo: ${file} no existe`;
      cliconsole.process_done({ name, verbose, status: false });
      reject(e);
    }
    //PROCESS
    writeFileSync(file, content);
    cliconsole.data({ name, message: "Archivo creado", verbose });
    cliconsole.process_done({ name, verbose, status: true });
    resolve(true);
  });
}
/**
 * Crea un archivo que no exista.
 * @returns Retorna true si logro crearlo. regresa un error si el achivo ya existe.
 */
function createFile(file, content, { verbose = false } = {}) {
  const name = createFile.name;
  cliconsole.process_start({ name, verbose });
  let e = new Error();
  e.name = name;
  return new Promise((resolve) => {
    resolve(checkFile(file, { verbose }));
  })
    .then((res) => {
      if (res) {
        e.message = `El archivo: ${file} ya existe`;
        throw e;
      }
      writeFileSync(file, content);
      cliconsole.data({
        name,
        message: `Archivo: ${file} creado`,
        verbose,
      });
      cliconsole.process_done({ name, verbose, stauts: true });
      return true;
    })
    .catch((err) => {
      cliconsole.process_done({ name, verbose, status: false });
      cliconsole.error(name, err);
      return err;
    });
}
export let filePromise = {};
filePromise.checkFile = checkFile;
filePromise.putContent = putContent;
filePromise.createFile = createFile;
