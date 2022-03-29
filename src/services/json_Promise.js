/**
 * Modulo con promesas para controlar las funciones relacionadas con los archivos json.
 * @module services/env
 */ //
import cliconsole from "@core_/cli-console";
import { json_Sync } from "./json_Sync";
import { readFileSync, writeFileSync } from "fs";
//TODO: remplazar readFile y writeFile por sus verciones asyncronas.
//TODO: crear una funcion que inicie un arcivo json, osea que le coloque los {} iniciales. o []
/* TODO: propiedades y valores
 Proceso de modificacion de propiedades y valores
 Para modificar las propiedades
 * replaceProperty +
 Remplazara la propiedad ya existente, si no existe lanzara un error. +
 * deleteProperty
 Eliminara una propiedad existente, si no existe lanzara un error. Se puede usar el operador delete.
 * createProperty 
 Creara una nueva propiedad, si existe lanzara un error.
 * addValueProperty
 Anade un valor al valor de una propiedad ya existente, si no existe la propiedad se lanzara un error.
 * putValueProperty +
 Anade valores a una propiedad, remplazando el valor anterior, pero respetndo el tipo de propiedad, si es string no le puede meter un object, etc. +
*/
/**
 *
 * @param {*} param0
 * @returns Retorna true si se logro crear la propiedad.
 */
function createProperty(
  file,
  data,
  properties,
  value,
  { verbose = false } = {}
) {
  return new Promise((resolve) => {
    const name = createProperty.name;
    cliconsole.process_start({ name, verbose });
    //TODO: verficar si existe la propiedad anteriormente, en caso de que existar lanzar un error.
    // PROCESS
    let data_ = json_Sync.createPropertyData(data, properties, value, {
      verbose,
    });
    const complete = JSON.stringify(data_, null, 2);
    writeFileSync(file, complete);
    cliconsole.data({
      name,
      message: `Propiedad creada: ${value}`,
      verbose,
    });
    cliconsole.process_done({ name, verbose, status: true });
    resolve(true);
  });
}
/**
 *   Remplazara la propiedad ya existente, si no existe lanzara un error.
 */
function replaceProperty(
  file,
  data,
  properties,
  value,
  { verbose = false } = {}
) {
  //TODO: crear una vercion open de esta funcion.
  const name = replaceProperty.name;
  cliconsole.process_start({ name, verbose });
  // CONDICIONES
  return new Promise((resolve) => {
    let data_ = json_Sync.replacePropertyData(data, properties, value, {
      verbose,
    });
    const complete = JSON.stringify(data_, null, 2);
    writeFileSync(file, complete);
    cliconsole.data({
      name,
      message: `Objeto remplazado: ${value}`,
      verbose,
    });
    cliconsole.process_done({ name, verbose, status: true });
    resolve(true);
  });
}
/**
 * Lee un archivo json.
 * @param {{{
    file:string
 * }}
 * @param file El archivo json a leer.
 * @returns Retorna el contenido del archivo json como string.
 */
function readJson(file, { verbose = false, enconding = "utf-8" } = {}) {
  const name = readJson.name;
  cliconsole.process_start({ name, verbose });
  let e = new Error();
  e.name = name;
  if (file == undefined) {
    e.message = "file esta indefinido";
    throw e;
  }
  //TODO: crear un checket para que solo pueda leer .json, la viana es que indexOf() es sensibles a las mayusculas, entonces es mejor usar search() pero ese usa expreciones regulares. se puede crear una funcion llamada checkIfJson()
  if (typeof file !== "string") {
    e.message = `file nada mas puede ser string, file es ${typeof file}`;
    throw e;
  }
  return new Promise((resolve) => {
    const read = readFileSync(file, enconding);
    cliconsole.process_done({ name, verbose, status: true });
    resolve(read);
  });
}
/**
 * Lee un archivo json.
 * @param {{{
    file:string
 * }}
 * @param file El archivo json a leer.
 * @returns {object} Retorna el contenido del archivo json como un objeto.
 */
