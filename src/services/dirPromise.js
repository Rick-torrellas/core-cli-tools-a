import {mkdirSync,rmSync,existsSync} from "fs";
import {execSync}  from "child_process";
import {cliconsole} from "./cliconsole";
//TODO: se puede crear una funcion replaceDir, y ejecutar createDir({dir},{Debug,overwrite=true,recursive=true})
function checkDir({dir},{Debug}={Debug:false}) {
//TODO: crear una vercion de esta funcion que verifique el contenido de la carpeta checkDirContent()
    const name = "checkDir";
    cliconsole.name(Debug, name);
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
  cliconsole.name(Debug, name);
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
    cliconsole.error(err);
    cliconsole.error(err.lineNumer);
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
  cliconsole.name(Debug, NAME_);
  const arg = {
    content,
  };
  cliconsole.values(Debug, arg);
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
  cliconsole.done(Debug, NAME_);
  return true;
  } catch (error) {
    cliconsole.error(error);
    cliconsole.error(error.lineNumer);
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
    cliconsole.name(Debug, name);
    return new Promise(resolve=>{ 
      resolve(existsSync(dir))
    })
    .then(res => {
      if(res) {
          cliconsole.warning(Debug, `La carpeta: ${dir} ya existe`);
          if(overwrite) {
          cliconsole.warning(Debug, `Se va a sobreescribir la carpeta: ${dir}`);  
          rmSync(dir,{recursive: true,force: true});
        } else {
            cliconsole.done(Debug, name);
          throw new Error(`La carpeta: ${dir} ya existe`);
        }
      }
      mkdirSync(dir, {recursive: recursive});
      cliconsole.info(`Carpeta: ${dir} creada`);
      cliconsole.done(Debug, name);
      return true;
    })
    .catch(err => {
      console.log(err);
      console.log(err.lineNumer);
    })
}
export let dirPromise = {}
dirPromise.checkDir = checkDir;
dirPromise.editAtribute = editAtribute;
dirPromise.createDir = createDir;
dirPromise.addContent = addContent;