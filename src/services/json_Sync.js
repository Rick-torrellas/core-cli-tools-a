/**
 * Modulo con funciones syncronas para controlar las funciones relacionadas con los archivos json.
 * @module services/env
 */
const debug = require("./debug");
const { writeFile, readFileSync } = require("fs");
/**
 * Crea una nueva propiedad a la data, y se asigna un valor.
 * @return {object} Retorna la data modificaada
 */
function createPropertyData({ data, properties, value }) {
  if (checkProperty({ data, properties }))
    throw new Error(`Ya existe la propiedad: ${properties}`);
  // PROCESS
  const props = properties.split(".");
  console.log(props.length);
  if (props.length == 1) {
    data[props[0]] = value;
    console.log(data);
  } else {
    let last = props.pop();
    let noLast = props.join(".");
    let add = eval(`data.${noLast}`);
    add[last] = value;
    data;
  }
  return data;
}
/**
 * Remplazara la propiedad ya existente, si no existe lanzara un error.
 */
function replacePropertyData({ data, properties, value }) {
  //TODO: crear una vercion open de esta funcion
  if (data == undefined) throw new Error("data esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  if (value == undefined) throw new Error("value esta indefinido");
  const checkProps = checkProperty(data, properties);
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  )
    throw new Error(
      `data nada mas puede ser un objeto, data es: ${typeof data}`
    );
  if (!isNaN(properties) || typeof properties !== "string")
    throw new Error(
      `properties nada mas puede ser una string, properties es: ${typeof properties}`
    );
  if (!checkProps) throw new Error(`No existe la propiedad ${properties}`);
  // PROCESS
  const props = properties.split(".");
  console.log(props.length);
  if (props.length == 1) {
    data[props[0]] = value;
    console.log(data);
  } else {
    let last = props.pop();
    let noLast = props.join(".");
    let add = eval(`data.${noLast}`);
    add[last] = value;
    data;
  }
  return data;
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
//TODO: falta por terminar.
function verifyPackage({ Debug, Package }) {
  const NAME_ = "verifyNucleo";
  debug.name(Debug, NAME_, "sub-service");
  const arg = {
    Package,
  };
  debug.values(Debug,arg);
}
/**
 * Inyectara los scripts, al package.json.
 * 
 * ? esta funcion podria resultilizarse, si se enfoca en agregar cualquier tipo de porpiedades a un objeto, puede pertenencer al serivicio json_, y e podria llamar addProperties
 * @param {{
    debug: boolean
    data: any
    scripts: string[]
    Package: string
 * }}
 * debug - Para activar el modo debug
* @param scripts - Los scripts para ser inyectados en el package.json
 * @param data - Contiene el package.json abierto y parseado.
 * @param Package - La ruta del package.json que se editara.
 * @return {void}
 */
function addObjects({ Debug, data, scripts, Package }) {
  const NAME_ = "addObjects";
  debug.name(Debug, NAME_, "service");
  const object = scripts;
  for (const key in object) {
    if (object.hasOwnProperty.call(object, key)) {
      const values = object[key];
      data.scripts[key] = values;
    }
  }
  const complete = JSON.stringify(data, null, 2);
  writeFile(Package, complete, (err) => {
    if (err) {
      error("Error al modificar el package.json");
      throw err;
    }
    console.log("package.json modificado!");
  });
  debug.done(Debug, NAME_);
}
/**
 * Verificara si existe una porpiedad en un archivo json.
 *
 * Nota: tienes que pasarle el archivo ya abierto.
 * @param {{object } data}- El archivo json ya abierto.
 * @param {{string}} properties La propiedad o la ruta hacia la propiedad.
 * @returns {boolean} Retorna `true` si existe la propiedad, `false` si no existe.
 * @example `checkProperty(data,'valor')` verifica si existe `valor` o   `checkProperty(data,'valora.valorb.valorc')` verifica si existe `valorc`
 */
function checkProperty({ data, properties }) {
  if (data === undefined) throw new Error("data esta indefinido");
  if (properties === undefined) throw new Error("properties esta indefinido");
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  )
    throw new Error(
      `data nada mas puede ser un objeto, data es: ${typeof data}`
    );
  if (!isNaN(properties) || typeof properties !== "string")
    throw new Error(
      `properties nada mas puede ser una string, properties es: ${typeof properties}`
    );
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  if (properties.indexOf(".") == -1) {
    if (data[properties] !== undefined && data.hasOwnProperty(properties)) {
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
      if (condition_a !== undefined && condition_b.hasOwnProperty(lastProp)) {
        return true;
      } else {
        return false;
      }
    } else {
      let noLast = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${noLast}`);
      if (condition_a !== undefined && condition_b.hasOwnProperty(lastProp)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
/**
 * Verificara si existe una porpiedad en un archivo json.
 * @param {{object } file}- El archivo json.
 * @param {{string}} properties La propiedad o la ruta hacia la propiedad.
 * @returns {boolean} Retorna `true` si existe la propiedad, `false` si no existe.
 * @example `checkProperty('./archivo.json','valor')` verifica si existe `valor` o   `checkProperty('./archivo.json','valora.valorb.valorc')` verifica si existe `valorc`
 */
function checkPropertyOpen({ file, properties }) {
  if (file === undefined) throw new Error("file esta indefinido");
  if (properties === undefined) throw new Error("properties esta indefinido");
  if (typeof file !== "string")
    throw new Error(
      `file nada mas puede ser una string, file es: ${typeof file}`
    );
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);
  if (!isNaN(properties) || typeof properties !== "string")
    throw new Error(
      `properties nada mas puede ser una string, properties es: ${typeof properties}`
    );
  if (!read) throw new Error(`El archivo json esta vacio`);
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  if (properties.indexOf(".") == -1) {
    if (data[properties] !== undefined && data.hasOwnProperty(properties)) {
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
      if (condition_a !== undefined && condition_b.hasOwnProperty(lastProp)) {
        return true;
      } else {
        return false;
      }
    } else {
      let noLast = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${noLast}`);
      if (condition_a !== undefined && condition_b.hasOwnProperty(lastProp)) {
        return true;
      } else {
        return false;
      }
    }
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
function checkPropertyType({ data, properties }) {
  //TODO: sacar una vercion de esta propiedad, pero para todas las propiedades.
  if (data === undefined) throw new Error("data esta indefinido");
  if (properties === undefined) throw new Error("properties esta indefinido");
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  )
    throw new Error(
      `data nada mas puede ser un objeto, data es: ${typeof data}`
    );
  if (!isNaN(properties) || typeof properties !== "string")
    throw new Error(
      `properties nada mas puede ser una string, properties es: ${typeof properties}`
    );
  if (!checkProperty({ data, properties }))
    throw new Error(`La propiedad ${properties} es indefinida`);
  //TODO: hacer la verificacion a las propiedades del json. pero para que sea mucho mas eficiente es mejor que verifique todas las propiedades, para ver cual o cuales son indefinidos. :D
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  let resultado = eval(`data.${properties}`);
  return typeof resultado;
}
function checkPropertyTypeOpen({ file, properties }) {
  if (file === undefined) throw new Error("file esta indefinido");
  if (properties === undefined) throw new Error("properties esta indefinido");
  if (typeof file !== "string")
    throw new Error(`file nada mas puede ser string, file es: ${typeof file}`);
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);
  if (!read) throw new Error(`El archivo json esta vacio`);
  if (!isNaN(properties) || typeof properties !== "string")
    throw new Error(
      `properties nada mas puede ser una string, properties es: ${typeof properties}`
    );
  if (!checkProperty({ data, properties }))
    throw new Error(`La propiedad ${properties} es indefinida`);
  //TODO: hacer la verificacion a las propiedades del json. pero para que sea mucho mas eficiente es mejor que verifique todas las propiedades, para ver cual o cuales son indefinidos. :D
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  let resultado = eval(`data.${properties}`);
  return typeof resultado;
}
function replacePropertyData() {
  /*
   *
   */
}
/**
 * Agrega valores a un objeto json.
 * @param {{
    data: object
    properties: string
    value: any
 * }} 
 * data: Un objeto json para agregar los valores
 * @param properties: La ruta hacia la propiedad a modificar.
 * @param value: El valor a agregar a la propiedad, puede ser cualquier valor, incluso un objeto
 * @returns Retorna la data modificada.
 * @example ```
 * putValueData(data,'valor_a.valor_b.valor_c','Epa'); o 
 * putValueData(data,'valor_a','Epa');
 * ```
 */
