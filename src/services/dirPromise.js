import { mkdirSync, rmSync, existsSync } from "fs";
import { execSync } from "child_process";
import cliconsole from "@core_/cli-console";
//TODO: se puede crear una funcion replaceDir, y ejecutar createDir({dir},{Debug,overwrite=true,recursive=true})
function checkDir(dir, { verbose = false } = {}) {
  //TODO: crear una vercion de esta funcion que verifique el contenido de la carpeta checkDirContent()
  const name = checkDir.name;
  cliconsole.process_start({ name, verbose });
  return new Promise((resolve) => {
    cliconsole.process_done({ name, verbose, status: true });
    resolve(existsSync(dir));
  });
}
/**
 *
 * @param {string} attr Es el atributo que se asignara a la carpeta, estos pueden ser `h`: Hidden,`r`: Read-only,`s`: System,`a`: Archive,`t`: Temporary,`c`: Compressed,`o`: Offline,`i`: Not indexed,`e`: Encrypted,`x`: No Scrub,`u`: UnPinned,`p`: Pinned,`m`: Recall on Data Access
 * @returns
 */
function editAtribute(dir, attribute, state, { verbose = false } = {}) {
  const name = editAtribute.name;
  let e = new Error();
  e.name = name;
  cliconsole.process_start({ name, verbose });
  return new Promise((resolve) => {
    resolve(checkDir(dir, { verbose }));
  })
    .then((res) => {
      if (res) {
        const command = `attrib ${state}${attribute} "${dir}"`;
        if (
          !(
            attribute == "h" ||
            attribute == "r" ||
            attribute == "s" ||
            attribute == "a" ||
            attribute == "t" ||
            attribute == "c" ||
            attribute == "o" ||
            attribute == "i" ||
            attribute == "e" ||
            attribute == "x" ||
            attribute == "u" ||
            attribute == "p" ||
            attribute == "m"
          )
        ) {
          e.message(
            `El atributo: ${attribute} no es valido, mirar los atributos validos.`
          );
          throw e;
        }
        if (!(state == "-" || state == "+")) {
          e.message(
            `El estado: ${state} no es valido, mirar los estados validos.`
          );
          throw e;
        }
        const result = execSync(command);
        cliconsole.info({ message: command });
        console.log(result.toString());
        return true;
      } else {
        e.message(`La carpeta: ${dir} no existe`);
        throw e;
      }
    })
    .catch((error) => {
      cliconsole.process_done({ name, verbose, status: false });
      cliconsole.error({ error });
      return error;
    });
}
/**
 * @param {Array<string>}content: Un array con las rutas de las carpetas que se quieren crear. La carpeta contenedora no tiene que existir anteriormente.
 */
async function addContent(content, { verbose = false } = {}) {
  const name = addContent.name;
  try {
    const name = addContent.name;
    cliconsole.process_start({ name, verbose });
    const args = {
      content,
    };
    cliconsole.args({ args, verbose });
    for (const key in content) {
      if (Object.hasOwnProperty.call(content, key)) {
        const element = content[key];
        if ((await checkDir(element, { verbose })) == false) {
          await createDir(element, { verbose, recursive: true });
        } else {
          console.log(`${element}:' Ya esta creado'`);
        }
      }
    }
    cliconsole.process_done({ name, verbose, status: true });
    return true;
  } catch (error) {
    cliconsole.process_done({ name, verbose, status: false });
    cliconsole.error({ error });
    return error;
  }
}
/**
 * Crea una carpeta
 * @returns True si logro crearla.
 */
function createDir(
  dir,
  { verbose = false, overwrite = false, recursive = false } = {}
) {
  const name = createDir.name;
  cliconsole.process_start({ name, verbose });
  let e = new Error();
  e.name(name);
  //TODO: crear una vercion de esta funcion que verifique el contenido de la carpeta checkDirContent()
  //TODO: eliminar el overwrite y mas bien crear una funcion especial para remplazar una carpeta, usando el mismo proceso del overwrite, replaceDir.
  return new Promise((resolve) => {
    resolve(existsSync(dir));
  })
    .then((res) => {
      if (res) {
        cliconsole.warning({
          name,
          desciption: `La carpeta: ${dir} ya existe`,
          verbose: true,
        });
        if (overwrite) {
          cliconsole.warning({
            name,
            description: `Se va a sobreescribir la carpeta: ${dir}`,
            verbose: true,
          });
          rmSync(dir, { recursive: true, force: true });
        } else {
          e.message(`La carpeta: ${dir} ya existe`);
          throw e;
        }
      }
      mkdirSync(dir, { recursive: recursive });
      cliconsole.info({ message: `Carpeta: ${dir} creada` });
      cliconsole.process_done({ name, verbose, status: true });
      return true;
    })
    .catch((error) => {
      cliconsole.process_done({ name, verbose, status: false });
      cliconsole.error({ error });
      return error;
    });
}
export let dirPromise = {};
dirPromise.checkDir = checkDir;
dirPromise.editAtribute = editAtribute;
dirPromise.createDir = createDir;
dirPromise.addContent = addContent;
