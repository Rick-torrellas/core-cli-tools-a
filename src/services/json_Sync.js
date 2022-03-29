/**
 * Modulo con funciones syncronas para controlar las funciones relacionadas con los archivos json.
 * @module services/env
 */
// const debug = require("./debug");
import { readFileSync } from "fs";
import cliconsole from "@core_/cli-console";
/**
 * Crea una nueva propiedad a la data, y se asigna un valor.
 * @return {object} Retorna la data modificaada
 */
function createPropertyData(data, properties, value, { verbose = false} = {}) {
  const name = createPropertyData.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({name, verbose });
  if (checkProperty(data, properties,{verbose})) {
    e.message = `La propiedad ${properties} ya existe`;
  cliconsole.process_done({name, verbose, status: false });
    throw e;
  }
  // PROCESS
  const props = properties.split(".");
  if (props.length == 1) {
    data[props[0]] = value;
  } else {
    let last = props.pop();
    let noLast = props.join(".");
    let add = eval(`data.${noLast}`);
    add[last] = value;
    data;
  }
  cliconsole.process_done({name, verbose , status: true });
  return data;
}
/**
 * Remplazara la propiedad ya existente, si no existe lanzara un error.
 */
function replacePropertyData(
  data,
  properties,
  value,
  { verbose } = { verbose: false }
) {
  const name = replacePropertyData.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({name, verbose });
  //TODO: crear una vercion open de esta funcion
  if (data == undefined) {
    e.message = `data esta indefinido`;
  cliconsole.process_done({name, verbose , status: false });
    throw e;
  }
  if (properties == undefined) {
    e.message = `properties esta indefinido`;
  cliconsole.process_done({name, verbose , status: false });
    throw e;
  }
  if (value == undefined) {
    e.message = `value esta indefinido`;
  cliconsole.process_done({name, verbose , status: false });
    throw e;
  }
  replacePropertyData__({ data, properties, verbose, e ,name});
  // PROCESS
  const props = properties.split(".");
  if (props.length == 1) {
    data[props[0]] = value;
  } else {
    let last = props.pop();
    let noLast = props.join(".");
    let add = eval(`data.${noLast}`);
    add[last] = value;
    data;
  }
  cliconsole.process_done({name, verbose,status: true });
  return data;
}
function replacePropertyData__({ data, properties, verbose, e ,name}) {
  const checkProps = checkProperty(data, properties, { verbose });
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  ) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = `data nada mas puede ser un objeto, data es: ${typeof data}`;
    throw e;
  }
  if (!isNaN(properties) || typeof properties !== "string") {
  cliconsole.process_done({name, verbose , status: false });
    e.message = `properties nada mas puede ser una string, properties es: ${typeof properties}`;
    throw e;
  }
  if (!checkProps) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = `No existe la propiedad ${properties}`;
    throw e;
  }
}
/**
 * Verifica si existe el package.json
 * 
 * ? no seria mejor que esta fuere una funcion para verificar archivos en si. para un servicio aparte llamado files.
* @param {{
    debug: boolean
    Package: string
 * }}
* debug - Para activar el modo debug.
* @param Package - La ruta del package.json que se esta editando.
 */
//TODO: falta por terminar.function verifyPackage
/**
 * Verificara si existe una porpiedad en un archivo json.
 *
 * Nota: tienes que pasarle el archivo ya abierto.
 * @param {{object } data}- El archivo json ya abierto.
 * @param {{string}} properties La propiedad o la ruta hacia la propiedad.
 * @returns {boolean} Retorna `true` si existe la propiedad, `false` si no existe.
 * @example `checkProperty(data,'valor')` verifica si existe `valor` o   `checkProperty(data,'valora.valorb.valorc')` verifica si existe `valorc`
 */
