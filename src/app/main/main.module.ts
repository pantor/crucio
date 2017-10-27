import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieModule } from 'ngx-cookie';
import { TagInputModule } from 'ngx-chips';
import { QuillModule } from 'ngx-quill';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

import { NavbarComponent } from './navbar/navbar.component';
import { LearnComponent } from './learn/learn.component';
import { LearnOverviewComponent } from './learn/learn-overview/learn-overview.component';
import { LearnTagsComponent } from './learn/learn-tags/learn-tags.component';
import { LearnCommentsComponent } from './learn/learn-comments/learn-comments.component';
import { LearnExamsComponent } from './learn/learn-exams/learn-exams.component';
import { LearnSearchComponent } from './learn/learn-search/learn-search.component';
import { LearnOralExamsComponent } from './learn/learn-oral-exams/learn-oral-exams.component';
import { LearnSubjectsComponent } from './learn/learn-subjects/learn-subjects.component';
import { LearnExamComponent } from './learn/learn-exam/learn-exam.component';
import { LearnQuestionComponent } from './learn/learn-question/learn-question.component';
import { LearnAnalysisComponent } from './learn/learn-analysis/learn-analysis.component';
import { AuthorComponent } from './author/author.component';
import { AuthorAdvicesComponent } from './author/author-advices/author-advices.component';
import { AuthorCommentsComponent } from './author/author-comments/author-comments.component';
import { AuthorEditExamComponent } from './author/author-edit-exam/author-edit-exam.component';
import { AuthorEditOralExamComponent } from './author/author-edit-oral-exam/author-edit-oral-exam.component';
import { AuthorExamsComponent } from './author/author-exams/author-exams.component';
import { AuthorOralExamsComponent } from './author/author-oral-exams/author-oral-exams.component';
import { AuthorSubjectsComponent } from './author/author-subjects/author-subjects.component';
import { AdminComponent } from './admin/admin.component';
import { AdminActivityComponent } from './admin/admin-activity/admin-activity.component';
import { AdminStatsComponent } from './admin/admin-stats/admin-stats.component';
import { AdminToolsComponent } from './admin/admin-tools/admin-tools.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminWhitelistComponent } from './admin/admin-whitelist/admin-whitelist.component';
import { UserComponent } from './user/user.component';
import { ErrorComponent } from './error/error.component';
import { HelpComponent } from './help/help.component';
import { TimeagoComponent } from './directives/timeago/timeago.component';
import { DropdownButtonComponent } from './directives/dropdown-button/dropdown-button.component';
import { AdminUserModalComponent } from './admin/admin-users/admin-user-modal/admin-user-modal.component';
import { UserDeleteTagsModalComponent } from './user/user-delete-tags-modal/user-delete-tags-modal.component';
import { UserDeleteResultsModalComponent } from './user/user-delete-results-modal/user-delete-results-modal.component';
import { LearnImageModalComponent } from './learn/learn-image-modal/learn-image-modal.component';
import { LearnReportModalComponent } from './learn/learn-report-modal/learn-report-modal.component';
import { AdminDeleteUserModalComponent } from './admin/admin-users/admin-delete-user-modal/admin-delete-user-modal.component';
import { AuthorDeleteExamModalComponent } from './author/author-edit-exam/author-delete-exam-modal/author-delete-exam-modal.component';
import { AuthorDeleteOralExamModalComponent } from './author/author-edit-oral-exam/author-delete-oral-exam-modal/author-delete-oral-exam-modal.component';
import { ToastComponent } from './directives/toast/toast.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule,
    CookieModule,
    NgbModule,
    TagInputModule,
    QuillModule
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    LearnComponent,
    LearnOverviewComponent,
    LearnTagsComponent,
    LearnCommentsComponent,
    LearnExamsComponent,
    LearnSearchComponent,
    LearnOralExamsComponent,
    LearnSubjectsComponent,
    LearnExamComponent,
    LearnQuestionComponent,
    LearnAnalysisComponent,
    AuthorComponent,
    AuthorAdvicesComponent,
    AuthorCommentsComponent,
    AuthorEditExamComponent,
    AuthorEditOralExamComponent,
    AuthorExamsComponent,
    AuthorOralExamsComponent,
    AuthorSubjectsComponent,
    AdminComponent,
    AdminActivityComponent,
    AdminStatsComponent,
    AdminToolsComponent,
    AdminUsersComponent,
    AdminWhitelistComponent,
    UserComponent,
    ErrorComponent,
    HelpComponent,
    TimeagoComponent,
    DropdownButtonComponent,
    AdminUserModalComponent,
    UserDeleteTagsModalComponent,
    UserDeleteResultsModalComponent,
    LearnImageModalComponent,
    LearnReportModalComponent,
    AdminDeleteUserModalComponent,
    AuthorDeleteExamModalComponent,
    AuthorDeleteOralExamModalComponent,
    ToastComponent
  ],
  bootstrap: [MainComponent],
  entryComponents: [
    AdminUserModalComponent,
    UserDeleteTagsModalComponent,
    UserDeleteResultsModalComponent,
    LearnImageModalComponent,
    LearnReportModalComponent,
    AdminDeleteUserModalComponent,
    AuthorDeleteExamModalComponent,
    AuthorDeleteOralExamModalComponent
  ]
})
export class MainModule { }