function readJsonObject(file, { verbose = false, enconding = "utf-8" } = {}) {
  const name = readJsonObject.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({ name, verbose });
  if (file == undefined) {
    e.message = "file esta indefinido";
    throw e;
  }
  if (typeof file !== "string") {
    e.message = `file nada mas puede ser string, file es ${typeof file}`;
    throw e;
  }
  return new Promise((resolve, reject) => {
    const read = readFileSync(file, enconding);
    if (!read) {
      e.message = "El archivo json esta vacio";
      return reject(e);
    }
    let data = JSON.parse(read);
    cliconsole.process_done({ name, verbose, status: true });
    resolve(data);
  });
}
/**
 * Inyecta valores a una propiedad ya existente, esta propiedad puede de cualquier tipo.
 *
 * Los valores tambien pueden ser de cualquier tipo.
 * debug - Para activar el modo debug
 * @param value El valor que va a tener la propiedad, puede ser cualquier valor que acepte un json.
 * @param file El archivo json que quieres modificar.
 * @param properties Una string con la ruta hacia la propiedad que quieres modificar.
 * @return {Promise <boolean|void>} `true` si se pudo modificar el archivo json.
 * @example ```
 * putValuePropertyOpen({Debug: true, value: {"propiedad_a": "valor","propiedad_b": "valor"},properties: "prop.masProps.estaProp"});
 * ```
 */
function putValuePropertyOpen(
  file,
  value,
  properties,
  { verbose = false } = {}
) {
  const name = putValuePropertyOpen.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({ name, verbose });
  if (value == undefined) {
    e.message = "value esta indefinido";
    throw e;
  }
  if (file == undefined) {
    e.message = "file esta indefinido";
    throw e;
  }
  if (properties == undefined) {
    e.message = "properties esta indefinido";
    throw e;
  }
  return new Promise((resolve) => {
    resolve(readJsonObject(file, { verbose }));
  })
    .then((data) => {
      const checkProps = json_Sync.checkProperty(data, properties, { verbose });
      const checkType = json_Sync.checkPropertyType(data, properties, {
        verbose,
      });
      if (checkProps == false) {
        e.message = `La propiedad ${properties} no existe`;
        throw e;
      }
      if (
        (checkType == "string" ||
          checkType == "number" ||
          checkType == "boolean" ||
          properties == null) &&
        typeof value === "object"
      ) {
        e.message = `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`;
        throw e;
      }
      if (
        checkType == "object" &&
        (typeof value == "string" ||
          typeof value == "number" ||
          typeof value == "boolean" ||
          value == null)
      ) {
        e.message = `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`;
        throw e;
      }
      // PROCESS
      const data_ = json_Sync.putValueData(data, properties, value, {
        verbose,
      });
      const complete = JSON.stringify(data_, null, 2);
      writeFileSync(file, complete);
      cliconsole.data({
        name,
        message: `Objetos crados ${value}`,
        verbose,
      });
      cliconsole.process_done({ name, verbose, status: true });
      return true;
    })
    .catch((error) => {
      cliconsole.process_done({ name, verbose, status: false });
      cliconsole.error({ error });
      return error;
    });
}
/**
 * Inyecta valores a una propiedad ya existente, esta propiedad puede de cualquier tipo.
 *
 * Los valores tambien pueden ser de cualquier tipo.
 * debug - Para activar el modo debug
 * @param value El valor que va a tener la propiedad, puede ser cualquier valor que acepte un json.
 * @param file El archivo json que quieres modificar.
 * @param properties Una string con la ruta hacia la propiedad que quieres modificar.
 * @return {Promise <boolean|void>} `true` si se pudo modificar el archivo json.
 * @example ```
 * putValueProperty({Debug: true, value: {"propiedad_a": "valor","propiedad_b": "valor"},properties: "prop.masProps.estaProp"});
 * ```
 */
function putValueProperty(
  file,
  value,
  data,
  properties,
  { verbose = false } = {}
) {
  //TODO: crear una vercion de esta funcion open addValueOpen
  const name = putValueProperty.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({ name, verbose });
  if (value == undefined) {
    e.message = "value esta indefinido";
    throw e;
  }
  if (data == undefined) {
    e.message = "data esta indefinido";
    throw e;
  }
  if (properties == undefined) {
    e.message = "properties esta indefinido";
    throw e;
  }
  if (file == undefined) {
    e.message = "file esta indefinido";
    throw e;
  }
  return new Promise((resolve, reject) => {
    const checkProps = json_Sync.checkProperty(data, properties, { verbose });
    const checkType = json_Sync.checkPropertyType(data, properties, {
      verbose,
    });
    if (typeof file !== "string") {
      e.message = `file solo puede ser string, file es ${typeof file}`;
      reject(e);
    }
    if (checkProps == false) {
      e.message = `La propiedad ${properties} no existe`;
      reject(e);
    }
    if (
      (checkType == "string" ||
        checkType == "number" ||
        checkType == "boolean" ||
        properties == null) &&
      typeof value === "object"
    ) {
      e.message = `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`;
      reject(e);
    }

    if (
      checkType == "object" &&
      (typeof value == "string" ||
        typeof value == "number" ||
        typeof value == "boolean" ||
        value == null)
    ) {
      e.message = `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`;
      reject(e);
    }
    // PROCESS
    const data_ = json_Sync.putValueData(data, properties, value, { verbose });
    const complete = JSON.stringify(data_, null, 2);
    writeFileSync(file, complete);
    cliconsole.data({ name, message: `Objetos crados: ${value}`, verbose });
    cliconsole.process_done({ name, verbose, status: true });
    resolve(true);
  });
}
/**
 * Verificara si existe una propiedad en el jason.
 *
 * Puede ser una propiedad que este dentro de otra propiedad.
 * @param {*} file
 * @param {*} properties
 * @param {*} innerProps
 * @return {Promise <boolean>} `true` si existe la propiedad.
 * @example `checkProperty('./archivo.json','vaso');` verifica si existe `vaso` o `checkProperty('./archivo.json','vaso.color');` verifica si existe `color` ola
 */
