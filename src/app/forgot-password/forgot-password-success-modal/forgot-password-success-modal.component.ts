import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgot-password-success-modal',
  templateUrl: './forgot-password-success-modal.component.html',
  styleUrls: ['./forgot-password-success-modal.component.scss']
})
export class ForgotPasswordSuccessModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }
}