function checkProperty(data, properties, { verbose = false} = {  }) {
  const name = checkProperty.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({name, verbose });
  if (data === undefined) {
    e.message = `data esta indefinido`;
  cliconsole.process_done({name, verbose , status: false });
    throw e;
  }
  if (properties === undefined) {
    e.message = "properties esta indefinido";
  cliconsole.process_done({name, verbose , status: false });
    throw e;
  }
  checkProperty__({ data, properties, e, name,verbose });
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  //TODO: para sanear un poco el codigo, se pueden crear funciones para cada proceso. y crear subprocesos, estos procesos no seran parte del json_Sync.
  if (properties.indexOf(".") == -1) {
    if (
      data[properties] !== undefined &&
      Object.prototype.hasOwnProperty.call(data, properties)
    ) {
  cliconsole.process_done({name, verbose , status: true });
      return true;
    } else {
      cliconsole.process_done({name, verbose , status: false });
      return false;
    }
  } else {
    let arrProps = properties.split(".");
    let lastProp = arrProps[arrProps.length - 1];
    arrProps.pop();
    if (lastProp.indexOf("[") !== -1) {
      let lastProp_ = lastProp.split("[");
      let lastProp_a = lastProp_[0];
      let lastProp_b = lastProp_[lastProp_.length - 1];
      lastProp_b = lastProp_b.replace("]", "");
      lastProp = lastProp_b;
      arrProps.push(lastProp_a);
      let props = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${props}`);
      if (
        condition_a !== undefined &&
        Object.prototype.hasOwnProperty.call(condition_b, lastProp)
      ) {
  cliconsole.process_done({name, verbose , status: true });
        return true;
      } else {
  cliconsole.process_done({name, verbose , status: false });
        return false;
      }
    } else {
      let noLast = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${noLast}`);
      if (
        condition_a !== undefined &&
        Object.prototype.hasOwnProperty.call(condition_b, lastProp)
      ) {
  cliconsole.process_done({name, verbose , status: true });
        return true;
      } else {
  cliconsole.process_done({name, verbose , status: false });
        return false;
      }
    }
  }
}
function checkProperty__({ data, properties, e,name, verbose }) {
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  ) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = `data nada mas puede ser un objeto, data es: ${typeof data}`;
    throw e;
  }
  if (!isNaN(properties) || typeof properties !== "string") {
    cliconsole.process_done({name, verbose , status: false });
    e.message = `properties nada mas puede ser una string, properties es: ${typeof properties}`;
    throw e;
  }
}
/**
 * Verificara si existe una porpiedad en un archivo json.
 * @param {{object } file}- El archivo json.
 * @param {{string}} properties La propiedad o la ruta hacia la propiedad.
 * @returns {boolean} Retorna `true` si existe la propiedad, `false` si no existe.
 * @example `checkProperty('./archivo.json','valor')` verifica si existe `valor` o   `checkProperty('./archivo.json','valora.valorb.valorc')` verifica si existe `valorc`
 */
function checkPropertyOpen(file, properties, { verbose = false} = { }) {
  const name = checkPropertyOpen.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({name, verbose });
  if (file === undefined) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = `file esta indefinido`;
    throw e;
  }
  if (properties === undefined) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = "properties esta indefinido";
    throw e;
  }
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);
  checkPropertyOpen__({ file, properties, read, e,verbose,name });
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  if (properties.indexOf(".") == -1) {
    if (
      data[properties] !== undefined &&
      Object.prototype.hasOwnProperty.call(data, properties)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    let arrProps = properties.split(".");
    let lastProp = arrProps[arrProps.length - 1];
    arrProps.pop();
    if (lastProp.indexOf("[") !== -1) {
      let lastProp_ = lastProp.split("[");
      let lastProp_a = lastProp_[0];
      let lastProp_b = lastProp_[lastProp_.length - 1];
      lastProp_b = lastProp_b.replace("]", "");
      lastProp = lastProp_b;
      arrProps.push(lastProp_a);
      let props = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${props}`);
      if (
        condition_a !== undefined &&
        Object.prototype.hasOwnProperty.call(condition_b, lastProp)
      ) {
        cliconsole.process_done( {name, verbose, status: true });
        return true;
      } else {
  cliconsole.process_done({name, verbose , status: false });
        return false;
      }
    } else {
      let noLast = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${noLast}`);
      if (
        condition_a !== undefined &&
        Object.prototype.hasOwnProperty.call(condition_b, lastProp)
      ) {
  cliconsole.process_done({name, verbose , status: true });
        return true;
      } else {
        cliconsole.process_done({name, verbose , status: false });
        return false;
      }
    }
  }
}
function checkPropertyOpen__({ file, properties, read, e,verbose,name }) {
  if (typeof file !== "string") {
    e.message = `file nada mas puede ser un string, file es: ${typeof file}`;
  cliconsole.process_done({name, verbose , status: false });
    throw e;
  }
  if (!isNaN(properties) || typeof properties !== "string") {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `properties nada mas puede ser una string, properties es: ${typeof properties}`;
    throw e;
  }
  if (!read) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = "El archivo json esta vacio";
    throw e;
  }
}
/**
 * Verfica el tipo de valor de la propiedad.
 *
 * Nota: debes pasarle el json ya abierto a la funcion.
 * @param {*} file - El archivo json.
 * @param {*} properties - La propiedad o propiedad para verificar su tipo.
 * @returns Regresa el tipo de propiedad a evaluar.
 * @example `checkPropertyType(data,'valor')` verifica el tipo `valor` o   `checkPropertyType(data,'valora.valorb.valorc')` verifica el tipo  `valorc`
 */
