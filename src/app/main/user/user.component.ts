import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../services/toast.service';
import { UserDeleteResultsModalComponent } from './user-delete-results-modal/user-delete-results-modal.component';
import { UserDeleteTagsModalComponent } from './user-delete-tags-modal/user-delete-tags-modal.component';
import { matchingPasswords } from '../../services/validators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ToastService]
})
export class UserComponent implements OnInit {
  user: Crucio.User;
  f: FormGroup;

  constructor(private api: ApiService, private auth: AuthService, private toast: ToastService, private modal: NgbModal, private fb: FormBuilder) {
    window.document.title = 'Account | Crucio';
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.f = this.fb.group({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      newPasswordC: new FormControl('', [Validators.required]),
    }, { validator: matchingPasswords('newPassword', 'newPasswordC') });
  }

  saveUser(): void {
    const data = {
      highlightExams: this.user.highlightExams,
      showComments: this.user.showComments,
      repetitionValue: 50,
      useAnswers: this.user.useAnswers,
      useTags: this.user.useTags,
      course_id: this.user.course_id,
      semester: this.user.semester
    };
    this.api.put(`users/${this.user.user_id}/account`, data).subscribe(result => {
      if (result.status) {
        this.auth.setUser(this.user);
        this.toast.new('Gespeichert');
      } else {
        this.user = this.auth.getUser();
        this.toast.new('Fehler');
      }
    });
  }

  changePassword(): void {
    const data = {
      current_password: this.f.value.oldPassword,
      password: this.f.value.newPassword,
    };
    this.api.put(`users/${this.user.user_id}/password`, data).subscribe(result => {
      if (result.status) {
        this.auth.setUser(this.user);
        this.toast.new('Gespeichert');
      }

      if (result.error === 'error_incorrect_password') {
        this.f.controls.oldPassword.setErrors({'wrong': true});
      }
    });
  }

  deleteAllResultsModal(): void {
    const modalRef = this.modal.open(UserDeleteResultsModalComponent);
    modalRef.componentInstance.user = this.user;
  }

  deleteAllTagsModal(): void {
    const modalRef = this.modal.open(UserDeleteTagsModalComponent);
    modalRef.componentInstance.user = this.user;
  }
}
