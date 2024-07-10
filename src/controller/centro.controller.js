import { conexion } from "../bd/db.js";

//extraer un solo Usuario
export const CentroCostes= async (req, res)=>{
  const id=req.params.id
  const [result]= await conexion.query('SELECT * FROM `centrocoste` WHERE `rancho`=?',[id])
  
  if(result.length <=0 ) return res.status(404).json({
    mensaje: 'No se encontro centros de costo'
  })

  res.json(result)
};

//extraer un solo variedades
export const Variedades= async (req, res)=>{
  const id=req.params.id
  const [result]= await conexion.query('SELECT variedad FROM `centrocoste` WHERE id=?',[id])
  
  if(result.length <=0 ) return res.status(404).json({
    mensaje: 'No se encontro centros de costo'
  })

  res.json(result)
};

