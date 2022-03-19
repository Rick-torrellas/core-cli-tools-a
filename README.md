# @core_/cli-tools

<img src="./public/icon.png" alt="title" width="20%">

<h2 id="description">Description 📃</h2>

Un modulo, con un conjunto de herramientas para crear cli's con node.js

<h2 id="nav">Nav🏠 </h2>

* [Instalation 🔑](#instalation)
* [Docs 📚](https://rick-torrellas.github.io/core-scripts/)
* [Usage 🔰](#usage)
* [Requirements ⚠️](#requirements)
* [Environment variables 🔐](#environment-variables)
* [Dependencies 📁](#dependencies)
* [Implement with Docker 🐋](#docker)
* [Screenshots 🖼️](#screenshots)
* [Authors 👪](#authors)
* [License 📄](#license)
* Kanbas</br>
<a href="./kanbas.md" title="kanbas"><img width="5%" src="https://res.cloudinary.com/rick-rick-torrellas/image/upload/v1629301660/icons/kanban_oifhu7.png"/></a>

***

<h2 id="instalation">Instalation 🔑</h2>

[🏠](#nav "Back home")

```javascript
npm i @core_/cli-tools
```
<h2 id="usage">Usage 🔰</h2>

[🏠](#nav "Back home")

Para empezar a usar la herramienta, en el directorio de tu proyecto, usa:

```npm
npx core-scripts
```

## Comandos

* init: Inicia los elemtentos de la app

## Comandos NPM

* nucleo:d - Descarga el nucleo de mega
* nucleo:u - Carga el nucleo a mega
* mongol:u - Carga la base de datos mongo local
* mongol:d - Descarga la base de datos mongo local
* mongoe:u - Carga la base de datos mongo externa
* mongoe:d - Descarga la base de datos mongo externa

<h2 id="requirements">Requirements ⚠️</h2>

* Para pasar las variables de entorno se necesita una archivo llamado: **.env.core** y este archivo necesita ser ignorado en .gitignore. **NOTA**: si se quiere mas seguridad a la hora de usar la contrasena, eliminarla del uri, y colocarla manualmente cuando lo pida.
* Se necesita el modulo [**env-cmd**](https://www.npmjs.com/package/env-cmd)
* Se tiene que tener instalado **megatools**, para alguno de los comandos

[🏠](#nav "Back home")

<h2 id="docker">Implement with Docker 🐋</h2>

[🏠](#nav "Back home")


<h2 id="dependencies">Dependencies 📁</h2>

[🏠](#nav "Back home")

<h2 id="#environment-variables">Environment variables 🔐</h2>

[🏠](#nav "Back home")

```dotenv
MEGA_MAIL_A - Correo de mega
MEGA_PASS_A - Contrasena de mega
MONGO_USER - Usuario de mongo
MONGO_PASSWORD - Contrasena de mongo
MONGO_URI_DOWNLOAD - Ruta de coneccion de mongo para descargar la base de datos
MONGO_URI_UPLOAD - Ruta de coneccion mongo para cargar la base de datos
DEBUG - Para activar el modo debug (default false)
```

<h2 id="screenshots">Screenshots 🖼️</h2>

[🏠](#nav "Back home")

<h2 id="license">License 📄</h2>

[🏠](#nav "Back home")

[MIT](./LICENSE)

<h2 id="authors">Authors 👪</h2>

[🏠](#nav "Back home")

* Ricardo Torrellas

<img src="https://res.cloudinary.com/rick-rick-torrellas/image/upload/v1632064143/icons/pill_sakm1z.svg" alt="template" width="3%">
