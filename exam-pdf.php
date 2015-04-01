<?php

require_once('public/php/tcpdf/tcpdf.php');
require_once('api/v1/funcs.general.php');

$exam_id = $_GET['id'];

$mysql = start_mysql();

$exam = get_fetch($mysql, "SELECT * FROM exams WHERE exam_id = ? LIMIT 1", [$exam_id])['result'];
$author = get_fetch($mysql, "SELECT * FROM users WHERE user_id = ? LIMIT 1", [$exam['user_id_added']])['result'];
$questions = get_each($mysql, "SELECT * FROM questions WHERE exam_id = ? ORDER BY question_id ASC", [$exam_id], 'questions', function($row, $stmt, $mysql) {
	$tmp['answers'] = unserialize($row['answers']);
	return $tmp;
})['questions'];
$question_count = count($questions);




class crucioPDF extends TCPDF {
    function Header() {
	    global $exam;

	    $this->Ln(14);
		// $this->Image('public/images/favicon-lg.png', 20, 14, 14);
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


for ($i = 0; $i < count($questions); $i++) {
	$question = $questions[$i]['question'];

	$answers = $questions[$i]['answers'];
	$type = $questions[$i]['type'];
	$number = $i+1;

	$pdf->SetFont('dejavusans', 'B', 11);

	$y = $pdf->GetY();
	if ($y > 222)
		$pdf->AddPage('P', 'A4');

	$pdf->Cell(8, 4, $number.') ');


	// Image
	$image_name = $questions[$i]['question_image_url'];
	if ($image_name) {
		$pdf->Image('public/files/'.$image_name, 133, $pdf->GetY(), 60, 0);
		$pdf->SetFont('dejavusans', '', 11);
		$pdf->writeHTMLCell(106, 4, '', '', $question, false, 1, 0, false, 'L', true);

	} else {
		$pdf->SetFont('dejavusans', '', 11);
		// $pdf->MultiCell(0, 0, $question, 0, 'C', false, 1);
		$pdf->writeHTMLCell(0, 4, '', '', $question, false, 1, 0, false, 'L', true);
	}


	// Print Answers
	if ($type > 1) {
		$pdf->Ln(6);
		for ($j = 0; $j < count($answers); $j++) {
			$answer = $answers[$j];
			if (strlen($answer) > 0) {
				$pdf->SetFont('dejavusans', '', 11);
				$pdf->Cell(18);
				$pdf->Rect(28, $pdf->GetY()+1, 3, 3, '', $style4, array(220, 220, 200));
				$pdf->Cell(1);
				$pdf->writeHTMLCell(0, 3.5, '', '', $answer, false, 1, 0, true, 'L', true);
				$pdf->Ln(4);
			}
		}
	}

	$pdf->Ln(8);
}


$pdf->Output('crucio-klausur-'.$exam_id.'.pdf', 'I');

?>