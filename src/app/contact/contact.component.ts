import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { ContactSuccessModalComponent } from './contact-success-modal/contact-success-modal.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  f = new FormGroup({
    name: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+\.[a-z]{2,4}$/)]),
    message: new FormControl('', [Validators.required])
  });

  constructor(private api: ApiService, private modal: NgbModal) {
    window.document.title = 'Kontakt | Crucio';
  }

  ngOnInit() { }

  sendMessage() {
    const data = { name: this.f.value.name, email: this.f.value.mail, text: this.f.value.message };
    this.api.post('contact/send-mail', data).subscribe(result => {
      if (result.status) {
        this.modal.open(ContactSuccessModalComponent);
      }
    });
  }
}
