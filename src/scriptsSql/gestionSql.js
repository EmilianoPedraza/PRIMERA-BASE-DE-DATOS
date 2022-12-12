const { on } = require("events");
const knex = require("knex")

class gestionSql {
  constructor(options, table) {
          this.conecction = knex(options);
          this.table = table
  }
  //si no se mandan parametros solo valida que exista la tabla y si se manda un objeto como parametro crea la tabla
  validateTable = async (obj=undefined)=>{
    try {
      const existe = await this.conecction.schema.hasTable(this.table)
      if(obj !== undefined){
        if(!existe){
          await this.conecction.schema.createTable(this.table, (art)=>{
            art.increments("id").primary();
            for(const prop in obj){
                if (typeof obj[prop] === "string"){art.string(prop).notNullable();}
                if(typeof obj[prop] === "number"){
                  obj[prop] % 1 == 0 ? art.integer(prop).notNullable() : art.float(prop).notNullable()
                }         
            }
         })
        }
      }else{return existe}
    } catch (error) {
        console.log("[Error en validateTable]: \n", error)
    }
  }
  save = async (obj)=>{
    try {
      await this.validateTable(obj)
      await this.conecction(this.table).insert(obj)
    }
    catch (error){console.log("[Error en save]: \n", error)
    }
  };

  getById = async (id)=>{
    try {
      const valid = await this.validateTable()
      if(valid){
        return await this.conecction(this.table).where("id", id)
      }
      else{
         console.log(`[En getById de gestionSql]:Busqueda irrealizable, la tabla "${this.table}" no existe.`)
      }
    } catch (error) {
         console.log("[Error en save]: \n", error)
    }
  }

  getAll = async ()=>{
    try {
      const valid = await this.validateTable()
      if(valid){
            return await this.conecction(this.table)
      }else{
        return []
      }
    } catch (error) {
      console.log("[Error en getAll]: \n", error)
    }
  };


  deleteById = async (id)=>{
    try {
      const valid = await this.validateTable()
      if(valid){
        await this.conecction(this.table).where("id", id).del()
        return id
      }
      else{
        console.log(`[En  de deleteById]:Eliminación de id:${id} irrealizable, la tabla "${this.table}" no existe.`)
      }
    } catch (error) {
      console.log("[Error en deleteById]: \n", error)
    }
  }


  deleteAll = async ()=>{
    try {
      await this.conecction(this.table).del()
    } catch (error) {
      console.log(`[En deleteAll]:Eliminación irrealizable, la tabla "${this.table}" no existe.`)
    }
  }

}

module.exports = gestionSql

