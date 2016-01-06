<?php

$app->group('/pdf', function() {

    $this->get('/{view}/{exam_id}', function($request, $response, $args) {
        $mysql = init();

        $exam_id = $args['exam_id'];

        $stmt_exam = $mysql->prepare(
            "SELECT e.*
            FROM exams e
            WHERE e.exam_id = :exam_id
            LIMIT 1"
		);
		$stmt_exam->bindValue(':exam_id', $exam_id, PDO::PARAM_INT);
		$exam = getFetch($stmt_exam);

		$stmt_questions = $mysql->prepare(
            "SELECT q.*
            FROM questions q
            WHERE q.exam_id = :exam_id"
		);
		$stmt_questions->bindValue(':exam_id', $exam_id, PDO::PARAM_INT);
		$questions = getAll($stmt_questions);
        foreach ($questions as &$question) {
            $question['answers'] = unserialize($question['answers']);
        }
        $question_count = count($questions);


        class crucioPDF extends TCPDF {
            function Header() {
        	    $this->Ln(14);
        	    $this->SetFont('helvetica', 'B', 16);
        	    $this->MultiCell(0, 0, $this->exam['subject'], 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
        	    $this->SetFont('helvetica', '', 12);
        	    $this->MultiCell(0, 0, $this->exam['semester'].'. Semester  |  '.$this->exam['date'], 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
        		$this->Ln(8);
        	}

            function Footer() {
                $this->SetY(-30);
                $this->SetFont('helvetica', 'I', 10);
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

            function setData($exam) {
                $this->exam = $exam;
            }
        }

        $font = 'helvetica';

        $pdf = new crucioPDF('P', PDF_UNIT, 'A4', true, 'UTF-8', false, true);
        $pdf->setData($exam);
        $pdf->SetCreator(PDF_CREATOR);
        $pdf->SetAuthor('Crucio');

        $pdf->SetTitle('Klausur Nr. '.$exam_id);
        $pdf->SetMargins(PDF_MARGIN_LEFT, 35, PDF_MARGIN_RIGHT);
        $pdf->AddPage('P', 'A4');

        $response = $response->withStatus(200);
        $response = $response->withHeader('Content-type', 'application/pdf');

        if ($args['view'] == 'exam') {
            for ($i = 0; $i < count($questions); $i++) {
            	$question = $questions[$i]['question'];

            	$answers = $questions[$i]['answers'];
            	$type = $questions[$i]['type'];
            	$number = $i + 1;

            	$pdf->SetFont($font, 'B', 11);

            	$y = $pdf->GetY();
            	if ($y > 222)
            		$pdf->AddPage('P', 'A4');

            	$pdf->Cell(8, 4, $number.') ');


            	// Image
            	$image_path = 'public/files/'.$questions[$i]['question_image_url'];
            	if ('' !== $image_path && file_exists($image_path)) {
                	$pdf->Image($image_path, 133, $pdf->GetY(), 60, 0);
                	$pdf->SetFont($font, '', 11);
                    $pdf->writeHTMLCell(106, 4, '', '', $question, false, 1, 0, false, 'L', true);
            	} else {
            		$pdf->SetFont($font, '', 11);
            		$pdf->writeHTMLCell(0, 4, '', '', $question, false, 1, 0, false, 'L', true);
            	}


            	// Print answers
            	if ($type > 1) {
            		$pdf->Ln(6);
            		for ($j = 0; $j < count($answers); $j++) {
            			$answer = $answers[$j];
            			if (0 < strlen($answer)) {
            				$pdf->SetFont($font, '', 11);
            				$pdf->Cell(18);
            				$pdf->Rect(28, $pdf->GetY() + 1, 3, 3, '', $style4, array(220, 220, 200));
            				$pdf->Cell(1);
            				$pdf->writeHTMLCell(0, 3.5, '', '', $answer, false, 1, 0, true, 'L', true);
            				$pdf->Ln(4);
            			}
            		}
            	}

            	$pdf->Ln(8);
            }
            $response->withBody( $pdf->Output('crucio-klausur-'.$exam_id.'.pdf', 'I') );

        } else if ($args['view'] == 'solution') {
            $pdf->SetFont($font, '', 11);
            $pdf->Cell(18, 0, 'Frage', 0, 0, 'C');
            $pdf->SetFont($font, 'B', 11);
            $pdf->Cell(20, 0, 'Antwort', 0, 0, 'C');
            $pdf->Ln(8);

            $pdf->setEqualColumns(3, 57);

            for ($i = 0; $i < $question_count; $i++) {
            	$number = $i+1;

            	$correct_answer = $questions[$i]['correct_answer'];

            	if ('0' == $correct_answer) {
            		$correct_answer = '?';
                }

            	$pdf->SetFont($font, '', 11);
            	$pdf->Cell(18, 4, ''.$number.') ', 0, 0, 'C');

            	if ('1' == $questions[$i]['type']) {
            		$correct_answer = $questions[$i]['answers'][0];
            		$pdf->SetFont($font, '', 11);
            		$pdf->writeHTMLCell(48, 4, '', '', $correct_answer, false, 1, 0, false, 'L', true);
            	} else {
            		$pdf->SetFont($font, 'B', 11);
            		$pdf->Cell(20, 4, $correct_answer, 0, 0, 'C');
            	}

            	$pdf->SetFont($font, '', 11);
            	// $pdf->MultiCell(140, 4, utf8_decode($questions[$i]['explanation']));
            	$pdf->Ln(5);
            }
            $response->withBody( $pdf->Output('crucio-loesungen-'.$exam_id.'.pdf', 'I') );
        } else {
            $response = $response->withStatus(404);
            $response->write('Not found. Either exam or solution.');
        }
    });
});

?>