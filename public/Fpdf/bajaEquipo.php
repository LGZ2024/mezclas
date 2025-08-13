<?php
require('fpdf.php');

class PDF extends FPDF
{
    private $datos;

    public function __construct($datos)
    {
        parent::__construct();
        $this->datos = $datos;
    }

    function Header()
    {
        $this->SetFont('Arial', 'B', 14);
        $this->Cell(190, 10, utf8_decode('ACTA BAJA DE ACTIVOS'), 1, 1, 'C');

        $this->SetFont('Arial', '', 8);
        $this->MultiCell(190, 5, utf8_decode('Este documento debe ser llenado en todos sus campos y entregado de forma inmediata a Finanzas, procurando se haga dentro de los 3 (tres) primeros días inmediatos siguientes al conocimiento de la BAJA'), 0, 'C');

        $this->SetFont('Arial', '', 10);
        $this->Cell(150, 7, utf8_decode('Fecha De Acta:'), 0, 0, 'R');
        $this->Cell(40, 7, date('d/m/Y'), 0, 1, 'L');
    }

    function ImprovedTable()
    {
        $this->AddSectionHeader('DATOS DEL ACTIVO');

        $this->AddDataRow('Activo(nombre conocido)', utf8_decode($this->datos['nombreActivo']));
        $this->AddDataRow('Tipo de Activo', utf8_decode($this->datos['tipoActivo']));
        $this->AddDataRow('No. de Serie', utf8_decode($this->datos['serie']));
        $this->AddDataRow('Particularidades especiales', 'Marca: ' . utf8_decode($this->datos['marca']) . '    ' . ' Modelo: ' . utf8_decode($this->datos['modelo']).'    ' . ' Tag: ' . utf8_decode($this->datos['tag']));
        $this->AddDataRow('Lugar de ubicacion del activo', utf8_decode($this->datos['lugarBaja']));
        $this->AddDataRow('Funcion que tenia el activo', utf8_decode($this->datos['funcionBaja']));

        $this->Ln(5);

        $this->AddSectionHeader('DATOS DEL MOTIVO DE BAJA');
        $this->AddDataRow('Tipo de baja de activo:', utf8_decode($this->datos['motivoBaja']));

        $this->Ln(5);

        $this->Cell(190, 8, '', 1, 0, 'R');
        $this->Ln(1);
        $this->SetFont('Arial', '', 7);
        $this->Cell(65, 7, 'FECHA DE BAJA y/o del suceso que provoco la baja:', 0, 0, 'L');
        $this->SetFont('Arial', '', 10);
        $this->Cell(60, 7, utf8_decode($this->datos['fechaBaja']), 0, 0, 'L');

        $this->Ln(12);

        $this->Cell(190, 25, '', 1, 0, 'R');
        $this->Ln(5);
        $this->Cell(65, 7, utf8_decode('Documentos que acompañan la baja'), 0, 0, 'L');
        $this->SetFont('Arial', '', 9);
        $this->Cell(-63, 7, utf8_decode('[  ]Fotografías    [  ]Entrevista de testigos    [  ]Documentación de la aseguradora'), 0, 1, 'L');        // $this->Cell(190, 7,'Area/departamento al que pertenece:_______________________________', 0, 0, 'R');
        $this->Cell(190, 7, utf8_decode('[  ]Denuncia    [  ]Mapa de Ubicación del Activo    [  ]y/o Otros, especificar:________________________________________'), 0, 0, 'L');        // $this->Cell(190, 7,'Area/departamento al que pertenece:_______________________________', 0, 0, 'R');

        $this->Ln(13);

        $this->Cell(190, 25, '', 1, 0, 'R');

        $this->Ln(5);

        $this->AddDataRowLn(html_entity_decode('Nombre y Firma del informante de la BAJA:_______________________________________'), 'No. De empleado:_______________');
        $this->Cell(190, 7, 'Area/departamento al que pertenece:_______________________________', 0, 0, 'R');

        $this->Ln(15);

        $this->AddSectionHeader('DEL INFORME, ENTREGA Y RECEPCIÓN DE DOCUMENTOS DE BAJA');
        $this->Cell(190, 90, '', 1, 0, 'R');
        $this->Ln(1);
        $this->SetFont('Arial', '', 5);
        $this->Cell(190, 8, utf8_decode('La siguiente información debe ser llenada por el equipo/persona de Finanzas que recibe el acta y documentación de BAJA'), 0, 1, 'C');
        $this->SetFont('Arial', '', 7);
        $this->Cell(190, 8, utf8_decode('FECHA DE ENTREGA DE ACTA:'), 0, 1, 'B');
        $this->SetFont('Arial', '', 5);
        $this->Cell(190, 1, utf8_decode('fecha de recibido en finanzas                                                  ___________________________________'), 0, 1, 'B');
        $this->Ln(5);
        $this->SetFont('Arial', '', 7);
        $this->AddDataRowLn(html_entity_decode('Nombre y Firma del receptor:                       ___________________________________________________________'), 'No. De empleado:______________________');

        $this->Ln(7);
        $this->SetFont('Arial', '', 7);
        $this->Cell(190, 5, utf8_decode('Cuestiones observadas a la entrega y        __________________________________________________________________________________________________'), 0, 1, 'B');
        $this->Cell(190, 5, utf8_decode('             recepción del ACTA                        __________________________________________________________________________________________________'), 0, 1, 'B');
        $this->SetFont('Arial', '', 5);
        $this->Cell(190, 5, utf8_decode('(faltantes de datos, documentos, compromisos para              __________________________________________________________________________________________________________________________________________'), 0, 1, 'B');
        $this->Cell(190, 5, utf8_decode('                          la entrega de faltantes)                                  __________________________________________________________________________________________________________________________________________'), 0, 1, 'B');
        $this->Cell(190, 5, utf8_decode('                                                                                                 __________________________________________________________________________________________________________________________________________'), 0, 1, 'B');
        $this->Cell(190, 5, utf8_decode('                                                                                                 __________________________________________________________________________________________________________________________________________'), 0, 1, 'B');
    }

