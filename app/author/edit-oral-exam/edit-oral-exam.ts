import { app } from './../../crucio';

import AuthService from './../../services/auth.service';
import APIService from './../../services/api.service';
import PageService from './../../services/page.service';

import { DeleteOralExamModalComponent } from './delete-oral-exam-modal';

class EditOralExamController {
  private readonly user: Crucio.User;
  private readonly oralExamId: number;
  private numberChanged: number;
  private uploader: any;
  private hasChanged: boolean;
  private oralExam: Crucio.OralExam;
  private ready: boolean;
  private isSaving: boolean;

  constructor(Page: PageService, Auth: AuthService, private readonly API: APIService, private readonly FileUploader, $scope: angular.IScope, private readonly $location: angular.ILocationService, $stateParams, private readonly $uibModal: angular.ui.bootstrap.IModalService) {
    Page.setTitleAndNav('Mündliche Prüfung | Crucio', 'Author');

    this.user = Auth.getUser();
    this.oralExamId = $stateParams.oralExamId;
    this.numberChanged = -1; // Works with this number...

    this.uploader = new FileUploader({ url: '/api/v1/file/upload' });
    this.uploader.onSuccessItem = (fileItem, response) => {
      this.oralExam.filename = response.upload_name;
    };


    $scope.$watch(() => this.oralExam, () => {
      this.hasChanged = (this.numberChanged > 0);
      this.numberChanged += 1;
    }, true);

    $scope.$on('$locationChangeStart', event => {
      if (this.hasChanged) {
        const confirmClose = confirm(
          'Die Änderungen an der Prüfung bleiben dann ungespeichert. Wirklich verlassen?'
        );
        if (!confirmClose) {
          event.preventDefault();
        }
      }
    });

    this.loadOralExam();
  }

  loadOralExam(): void {
    this.API.get(`oral_exams/${this.oralExamId}`).then(result => {
      this.oralExam = result.data.oral_exam;
      this.ready = true;
    });
    this.ready = true;
  }

  saveOralExam(): void {
    const validate = this.oralExam.semester >= 0
      && this.oralExam.semester <= 1;

    if (validate) {
      this.isSaving = true;
      this.API.put(`oral_exams/${this.oralExamId}`, this.oralExam).then(result => {
        if (!result.data.status) {
          alert('Fehler beim Speichern der Klausur.');
        }

        this.hasChanged = false;
        this.numberChanged = 0;
        this.isSaving = false;
      });
    } else {
      alert('Es fehlen noch allgemeine Infos zur Klausur.');
    }
  }

  deleteOralExamModal(): void {
    this.$uibModal.open({
      component: DeleteOralExamModalComponent,
      resolve: {
        oralExamId: () => this.oralExamId,
      },
    });
  }
}

export const EditOralExamComponent = 'editOralExamComponent';
app.component(EditOralExamComponent, {
  templateUrl: 'app/author/edit-oral-exam/edit-oral-exam.html',
  controller: EditOralExamController,
});
