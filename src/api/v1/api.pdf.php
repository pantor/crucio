<?php

$app->group('/pdf', function() {

  $this->get('/collection/{view}', function($request, $response, $args) {
    $mysql = init();

    $methods = array('pdf-exam', 'pdf-solution', 'pdf-both');
    if (!in_array($args['view'], $methods)) {
      $response = $response->withStatus(404);
      return $response->write('Not found. Neither exam or solution.');
    }

    class crucioPDF extends TCPDF {

      public $cTitle = '';
      public $cSubtitle = '';
      public $font = 'helvetica';

      function Header() {
        $this->Ln(14);
        $this->SetFont($this->font, 'B', 16);
        $this->MultiCell(0, 0, $this->cTitle, 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
        $this->SetFont($this->font, '', 12);
        $this->MultiCell(0, 0, $this->cSubtitle, 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y);
        $this->Ln(8);
      }

      function Footer() {
        $this->SetY(-30);
        $this->SetFont($this->font, 'I', 10);
        $this->Ln(5);
        $txt = 'Seite %s von %s';
        if (empty($this->pagegroups)) {
          $txt = sprintf($txt, $this->PageNo(), $this->getAliasNbPages());
        } else {
          $txt = sprintf($txt, $this->getGroupPageNo(), $this->getPageGroupAlias());
        }
        $this->MultiCell(0, 0, 'www.crucio-leipzig.de', 0, 'C', false, 1, PDF_MARGIN_LEFT, $this->y, 'https://www.crucio-leipzig.de');
      }
    }

    $list = explode(',', urldecode($request->getQueryParam('list')));
    $info = json_decode(urldecode($request->getQueryParam('info')), true);
    $questions = getQuestionsFromList($mysql, $list);

    $filename = '';
    $view_name = '';
    if ($args['view'] == 'pdf-exam') {
      $view_name = 'klausur';
    } else if ($args['view'] == 'pdf-solution') {
      $view_name = 'loesungen';
    } else if ($args['view'] == 'pdf-both') {
      $view_name = 'klausur-loesungen';
    }

    $pdf = new crucioPDF('P', PDF_UNIT, 'A4', true, 'UTF-8', false, true);
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Crucio');
    $pdf->SetTitle('Klausur Nr. '.$exam_id);
    $pdf->SetMargins(PDF_MARGIN_LEFT, 35, PDF_MARGIN_RIGHT);

    // Make title and filename
    if ($info['type'] == 'exam') {
      $stmt_exam = $mysql->prepare(
        "SELECT e.*, s.name AS 'subject'
        FROM exams e
        INNER JOIN subjects s ON s.subject_id = e.subject_id
        WHERE e.exam_id = :exam_id
        LIMIT 1"
      );
      $stmt_exam->bindValue(':exam_id', $info['examId'], PDO::PARAM_INT);
      $exam = getFetch($stmt_exam);

      $pdf->cTitle = $exam['subject'];
      $pdf->cSubtitle = $exam['semester'].'. Semester  |  '.$exam['date'];

      $filename = 'crucio-'.$view_name.'-'.$info['examId'].'.pdf';
    } else if ($info['type'] == 'subjects') {
      $stmt_subject = $mysql->prepare(
        "SELECT s.name as 'subject'
        FROM subjects s
        WHERE s.subject_id = :subject_id"
      );

      $stmt_subject->bindValue(':subject_id', array_keys($info['selection'])[0]);
      $main_subject = getFetch($stmt_subject)['subject'];

      $pdf->cTitle = $main_subject;
      $pdf->cSubtitle = '';

      $filename = 'crucio-'.$view_name.'.pdf';
    } else if ($info['type'] == 'tags') {
      $pdf->cTitle = $info['tag'];
      $pdf->cSubtitle = 'Deine Markierung';

      $filename = 'crucio-'.$view_name.'-'.$info['tag'].'.pdf';
    } else if ($info['type'] == 'query') {
      $pdf->cTitle = $info['questionSearch']['query'];

      if ($info['questionSearch']['semester']) {
        $pdf->cSubtitle = $info['questionSearch']['semester'].'. Semester';
      }

      $filename = 'crucio-'.$view_name.'-'.$info['questionSearch']['query'].'.pdf';
    } else {
      $response = $response->withStatus(404);
      return $response->write('Not found. Neither exam or solution.');
    }


    $pdf->AddPage('P', 'A4');

    if ($args['view'] == 'pdf-exam' || $args['view'] == 'pdf-both') {
      for ($i = 0; $i < count($questions); $i++) {
        $question = $questions[$i]['question'];
        $answers = $questions[$i]['answers'];
        $type = $questions[$i]['type'];
        $number = $i + 1;

        $pdf->SetFont($pdf->font, 'B', 11);

        if ($pdf->GetY() > 222) {
          $pdf->AddPage('P', 'A4');
        }
        $pdf->Cell(8, 4, $number.') ');

        // Image
        $question_dx = 0;
        $image_path = '../../files/'.$questions[$i]['question_image_url'];
        if ($questions[$i]['question_image_url'] !== '' && file_exists($image_path)) {
          $pdf->Image($image_path, 133, $pdf->GetY(), 60, 0);
          $question_dx = 106;
        }
        $pdf->SetFont($pdf->font, '', 11);
        $pdf->writeHTMLCell($question_dx, 4, '', '', $question, false, 1, 0, false, 'L', true);

        // Print answers
        if ($type > 1) {
          $pdf->Ln(6);
          foreach ($answers as $answer) {
            if (strlen($answer) > 0) {
              $pdf->SetFont($pdf->font, '', 11);
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
    }

    if ($args['view'] == 'pdf-both') {
      $pdf->AddPage('P', 'A4');
    }

    if ($args['view'] == 'pdf-solution' || $args['view'] == 'pdf-both') {
      $pdf->SetFont($pdf->font, '', 11);
      $pdf->Cell(18, 0, 'Frage', 0, 0, 'C');
      $pdf->SetFont($pdf->font, 'B', 11);
      $pdf->Cell(20, 0, 'Antwort', 0, 0, 'C');
      $pdf->Ln(8);

      $pdf->setEqualColumns(3, 57);

      for ($i = 0; $i < count($questions); $i++) {
        $number = $i + 1;

        $correct_answer = $questions[$i]['correct_answer'];

        if ($correct_answer == '0') {
          $correct_answer = '?';
        }

        $pdf->SetFont($pdf->font, '', 11);
        $pdf->Cell(18, 4, ''.$number.') ', 0, 0, 'C');

        if ($questions[$i]['type'] == '1') {
          $correct_answer = $questions[$i]['answers'][0];
          $pdf->SetFont($pdf->font, '', 11);
          $pdf->writeHTMLCell(48, 4, '', '', $correct_answer, false, 1, 0, false, 'L', true);
        } else {
          $pdf->SetFont($pdf->font, 'B', 11);
          $pdf->Cell(20, 4, $correct_answer, 0, 0, 'C');
        }

        $pdf->SetFont($pdf->font, '', 11);
        // $pdf->MultiCell(140, 4, $questions[$i]['explanation']);
        $pdf->Ln(5);
      }
    }

    $response = $response->withStatus(200);
    $response = $response->withHeader('Content-type', 'application/pdf');
    return $response->write( $pdf->Output($filename, 'I') );
  });
});

?>
