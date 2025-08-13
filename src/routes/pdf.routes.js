import { Router } from 'express'
import PDFDocument from 'pdfkit'

export const createPdfRouter = () => {
  const router = Router()

  router.get('/acta-baja', (req, res) => {
    // Extraer parámetros de la consulta
    const {
      equipo,
      marca,
      modelo,
      noSerie,
      tag,
      motivo,
      fechaBaja,
      lugarBaja,
      funcionBaja
    } = req.query

    // Configurar documento PDF
    const doc = new PDFDocument({ size: 'A4', margin: 40 })
    res.setHeader('Content-disposition', 'inline; filename="acta-baja.pdf"')
    res.setHeader('Content-type', 'application/pdf')
    doc.pipe(res)

    // =========================================
    // Título principal con borde
    // =========================================
    doc.rect(40, 40, 515, 25).stroke()
    doc.fontSize(14)
      .text('ACTA BAJA DE ACTIVOS',
        40,
        45,
        { align: 'center', width: 515 }
      )

    // =========================================
    // Subtítulo con formato más pequeño
    // =========================================
    doc.fontSize(8)
      .text('Este documento debe ser llenado en todos sus campos y entregado de forma inmediata a Finanzas, procurando se haga dentro de los 3 (tres)\nprimeros días inmediatos siguientes al conocimiento de la BAJA',
        40,
        75,
        { align: 'center', width: 515 }
      )

    // =========================================
    // Fecha con alineación derecha
    // =========================================
    doc.fontSize(10)
      .text(`Fecha De Acta: ${new Date().toLocaleDateString('es-MX')}`,
        40,
        95,
        { align: 'right', width: 515 }
      )

    // =========================================
    // DATOS DEL ACTIVO con borde
    // =========================================
    doc.rect(40, 120, 515, 150).stroke()
    doc.fontSize(11)
      .fillColor('black')
      .text('DATOS DEL ACTIVO',
        40,
        125,
        { align: 'center', width: 515 }
      )

    // Tabla de datos del activo
    const startY = 145
    doc.fontSize(10)
    addTableRow(doc, 'Activo (nombre conocido):', equipo, startY)
    addTableRow(doc, 'Tipo de Activo:', 'Dispositivo Electrónico', startY + 20)
    addTableRow(doc, 'No. de Serie:', noSerie, startY + 40)
    addTableRow(doc, 'Marca:', `${marca}    Modelo: ${modelo}    Tag: ${tag}`, startY + 60)
    addTableRow(doc, 'Lugar de ubicación del activo:', lugarBaja, startY + 80)
    addTableRow(doc, 'Función que tenía el activo:', funcionBaja, startY + 100)

    // =========================================
    // DATOS DEL MOTIVO DE BAJA con borde
    // =========================================
    doc.rect(40, 290, 515, 80).stroke()
    doc.fontSize(11)
      .text('DATOS DEL MOTIVO DE BAJA',
        40,
        295,
        { align: 'center', width: 515 }
      )

    // Datos de baja
    doc.fontSize(10)
    addTableRow(doc, 'Tipo de baja de activo:', motivo, 320)
    addTableRow(doc, 'Fecha de baja:', fechaBaja, 340)

    // =========================================
    // Documentos adjuntos con casillas
    // =========================================
    doc.rect(40, 390, 515, 70).stroke()
    doc.fontSize(10)
      .text('Documentos que acompañan la baja:',
        50,
        400
      )

    doc.text('[ ] Fotografías    [ ] Entrevista de testigos    [ ] Documentación de la aseguradora',
      50,
      420
    )

    doc.text('[ ] Denuncia    [ ] Mapa de Ubicación del Activo    [ ] y/o Otros, especificar:__________________________',
      50,
      440
    )

    // =========================================
    // Sección de firmas
    // =========================================
    doc.rect(40, 480, 515, 70).stroke()
    doc.text('Nombre y Firma del informante de la BAJA:________________________________',
      50,
      490
    )
    doc.text('No. De empleado:_______________',
      50,
      510
    )

    doc.text('Área/departamento al que pertenece:_______________________________',
      50,
      530
    )

    // =========================================
    // Sección final
    // =========================================
    doc.rect(40, 570, 515, 220).stroke()
    doc.fontSize(11)
      .text('DEL INFORME, ENTREGA Y RECEPCIÓN DE DOCUMENTOS DE BAJA',
        40,
        580,
        { align: 'center', width: 515 }
      )

    doc.fontSize(8)
      .text('La siguiente información debe ser llenada por el equipo/persona de Finanzas que recibe el acta y documentación de BAJA',
        40,
        600,
        { align: 'center', width: 515 }
      )

    doc.fontSize(10)
    doc.text('FECHA DE ENTREGA DE ACTA: ___________________________________',
      50,
      630
    )

    doc.text('Nombre y Firma del receptor: __________________________________________',
      50,
      650
    )

    doc.text('No. De empleado:_______________',
      50,
      670
    )

    doc.text('Cuestiones observadas a la \nentrega y recepción del ACTA: _____________________________________________________________\n\n                                                  _____________________________________________________________\n\n                                                  _____________________________________________________________\n\n                                                  _____________________________________________________________',
      50,
      690
    )

    doc.end()
  })

  return router
}

// =========================================
// Funciones auxiliares
// =========================================
function addTableRow (doc, label, value, y) {
  doc.text(label, 50, y)
  doc.text(value, 200, y)
}