function checkProperty(data, properties, { verbose = false } = {}) {
  const name = checkProperty.name;
  cliconsole.process_start({ name, verbose });
  return new Promise((resolve) => {
    // PROCESS
    if (json_Sync.checkProperty(data, properties, { verbose })) {
      cliconsole.data({
        name,
        message: `Existen las propiedades ${properties}`,
        verbose,
      });
      cliconsole.process_done({ name, verbose, status: true });
      resolve(true);
    } else {
      cliconsole.warning({
        name,
        message: `No existe la propiedad ${properties}`,
        verbose,
      });
      cliconsole.process_done({ name, verbose, status: false });
      resolve(false);
    }
  });
}
/**
 * Verificara si existe una propiedad en el jason.
 *
 * Puede ser una propiedad que este dentro de otra propiedad.
 * @param {*} file
 * @param {*} properties
 * @param {*} innerProps
 * @example `checkProperty('./archivo.json','vaso');` verifica si existe `vaso` o `checkProperty('./archivo.json','vaso.color');` verifica si existe `color` ola
 */
function checkPropertyOpen(file, properties, { verbose = false } = {}) {
  //TODO: actualizar. ver checkProperty sync.
  const name = checkPropertyOpen.name;
  cliconsole.process_start({ name, verbose });
  return new Promise((resolve) => {
    const data = readFileSync(file, "utf-8");
    resolve(data);
  })
    .then((read) => {
      const data = JSON.parse(read);
      if (json_Sync.checkProperty(data, properties, { verbose })) {
        cliconsole.data({
          name,
          message: `Existen las propiedades ${properties}`,
          verbose,
        });
        cliconsole.process_done({ name, verbose, status: true });
        return true;
      } else {
        cliconsole.warning({
          name,
          message: `No existe la propiedad ${properties}`,
          verbose,
        });
        cliconsole.process_done({ name, verbose, status: false });
        return false;
      }
    })
    .catch((error) => {
      cliconsole.process_done({ name, verbose, status: false });
      cliconsole.error({ error });
      return error;
    });
}
/**
 * Verifica si existe el archivo json.
* @param {{
    debug: boolean
    Package: string
 * }}
* debug - Para activar el modo debug.
* @param Package - La ruta del package.json que se esta editando.
 */
//TODO: falta por terminar.
function checkJson(file, { verbose } = { verbose: false }) {
  const name = checkJson.name;
  cliconsole.process_start({ name, verbose });
}
/**
 * Verifica un grupo de propiedades dentro de un json.
 * 
 * ! en construccion, todabia no verifica muchas propiedades.
 * @param {{
    Debug: boolean
    file: string
    properties: Array<string>|string
 * }}
 * debug - Para activar el modo debug.
 * @param File El archivo json.
 * @param properties La propiedad/es que se estan verificando. Puede ser una string o un array de strings.
 * @return {Promise<boolean>} Retorna `true` si existe la propiedad/es y `false` en caso de que no.
 */
function checkProperties({ verbose }) {
  const name = checkProperties.name;
  cliconsole.process_start({ name, verbose });
}
//TODO: crer una funcion que anadir el primer {} a un archivo json vacio.
//TODO: crear una funcion que verifique si existen propiedades internas con un switch.
let json_Promise = {};
json_Promise.checkProperty = checkProperty;
json_Promise.checkPropertyOpen = checkPropertyOpen;
json_Promise.checkJson = checkJson;
json_Promise.createProperty = createProperty;
json_Promise.replaceProperty = replaceProperty;
json_Promise.readJson = readJson;
json_Promise.readJsonObject = readJsonObject;
json_Promise.putValueProperty = putValueProperty;
json_Promise.putValuePropertyOpen = putValuePropertyOpen;
json_Promise.checkProperties = checkProperties;
export default json_Promise;
