/**
 * Modulo con promesas para controlar las funciones relacionadas con los archivos json.
 * @module services/env
 */ //
import { cliconsole } from "./cliconsole";
import { json_Sync } from "./json_Sync";
import {readFile,writeFile} from "fs";
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
function createProperty({Debug,data,properties,value,file}) {
 return new Promise((resolve,reject)=>{
const name = "createProperty";
// PROCESS
      let data_ = json_Sync.createPropertyData({properties,data,value})
      const complete = JSON.stringify(data_, null, 2);
      writeFile(file, complete, (err) => {
        if (err) {
          cliconsole.done(Debug, name);
          return reject(err);
        }
        cliconsole.data(Debug, "Propiedad creada", value);
        cliconsole.done(Debug, name);
        resolve(true);
    })
 })
}
/**
 *   Remplazara la propiedad ya existente, si no existe lanzara un error.
 */
function replaceProperty({ Debug = false, data, properties, value,file }) {
//TODO: crear una vercion open de esta funcion.  
const NAME_ = "readJson";
cliconsole.name(Debug,NAME_, "service");
// CONDICIONES
return new Promise((resolve, reject) => {
  let data_ = json_Sync.replacePropertyData(data, properties,value);
  const complete = JSON.stringify(data_, null, 2);
  writeFile(file, complete, (err) => {
    if (err) {
      cliconsole.done(Debug, NAME_);
      return reject(err);
    }
    cliconsole.data(Debug, "Objeto remplazado", value);
    cliconsole.done(Debug, NAME_);
    resolve(true);
})
})
}
/**
 * Lee un archivo json.
 * @param {{{
    file:string
 * }}
 * @param file El archivo json a leer.
 * @returns Retorna el contenido del archivo json como string.
 */
function readJson({ Debug = false, file }) {
  const NAME_ = "readJson";
  cliconsole.name(Debug,NAME_, "service");
  if (file == undefined) throw new Error("file esta indefinido");
  //TODO: crear un checket para que solo pueda leer .json, la viana es que indexOf() es sensibles a las mayusculas, entonces es mejor usar search() pero ese usa expreciones regulares.
  //TODO: implementar esta funcion en todas las funciones que requieran readFile.
  if (typeof file !== "string")
    throw new Error(`file nada mas puede ser string, file es ${typeof file}`);
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, read) => {
      if (err) return reject(err);
      if (!read) cliconsole.warning("El archivo json esta vacio");
      resolve(read);
    });
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
function readJsonObject({ Debug = false, file }) {
  const NAME_ = "readJson";
  cliconsole.name(Debug,NAME_, "service");
  if (file == undefined) throw new Error("file esta indefinido");
  if (typeof file !== "string")
    throw new Error(`file nada mas puede ser string, file es ${typeof file}`);
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, read) => {
      if (err) return reject(err);
      if (!read) return reject("El arhivo json esta vacio");
      let data = JSON.parse(read);
      resolve(data);
    });
  });
}
/**
 * Inyecta valores a una propiedad ya existente, esta propiedad puede de cualquier tipo.
 * 
 * Los valores tambien pueden ser de cualquier tipo.
 * @param {{
    Debug: boolean
    value: any
    file: string
    properties: string
 * }}
 * debug - Para activar el modo debug
* @param value El valor que va a tener la propiedad, puede ser cualquier valor que acepte un json.
 * @param file El archivo json que quieres modificar.
 * @param properties Una string con la ruta hacia la propiedad que quieres modificar.
 * @return {Promise <boolean|void>} `true` si se pudo modificar el archivo json.
 * @example ```
 * putValuePropertyOpen({Debug: true, value: {"propiedad_a": "valor","propiedad_b": "valor"},properties: "prop.masProps.estaProp"});
 * ``` 
 */
