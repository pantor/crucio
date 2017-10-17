import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register-success-modal',
  templateUrl: './register-success-modal.component.html',
  styleUrls: ['./register-success-modal.component.scss']
})
export class RegisterSuccessModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }
}
