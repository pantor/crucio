import { Component, OnInit, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Collection, CollectionService } from './../../services/collection.service';
import { LearnImageModalComponent } from '../learn-image-modal/learn-image-modal.component';

@Component({
  selector: 'app-learn-exam',
  templateUrl: './learn-exam.component.html',
  styleUrls: ['./learn-exam.component.scss'],
  providers: [CollectionService, ToastService]
})
export class LearnExamComponent implements OnInit {
  combination: Crucio.CombinationElement[];
  readonly user: Crucio.User;
  questions: Crucio.Question[];
  currentIndex: number;
  length: number;

  constructor(private api: ApiService, private auth: AuthService, public collection: CollectionService, private toast: ToastService, private modal: NgbModal) {
    window.document.title = 'Klausur | Crucio';
    this.user = this.auth.getUser();

    this.collection.loadCombinedListAndQuestions(this.collection.getList()).subscribe(result => {
      this.combination = result;
    });
    this.length = this.collection.getLength();

    this.currentIndex = 0;
  }

  ngOnInit() { }

  currentQuestion(): any {
    return this.collection.getQuestion(this.currentIndex);
  }

  save(): void {
    this.collection.saveRemote().subscribe(result => {
      if (result.status) {
        this.toast.new('Gespeichert');
      } else {
        this.toast.new('Fehler');
      }
    });
  }

  openImageModal(filename: string): void {
    const modalRef = this.modal.open(LearnImageModalComponent);
    modalRef.componentInstance.filename = filename;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollTop  = window.pageYOffset || document.documentElement.scrollTop

    const isIdAbovePosition = (i: number) => {
      const offsetTop = document.getElementById(`question${ i + 1 }`).offsetTop;
      return (offsetTop > scrollTop);
    };

    for (let i = 0; i < this.length; i++) {
      if (isIdAbovePosition(i)) {
        this.currentIndex = i;
        break;
      }
    }
  }
}
