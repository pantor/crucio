import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learn-image-modal',
  templateUrl: './learn-image-modal.component.html',
  styleUrls: ['./learn-image-modal.component.scss']
})
export class LearnImageModalComponent implements OnInit {
  @Input() filename: string;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() { }
}
