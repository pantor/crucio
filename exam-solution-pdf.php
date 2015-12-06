<?php

require_once('api/tcpdf/tcpdf.php');
require_once('api/v1/helper.php');

$exam_id = $_GET['id'];

$mysql = start_mysql();

$exam = get_fetch($mysql, "SELECT * FROM exams WHERE exam_id = ? LIMIT 1", [$exam_id])['result'];
$author = get_fetch($mysql, "SELECT * FROM users WHERE user_id = ? LIMIT 1", [$exam['user_id_added']])['result'];
$questions = get_all($mysql, "SELECT * FROM questions WHERE exam_id = ? ORDER BY question_id ASC", [$exam_id])['result'];

foreach ($questions as &$question) {
    $question['answers'] = unserialize($question['answers']);
}
$question_count = count($questions);




class crucioPDF extends TCPDF {
	function Header() {
	    global $exam;

	    $this->Ln(14);
	    $this->SetFont('dejavusans', 'B', 16);
	    $this->MultiCell(0, 0, $exam['subject'], 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
	    $this->SetFont('dejavusans', '', 12);
	    $this->MultiCell(0, 0, $exam['semester'].'. Semester  |  '.$exam['date'], 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
		$this->Ln(8);
	}

    function Footer() {
        $this->SetY(-30);
        $this->SetFont('dejavusans', 'I', 10);
        $this->Ln(5);
        $txt = 'Seite %s von %s';
        if (empty($this->pagegroups)) {
            $txt = sprintf($txt, $this->PageNo(), $this->getAliasNbPages());
        } else {
            $txt = sprintf($txt, $this->getGroupPageNo(), $this->getPageGroupAlias());
        }
        $this->MultiCell(0, 0, $txt, 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
        $this->MultiCell(0, 0, 'www.crucio-leipzig.de', 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y, 'http://www.crucio-leipzig.de');
    }
}


$pdf = new crucioPDF('P', PDF_UNIT, 'A4', true, 'UTF-8', false, true);
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Crucio');

$pdf->SetTitle('Klausur Nr. '.$exam_id);
$pdf->SetMargins(PDF_MARGIN_LEFT, 35, PDF_MARGIN_RIGHT);
$pdf->AddPage('P', 'A4');

$pdf->SetFont('dejavusans', '', 11);
$pdf->Cell(18, 0, 'Frage', 0, 0, 'C');
$pdf->SetFont('dejavusans', 'B', 11);
$pdf->Cell(20, 0, 'Antwort', 0, 0, 'C');
$pdf->Ln(8);

$pdf->setEqualColumns(3, 57);

for ($i = 0; $i < $question_count; $i++) {
	$number = $i+1;

	$correct_answer = $questions[$i]['correct_answer'];

	if ($correct_answer == '0')
		$correct_answer = '?';

	$pdf->SetFont('dejavusans', '', 11);
	$pdf->Cell(18, 4, ''.$number.') ', 0, 0, 'C');

	if ($questions[$i]['type'] == '1') {
		$correct_answer = $questions[$i]['answers'][0];
		$pdf->SetFont('dejavusans', '', 11);
		$pdf->writeHTMLCell(48, 4, '', '', $correct_answer, false, 1, 0, false, 'L', true);
	} else {
		$pdf->SetFont('dejavusans', 'B', 11);
		$pdf->Cell(20, 4, $correct_answer, 0, 0, 'C');
	}

	$pdf->SetFont('dejavusans', '', 11);
	// $pdf->MultiCell(140, 4, utf8_decode($questions[$i]['explanation'])); 
	$pdf->Ln(5);
}


$pdf->Output('crucio-loesungen-'.$exam_id.'.pdf', 'I');

?>