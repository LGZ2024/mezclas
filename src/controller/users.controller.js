import { conexion } from "../bd/db.js";

//extraer todos los usuarios
export const usuarios =async (req,res)=>{
  const [result]= await conexion.query('SELECT * FROM usuarios')
  res.json(result)
};

//extraer un solo Usuario
export const usuario= async (req, res)=>{
  const id=req.params.id
  const [result]= await conexion.query('SELECT * FROM usuarios WHERE id=?',[id])
  
  if(result.length <=0 ) return res.status(404).json({
    mensaje: 'No se encontro el usuario'
  })

  res.json(result)
};

//crear usuarios
export const crearUsuario=async(req,res)=>{
  const {nombre, apellido,puesto}=req.body
  const response=await conexion.query('INSERT INTO `usuarios`(`nombre`, `apellido`, `puesto`) VALUES(?,?,?)',[nombre, apellido, puesto])

  if(parseInt(response[0].affectedRows)<=0) return res.status(404).json({
    mensaje:`Ocurrio al crear usuario`
  })

  res.json({message:`El usuario: ${nombre} ${apellido} ha sido creado con exito ${response[0].insertId}`})
}

//actulizar Usuario put
export const actulizarUsuarioPut=async(req, res)=>{
  const id=req.params.id;
  const {nombre, apellido, puesto}=req.body
  const response=await conexion.query('UPDATE `usuarios` SET `nombre`=?,`apellido`=?,`puesto`=? WHERE `id`=?',[nombre, apellido, puesto,id])
  
  if(parseInt(response[0].affectedRows)<=0) return res.status(404).json({
    mensaje:`Ocurrio un error id ${id} no se encuentra en la base de datos`
  })

  res.json({message:`El usuario ${id} ha sido actualizado con exito`})
}

//actulizar Usuario
export const actulizarUsuarioPatch=async(req, res)=>{
  const id=req.params.id;
  const {nombre, apellido, puesto}=req.body
  const response=await conexion.query('UPDATE `usuarios` SET `nombre`=IFNULL(?,nombre),`apellido`=IFNULL(?,apellido),`puesto`=IFNULL(?,puesto) WHERE `id`=?',[nombre, apellido, puesto,id])
  
  if(parseInt(response[0].affectedRows)<=0) return res.status(404).json({
    mensaje:`Ocurrio un error id ${id} no se encuentra en la base de datos`
  })

  res.json({message:`El usuario ${id} ha sido actualizado con exito`})
}

//borra usuario
export const borrarUsuario=async(req,res)=>{
  const id=req.params.id
  const response=await conexion.query('DELETE FROM usuarios WHERE id = ?', [req.params.id])

  if(parseInt(response[0].affectedRows)<=0) return res.status(404).json({
    mensaje:`Ocurrio un error id ${id} no se encuentra en la base de datos`
  })

  res.send({mesage:`usuario Eliminado con exito`})
}