function checkPropertyType(data, properties, { verbose = false} = { }) {
  const name = checkPropertyType.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start( {name, verbose });
  //TODO: sacar una vercion de esta propiedad, pero para todas las propiedades.
  if (data === undefined) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = `data esta indefinido`;
    throw e;
  }
  if (properties === undefined) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = "properties esta indefinido";
    throw e;
  }
  checkPropertyType__({ data, properties, e,verbose,name });
  //TODO: hacer la verificacion a las propiedades del json. pero para que sea mucho mas eficiente es mejor que verifique todas las propiedades, para ver cual o cuales son indefinidos. :D
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  let resultado = eval(`data.${properties}`);
  cliconsole.process_done({name, verbose , status: true });
  return typeof resultado;
}
function checkPropertyType__({ data, properties, e,verbose,name }) {
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  ) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = `data nada mas puede ser un objeto, data es: ${typeof data}`;
    throw e;
  }
  if (!isNaN(properties) || typeof properties !== "string") {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `properties nada mas puede ser una string, properties es: ${typeof properties}`;
    throw e;
  }
  if (!checkProperty({ data, properties })) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `La propiedad ${properties} no existe en el json`;
    throw e;
  }
}
/**
 *
 */
function checkPropertyTypeOpen(
  file,
  properties,
  { verbose } = { verbose: false }
) {
  const name = checkPropertyTypeOpen.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({name, verbose });
  if (file === undefined) {
  cliconsole.process_done({name, verbose , status: false });
    e.message = `file esta indefinido`;
    throw e;
  }
  if (properties === undefined) {
    cliconsole.process_done({name, verbose , status: false });
    e.message = `properties esta indefinido`;
    throw e;
  }
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);
  checkPropertyTypeOpen__({ file, data, properties, read, e,verbose,name });
  //TODO: hacer la verificacion a las propiedades del json. pero para que sea mucho mas eficiente es mejor que verifique todas las propiedades, para ver cual o cuales son indefinidos. :D
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  let resultado = eval(`data.${properties}`);
  cliconsole.process_done({name, verbose , status: true });
  return typeof resultado;
}
function checkPropertyTypeOpen__({ file, data, properties, read, e,name,verbose }) {
  if (typeof file !== "string") {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `file nada mas puede ser un string, file es: ${typeof file}`;
    throw e;
  }
  if (!read) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `El archivo json esta vacio`;
    throw e;
  }

  if (!isNaN(properties) || typeof properties !== "string") {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `properties nada mas puede ser una string, properties es: ${typeof properties}`;
    throw e;
  }
  if (!checkProperty({ data, properties })) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `La propiedad ${properties} no existe en el json`;
    throw e;
  }
}
/**
 * Agrega valores a un objeto json.
 * @param data: Un objeto json para agregar los valores
 * @param properties: La ruta hacia la propiedad a modificar.
 * @param value: El valor a agregar a la propiedad, puede ser cualquier valor, incluso un objeto
 * @returns Retorna la data modificada.
 * @example ```
 * putValueData(data,'valor_a.valor_b.valor_c','Epa'); o 
 * putValueData(data,'valor_a','Epa');
 * ```
 */
