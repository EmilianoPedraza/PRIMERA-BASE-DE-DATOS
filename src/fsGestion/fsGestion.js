const fs = require("fs");
class fsGestion {
  constructor(archivoName) {
    this.archivoName = archivoName;
  }

  save = async (obj) => {
    
    const archivo = await fs.promises.readFile(this.archivoName, "utf-8");
    const  archivoParseado = (archivo ? JSON.parse(archivo) : [])
    let id = 1;
    archivoParseado.forEach((element, index) => {
      if (element.id >= id) {
        id = element.id + 1;
      }
    });
    obj.id = id;
    archivoParseado.push(obj);
    await fs.promises.writeFile(this.archivoName,JSON.stringify(archivoParseado, null, 2));
  };




  getAll = async () => {
    const archivo = await fs.promises.readFile(this.archivoName, 'utf-8');
    try {
      const archivoParseado = JSON.parse(archivo);
      return archivoParseado; 
    } catch (error) {
      return []
    }
  };



}

module.exports = fsGestion;