function putValuePropertyOpen({ Debug = false, value, file, properties }) {
  const NAME_ = "putValuePropertyOpen";
  cliconsole.name(Debug, NAME_, "service");
  if (value == undefined) throw new Error("value esta indefinido");
  if (file == undefined) throw new Error("file esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  return new Promise((resolve) => {
    resolve(readJsonObject({ Debug, file }));
  })
    .then((data) => {
      const checkProps = json_Sync.checkProperty({
        data,
        properties,
      });
      const checkType = json_Sync.checkPropertyType({
        data,
        properties,
      });
      if (checkProps == false)
        throw new Error(`No existe la propiedad ${properties}`);
      if (
        (checkType == "string" ||
          checkType == "number" ||
          checkType == "boolean" ||
          properties == null) &&
        typeof value === "object"
      )
        throw new Error(
          `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
        );
      if (
        checkType == "object" &&
        (typeof value == "string" ||
          typeof value == "number" ||
          typeof value == "boolean" ||
          value == null)
      )
        throw new Error(
          `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
        );
      const data_ = json_Sync.putValueData({
        data,
        properties,
        value,
      });
      const complete = JSON.stringify(data_, null, 2);
      writeFile(file, complete, (err) => {
        if (err) {
          cliconsole.done(Debug, NAME_);
          throw err;
        }
        console.data("Objetos crados", value);
        cliconsole.done(Debug, NAME_);
        return;
      });
      return true;
    })
    .catch((err) => {
      cliconsole.error(err);
    });
}
/**
 * Inyecta valores a una propiedad ya existente, esta propiedad puede de cualquier tipo.
 * 
 * Los valores tambien pueden ser de cualquier tipo.
 * @param {{
    Debug: boolean
    value: any
    file: string
    properties: string
 * }}
 * debug - Para activar el modo debug
* @param value El valor que va a tener la propiedad, puede ser cualquier valor que acepte un json.
 * @param file El archivo json que quieres modificar.
 * @param properties Una string con la ruta hacia la propiedad que quieres modificar.
 * @return {Promise <boolean|void>} `true` si se pudo modificar el archivo json.
 * @example ```
 * putValueProperty({Debug: true, value: {"propiedad_a": "valor","propiedad_b": "valor"},properties: "prop.masProps.estaProp"});
 * ``` 
 */
function putValueProperty({ Debug = false, value, data, properties,file }) {
  //TODO: crear una vercion de esta funcion open addValueOpen
  const NAME_ = "putValueProperty";
  cliconsole.name(Debug, NAME_, "service");
  if (value == undefined) throw new Error("value esta indefinido");
  if (data == undefined) throw new Error("data esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  if (file == undefined) throw new Error("file esta indefinido");
  return new Promise((resolve, reject) => {
    const checkProps = json_Sync.checkProperty({
      data,
      properties,
    });
    const checkType = json_Sync.checkPropertyType({
      data,
      properties,
    });
    if (typeof file !== "string") throw new Error(`file solo puede ser string, file es ${typeof file}`);
    if (checkProps == false)
      return reject(`No existe la propiedad ${properties}`);
    if (
      (checkType == "string" ||
        checkType == "number" ||
        checkType == "boolean" ||
        properties == null) &&
      typeof value === "object"
    )
      return reject(
        `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
      );
    if (
      checkType == "object" &&
      (typeof value == "string" ||
        typeof value == "number" ||
        typeof value == "boolean" ||
        value == null)
    )
      return reject(
        `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
      );
    // PROCESS
    const data_ = json_Sync.putValueData({
      data,
      properties,
      value,
    });
    const complete = JSON.stringify(data_, null, 2);
    writeFile(file, complete, (err) => {
      if (err) {
        cliconsole.done(Debug, NAME_);
        return reject(err);
      }
      cliconsole.data(Debug, "Objetos crados", value);
      cliconsole.done(Debug, NAME_);
      resolve(true);
    });
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
 function checkProperty({Debug,data, properties}) {
  const NAME_ = "checkPropertyOpen";
  cliconsole.name(Debug,NAME_, "service");
  return new Promise((resolve) => {
// PROCESS
    if (json_Sync.checkProperty({data,properties})) {
      cliconsole.data(Debug, `Existen las propiedades ${properties}`);
      cliconsole.done(Debug, NAME_);
      resolve(true);
    } else {
      cliconsole.warning(Debug, `No existe la propiedad ${properties}`);
      cliconsole.done(Debug, NAME_);
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
function checkPropertyOpen({Debug,file, properties}) {
  //TODO: actualizar. ver checkProperty sync.
  const NAME_ = "checkPropertyOpen";
  cliconsole.name(Debug,NAME_, "service");
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  })
    .then((read) => {
      const data = JSON.parse(read);
      if (json_Sync.checkProperty({data,properties})) {
        cliconsole.data(Debug, `Existen las propiedades ${properties}`);
        cliconsole.done(Debug, NAME_);
        return true;
      } else {
        cliconsole.warning(Debug, `No existe la propiedad ${properties}`);
        cliconsole.done(Debug, NAME_);
        return false;
      }
    })
    .catch((err) => {
      console.error(err);
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
function checkJson({ Debug, file }) {
  const NAME_ = "verifyNucleo";
  cliconsole.name(Debug,NAME_, "sub-service");
  const arg = {
    file,
  };
  cliconsole.values(Debug,arg);
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
function checkProperties({ Debug}) {
  const NAME_ = "checkProperty";
  cliconsole.name(Debug, NAME_, "subservice");
}
//TODO: crer una funcion que anadir el primer {} a un archivo json vacio.
//TODO: crear una funcion que verifique si existen propiedades internas con un switch.
export let json_Promise = {}
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