function putValueData(
  data,
  properties,
  value,
  { verbose } = { verbose: false }
) {
  const name = putValueData.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({name, verbose });
  if (data == undefined) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `data esta indefinido`;
    throw e;
  }
  if (properties == undefined) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `properties esta indefinido`;
    throw e;
  }
  if (value == undefined) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `value esta indefinido`;
    throw e;
  }
  putValueData__({ data, properties, value, e ,name,verbose});
  if (
    typeof value == "string" ||
    typeof value == "number" ||
    typeof value == "boolean" ||
    value == null
  ) {
    const props = properties.split(".");
    if (props.length == 1) {
      data[props[0]] = value;
    } else {
      let last = props.pop();
      let noLast = props.join(".");
      let add = eval(`data.${noLast}`);
      add[last] = value;
    }
  } else {
    let add = eval(`data.${properties}`);
    for (const key in value) {
      if (value.hasOwnProperty.call(value, key)) {
        const values = value[key];
        add[key] = values;
      }
    }
  }
  cliconsole.process_done({name, verbose , status: true });
  return data;
}
function putValueData__({ data, properties, value, e,name,verbose }) {
  const checkProps = checkProperty(data, properties,{verbose});
  const checkType = checkPropertyType(data, properties,{verbose});
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  ) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `data nada mas puede ser un objeto, data es: ${typeof data}`;
    throw e;
  }
  if (!isNaN(properties) || typeof properties !== "string") {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `properties nada mas puede ser una string, properties es: ${typeof properties}`;
    throw e;
  }
  if (!checkProps) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `La propiedad ${properties} no existe en el json`;
    throw e;
  }
  if (
    (checkType == "string" ||
      checkType == "number" ||
      checkType == "boolean" ||
      properties == null) &&
    typeof value === "object"
  ) {
  cliconsole.process_done({name, verbose , status: false });
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
  cliconsole.process_done({name, verbose , status: false });
  e.message = `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`;
    throw e;
  }
}
/**
 * Agrega valores a un objeto json.
 * 
 * Nota: necesitas pasarle el archivo json para leerlo.
 * @param {{
    file: string
    properties: string
    value: any
 * }} 
 * file: Un archivo json para sacar el objeto.
 * @param properties: La ruta hacia la propiedad a modificar.
 * @param value: El valor a agregar a la propiedad, puede ser cualquier valor, incluso un objeto
 * @returns Retorna la data modificada.
 * @example ```
 * putValueDataOpen('./archivo.json','valor_a.valor_b.valor_c','Epa'); o 
 * putValueDataOpen('./archivo.json','valor_a','Epa');
 * ```
 */
function putValueDataOpen(
  file,
  properties,
  value,
  { verbose } = { }
) {
  const name = putValueDataOpen.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({name, verbose });
  if (file == undefined) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `file esta indefinido`;
    throw e;
  }
  if (properties == undefined) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `properties esta indefinido`;
    throw e;
  }
  if (value == undefined) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `value esta indefinido`;
    throw e;
  }
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);
  putValueDataOpen__({ file, data, properties, value, read, e,name,verbose });
  // PROCESS
  if (
    typeof value == "string" ||
    typeof value == "number" ||
    typeof value == "boolean" ||
    value == null
  ) {
    const props = properties.split(".");
    if (props.length == 1) {
      data[props[0]] = value;
    } else {
      let last = props.pop();
      let noLast = props.join(".");
      let add = eval(`data.${noLast}`);
      add[last] = value;
    }
  } else {
    let add = eval(`data.${properties}`);
    for (const key in value) {
      if (value.hasOwnProperty.call(value, key)) {
        const values = value[key];
        add[key] = values;
      }
    }
  }
  cliconsole.process_done({name, verbose , status: false });
  return data;
}
function putValueDataOpen__({ file, data, properties, value, read, e,name,verbose }) {
  if (typeof file !== "string") {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `file nada mas puede ser un string, file es: ${typeof file}`;
    throw e;
  }
  if (!read) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `El archivo json esta vacio`;
    throw e;
  }
  const checkProps = !checkProperty(data, properties);
  const checkType = checkPropertyType(data, properties);
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  ) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `data nada mas puede ser un objeto, data es: ${typeof data}`;
    throw e;
  }
  if (!isNaN(properties) || typeof properties !== "string") {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `properties nada mas puede ser una string, properties es: ${typeof properties}`;
    throw e;
  }
  if (checkProps) {
  cliconsole.process_done({name, verbose , status: false });
  e.message = `La propiedad ${properties} no existe en el json`;
    throw e;
  }
  if (
    (checkType == "string" ||
      checkType == "number" ||
      checkType == "boolean" ||
      properties == null) &&
    typeof value === "object"
  ) {
  cliconsole.process_done({name, verbose , status: false });
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
  cliconsole.process_done({name, verbose , status: false });
  e.message = `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`;
    throw e;
  }
}
let json_Sync = {};
json_Sync.createPropertyData = createPropertyData;
json_Sync.replacePropertyData = replacePropertyData;
json_Sync.checkProperty = checkProperty;
json_Sync.checkPropertyOpen = checkPropertyOpen;
json_Sync.checkPropertyType = checkPropertyType;
json_Sync.checkPropertyTypeOpen = checkPropertyTypeOpen;
json_Sync.putValueData = putValueData;
json_Sync.putValueDataOpen = putValueDataOpen;
export default json_Sync;