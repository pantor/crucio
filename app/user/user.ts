import { app } from './../crucio';

import AuthService from './../services/auth.service';
import APIService from './../services/api.service';
import PageService from './../services/page.service';

import { DeleteResultsModalComponent } from './delete-results-modal';
import { DeleteTagsModalComponent } from './delete-tags-modal';

class UserController {
  user: Crucio.User;
  isWorking: boolean;
  isSaved: boolean;
  hasError: boolean;
  wrongPassword: boolean;
  oldPassword: string;
  newPassword: string;
  newPasswordC: string;

  constructor(Page: PageService, private readonly Auth: AuthService, private readonly API: APIService, private readonly $scope: angular.IScope, private readonly $uibModal: angular.ui.bootstrap.IModalService) {
    Page.setTitleAndNav('Account | Crucio', 'User');

    this.user = this.Auth.getUser();
  }

  formChanged(): void {
    this.isSaved = false;
    this.hasError = false;

    this.$scope.form.passwordc.$setValidity('confirm', this.newPassword === this.newPasswordC);
  }

  saveUser(): void {
    this.formChanged();

    this.isWorking = true;

    const data = {
      course_id: this.user.course_id,
      semester: this.user.semester,
      current_password: this.oldPassword,
      password: this.newPassword,
    };
    this.API.put(`users/${this.user.user_id}/account`, data).then(result => {
      if (result.data.status) {
        this.Auth.setUser(this.user);
      } else {
        this.user = this.Auth.getUser();
        this.hasError = true;
      }

      this.isSaved = result.data.status;
      this.wrongPassword = (result.data.error === 'error_incorrect_password');
      this.isWorking = false;
    });

    const dataSettings = {
      highlightExams: this.user.highlightExams,
      showComments: this.user.showComments,
      repetitionValue: 50,
      useAnswers: this.user.useAnswers,
      useTags: this.user.useTags,
    };
    this.API.put(`users/${this.user.user_id}/settings`, dataSettings).then(result => {
      if (result.data.status) {
        this.Auth.setUser(this.user);
      } else {
        this.user = this.Auth.getUser();
        this.hasError = true;
      }

      this.isSaved = result.data.status;
      this.isWorking = false;
    });
  }

  deleteAllResultsModal(): void {
    this.$uibModal.open({
      component: DeleteResultsModalComponent,
      resolve: {
        userId: () => this.user.user_id,
      },
    });
  }

  deleteAllTagsModal(): void {
    this.$uibModal.open({
      component: DeleteTagsModalComponent,
      resolve: {
        userId: () => this.user.user_id,
      },
    });
  }
}

export const UserComponent = 'userComponent';
app.component(UserComponent, {
  templateUrl: 'app/user/user.html',
  controller: UserController,
});