function putValueData({ data, properties, value }) {
  if (data == undefined) throw new Error("data esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  if (value == undefined) throw new Error("value esta indefinido");
  const checkProps = checkProperty({data, properties});
  const checkType = checkPropertyType({data, properties});
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  )
    throw new Error(
      `data nada mas puede ser un objeto, data es: ${typeof data}`
    );
  if (!isNaN(properties) || typeof properties !== "string")
    throw new Error(
      `properties nada mas puede ser una string, properties es: ${typeof properties}`
    );
  if (!checkProps) throw new Error(`No existe la propiedad ${properties}`);
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
  return data;
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
function putValueDataOpen({ file, properties, value }) {
  if (file == undefined) throw new Error("file esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  if (value == undefined) throw new Error("value esta indefinido");
  if (typeof file !== "string") throw new Error(`file solo puede ser string`);
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);
  if (!read) throw new Error(`El archivo json esta vacio`);
  const checkProps = !checkProperty(data, properties);
  const checkType = checkPropertyType(data, properties);
  if (
    typeof data !== "object" ||
    data === null ||
    typeof data == "function" ||
    Array.isArray(data)
  )
    throw new Error(
      `data nada mas puede ser un objeto, data es: ${typeof data}`
    );
  if (!isNaN(properties) || typeof properties !== "string")
    throw new Error(
      `properties nada mas puede ser una string, properties es: ${typeof properties}`
    );
  if (checkProps) throw new Error(`No existe la propiedad ${properties}`);
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
  return data;
}
module.exports = {
  checkProperty,
  checkPropertyOpen,
  checkPropertyType,
  checkPropertyTypeOpen,
  putValueData,
  putValueDataOpen,
  replacePropertyData,
  createPropertyData,
};
