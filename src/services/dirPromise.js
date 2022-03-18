const {mkdirSync,rmSync,existsSync} = require("fs");
const {execSync} = require("child_process");
const debug = require('./debug');
//TODO: se puede crear una funcion replaceDir, y ejecutar createDir({dir},{Debug,overwrite=true,recursive=true})
function checkDir({dir},{Debug}={Debug:false}) {
//TODO: crear una vercion de esta funcion que verifique el contenido de la carpeta checkDirContent()
    const name = "checkDir";
    debug.name(Debug, name);
    return new Promise(resolve=>{
      resolve(existsSync(dir))
    })
}
/**
 * 
 * @param {string} attr Es el atributo que se asignara a la carpeta, estos pueden ser `h`: Hidden,`r`: Read-only,`s`: System,`a`: Archive,`t`: Temporary,`c`: Compressed,`o`: Offline,`i`: Not indexed,`e`: Encrypted,`x`: No Scrub,`u`: UnPinned,`p`: Pinned,`m`: Recall on Data Access 
 * @returns 
 */
function editAtribute({attr,dir,state},{Debug}={Debug:false}) {
  const name = "editAtribute";
  debug.name(Debug, name);
  return new Promise((resolve)=>{
      resolve(checkDir({dir},{Debug}));
  })
  .then(res => {
    if(res) {
      const command = `attrib ${state}${attr} "${dir}"`; 
      if (!(attr == "h" || attr == "r" || attr == "s" || attr == "a" || attr == "t" || attr == "c" || attr == "o" || attr == "i" || attr == "e" || attr == "x" || attr == "u" || attr == "p" || attr == "m") ) throw new Error(`El atributo: ${attr} no es valido, mirar los atributos validos.`);
      if (!(state == "-" || state == "+")) throw new Error(`El estado: ${state} no es valido, mirar los estados validos.`);
      const result = execSync(command);
      console.log(command);
      console.log(result.toString());
      return(true);
    } else {
      throw new Error(`No existe el directorio: ${dir}`);
    }
  })
  .catch(err => {
    debug.error(err);
    debug.error(err.lineNumer);
  });
}
/** @param {{
  content: Array<string>, 
 *}}
 * content: Un array con las rutas de las carpetas que se quieren crear. La carpeta contenedora no tiene que existir anteriormente.
 */
async function addContent({content},{Debug}={Debug:false}) {
  try {
    const NAME_ = "addContent";
  debug.name(Debug, NAME_);
  const arg = {
    content,
  };
  debug.values(Debug, arg);
  for (const key in content) {
    if (Object.hasOwnProperty.call(content, key)) {
      const element = content[key];
      if (await checkDir({dir: element},{Debug}) == false) {
       await createDir({dir: element},{Debug,recursive: true});
      } else {
        console.log(`${element}:' Ya esta creado'`);
      }
    }
  }
  debug.done(Debug, NAME_);
  return true;
  } catch (error) {
    debug.error(error);
    debug.error(error.lineNumer);
  }
}
/**
 * Crea una carpeta 
 * @returns True si logro crearla.
 */
function createDir({dir},{Debug,overwrite,recursive}={Debug:false,overwrite:false,recursive:false}) {
//TODO: crear una vercion de esta funcion que verifique el contenido de la carpeta checkDirContent()
//TODO: eliminar el overwrite y mas bien crear una funcion especial para remplazar una carpeta, usando el mismo proceso del overwrite, replaceDir.   
  const name = "createDir";
    debug.name(Debug, name);
    return new Promise(resolve=>{ 
      resolve(existsSync(dir))
    })
    .then(res => {
      if(res) {
          debug.warning(Debug, `La carpeta: ${dir} ya existe`);
          if(overwrite) {
          debug.warning(Debug, `Se va a sobreescribir la carpeta: ${dir}`);  
          rmSync(dir,{recursive: true,force: true});
        } else {
            debug.done(Debug, name);
          throw new Error(`La carpeta: ${dir} ya existe`);
        }
      }
      mkdirSync(dir, {recursive: recursive});
      debug.info(`Carpeta: ${dir} creada`);
      debug.done(Debug, name);
      return true;
    })
    .catch(err => {
      console.log(err);
      console.log(err.lineNumer);
    })
}
module.exports = {
    createDir,
    editAtribute,
    addContent,
    checkDir
}