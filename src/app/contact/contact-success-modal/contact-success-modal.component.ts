import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-success-modal',
  templateUrl: './contact-success-modal.component.html',
  styleUrls: ['./contact-success-modal.component.scss']
})
export class ContactSuccessModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }
}