    private function AddSectionHeader($text)
    {
        $this->SetFont('Arial', 'B', 10);
        $this->SetFillColor(224, 235, 255);
        $this->Cell(190, 7, utf8_decode($text), 1, 1, 'C', 1);
        $this->SetFont('Arial', '', 10);
    }

    private function AddDataRow($label, $value)
    {
        $this->Cell(60, 7, utf8_decode($label), 1, 0, 'L');
        $this->Cell(130, 7, utf8_decode($value), 1, 1, 'L');
    }
    private function AddDataRowLn($label, $value)
    {
        $this->Cell(130, 10, utf8_decode($label), 0, 0, 'L');
        $this->Cell(90, 10, utf8_decode($value), 0, 1, 'L');
    }
}

// Recuperación de datos
$idEquipo = $_GET['idEquipo'];
$nombreActivo = $_GET['equipo'];
$marca = $_GET['marca'];
$modelo = $_GET['modelo'];
$noSerie = $_GET['noSerie'];
$tag = $_GET['tag'];

// Recuperación de datos de la empresa
$motivo = $_GET['motivo'];
$fechaBaja = $_GET['fechaBaja'];
$lugarBaja = $_GET['lugarBaja'];
$funcionBaja = $_GET['funcionBaja'];

// Uso:
$datos = [
    'idEquipo' => $idEquipo,
    'motivoBaja' => $motivo,
    'fechaBaja' => $fechaBaja,
    'lugarBaja' => $lugarBaja,
    'funcionBaja' => $funcionBaja,
    'nombreActivo' => $nombreActivo,
    'tipoActivo' => 'Dispositivo Electronico',
    'marca' => $marca,
    'modelo' => $modelo,
    'serie' => $noSerie,
    'tag' => $tag,
];

$pdf = new PDF($datos);
$pdf->AddPage();
$pdf->ImprovedTable();
$pdf->Output();

