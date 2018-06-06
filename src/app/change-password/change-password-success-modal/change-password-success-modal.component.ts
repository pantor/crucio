import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-password-success-modal',
  templateUrl: './change-password-success-modal.component.html',
  styleUrls: ['./change-password-success-modal.component.scss']
})
export class ChangePasswordSuccessModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }
}
