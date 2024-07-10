import { conexion } from "../bd/db.js";
import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const crearSolicitud = async (req, res) => {
  try {
    // Acceder a los datos de FormData
    const {
      id_usuario,
      nombre_usuario,
      rancho,
      empresa_pertece,
      centro_coste,
      variedad,
      folio,
      temporada,
      cantidad,
      presentacion,
      metodo_aplicacion,
      descripcion,
      image
    } = req.body;
    console.log(req.body)

    if (!image) {
      return res.status(400).send('No se ha enviado ninguna imagen o nombre de archivo');
    }

    // Procesar base64
    const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).send('Formato de imagen no válido');
    }

    const imageData = matches[2];
    const buffer = Buffer.from(imageData, 'base64');
    const imageExtension = path.extname('imagen.jpg');
    const imageName = `image_${Date.now()}${imageExtension}`;
    const imagePath = path.join(__dirname + `../../../public/uploads`, imageName);

    // Crear la carpeta 'uploads' si no existe
    if (!fs.existsSync(path.join(__dirname + `../../../public/uploads`))) {
      fs.mkdirSync(path.join(__dirname + `../../../public/uploads`));
    }

    // Guardar la imagen en el servidor
    fs.writeFile(imagePath, buffer, (err) => {
      if (err) {
        console.error('Error al guardar la imagen:', err);
        return res.status(500).send('Error al guardar la imagen');
      }
    });

    console.log(imagePath)

    const pathParts = imagePath.split("\\");

    // Obtener la última parte de la ruta (el nombre del archivo)
    const fileName = pathParts[pathParts.length - 1];

    // Construir la ruta relativa
    const relativePath = `../uploads/${fileName}`;

    console.log(relativePath);
    //fecha 
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleString();

    // Insertar los datos en la base de datos
    const response = await conexion.query('INSERT INTO `mesclaz`(`FolioReceta`, `Solicita`, `cantidad`, `centroCoste`, `descripcion`, `empresa`, `fechaSolicitud`, `idUsuarioSolicita`, `imagen`,`metodoAplicacion`,`prensetacion`, `ranchoDestino`, `status`, `temporada`, `variedad`) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
      folio,
      nombre_usuario,
      cantidad,
      centro_coste,
      descripcion,
      empresa_pertece,
      fechaFormateada,
      id_usuario,
      relativePath, // Guardar la ruta del archivo en la base de datos
      metodo_aplicacion,
      presentacion,
      rancho,
      'Solicitada',
      temporada,
      variedad
    ]);

    if (parseInt(response[0].affectedRows) <= 0) {
      return res.status(404).json({
        mensaje: `Ocurrió un error al crear la solicitud`
      });
    }
    res.json({
      response: `ok`,
      message: `La solicitud ha sido creada con éxito, número de solicitud: ${response[0].insertId}`
    });
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' });
  }
}
export const obtenerTablaMezclas = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;
    const status = req.query.status;
    console.log(id_usuario + '' + status)
    const [result] = await conexion.query('SELECT * FROM `mesclaz` WHERE status=? AND idUsuarioSolicita=?', [status, id_usuario]);
    console.log(result)
    if (result.length <= 0) return res.status(404).json({ mensaje: 'No se encontro mezclas' })

    res.json(result)

  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' });
  }
}
export const obtenerTablaMezclasStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const [result] = await conexion.query('SELECT * FROM `mesclaz` WHERE status=?', [status]);
    console.log(result)
    if (result.length <= 0) return res.status(404).json({ mensaje: 'No se encontro mezclas' })

    res.json(result)

  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' });
  }
}
export const obtenerTablaMezclasEmpresa = async (req, res) => {
  try {
    const empresa = req.params.empresa;
    const status = req.query.status;
    const [result] = await conexion.query('SELECT * FROM `mesclaz` WHERE empresa=? AND status=?', [empresa, status]);
    console.log(result)
    if (result.length <= 0) return res.status(404).json({ mensaje: 'No se encontro mezclas' })

    res.json(result)

  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' });
  }
}
export const guardarTablaMezclas = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const { folio, status, notaMezcla } = req.body
    const [affectedRows] = await conexion.query('UPDATE `mesclaz` SET `idUsuarioMezcla`=? ,`notaMezcla`=?,`status`=? WHERE `FolioReceta`=?', [idUsuario, notaMezcla, status, folio]);
    if (parseInt(affectedRows) <= 0) return res.status(404).json({
      mensaje: `Ocurrio un error id ${id} no se encuentra en la base de datos`
    })
    res.json({ message: `ok` })
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' });
  }
}
export const cerrarMezclas = async (req, res) => {
  try {
    const { idMesclas, imagen } = req.body
    console.log(req.body)

    if (!imagen) {
      return res.status(400).send('No se ha enviado ninguna imagen o nombre de archivo');
    }

    // Procesar base64
    const matches = imagen.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).send('Formato de imagen no válido');
    }

    const imageData = matches[2];
    const buffer = Buffer.from(imageData, 'base64');
    const imageExtension = path.extname('imagen.jpg');
    const imageName = `image_nimagen${Date.now()}${imageExtension}`;
    const imagePath = path.join(__dirname + `../../../public/uploads`, imageName);

    // Crear la carpeta 'uploads' si no existe
    if (!fs.existsSync(path.join(__dirname + `../../../public/uploads`))) {
      fs.mkdirSync(path.join(__dirname + `../../../public/uploads`));
    }

    // Guardar la imagen en el servidor
    fs.writeFile(imagePath, buffer, (err) => {
      if (err) {
        console.error('Error al guardar la imagen:', err);
        return res.status(500).send('Error al guardar la imagen');
      }
    });

    console.log(imagePath)

    const pathParts = imagePath.split("\\");

    // Obtener la última parte de la ruta (el nombre del archivo)
    const fileName = pathParts[pathParts.length - 1];

    // Construir la ruta relativa
    const relativePath = `../uploads/${fileName}`;

    console.log(relativePath);

    //fecha 
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleString();


    /* --------------------------------------------------------------------- */
    const [affectedRows] = await conexion.query('UPDATE `mesclaz` SET `imagenEntrega`=? ,`status`=?, `fechaEntrega`=? WHERE `id`=?', [relativePath, 'entregada', fechaFormateada, idMesclas]); // Actualizar la imagen en la base de datos

    if (parseInt(affectedRows) <= 0) return res.status(404).json({
      mensaje: `Ocurrio un error id ${id} no se encuentra en la base de datos`
    })
    res.status(200).json({ message: `ok` })
  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' });
  }
}
export const obtenerTablaMezclasId = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await conexion.query('SELECT * FROM `mesclaz` WHERE id=?', [id]);
    console.log(result)
    if (result.length <= 0) return res.status(404).json({ mensaje: 'No se encontro mezclas' })

    res.json(result)

  } catch (error) {
    console.error('Error al crear la solicitud:', error);
    res.status(500).json({ mensaje: 'Ocurrió un error al crear la solicitud' });
  }
}

