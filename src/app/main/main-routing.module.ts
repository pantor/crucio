import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';

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

import { AuthorGuard } from './author/author.guard';
import { AdminGuard } from './admin/admin.guard';

const routes: Routes = [
  { path: '', component: MainComponent, children: [
    { path: 'learn', component: LearnComponent, children: [
      { path: 'overview', component: LearnOverviewComponent },
      { path: 'tags', component: LearnTagsComponent },
      { path: 'comments', component: LearnCommentsComponent },
      { path: 'exams', component: LearnExamsComponent },
      { path: 'search', component: LearnSearchComponent },
      { path: 'oral-exams', component: LearnOralExamsComponent },
      { path: 'subjects', component: LearnSubjectsComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ]},
    { path: 'question', component: LearnQuestionComponent },
    { path: 'exam', component: LearnExamComponent },
    { path: 'analysis', component: LearnAnalysisComponent },
    { path: 'author', component: AuthorComponent, canActivateChild: [AuthorGuard], children: [
      { path: 'exams', component: AuthorExamsComponent },
      { path: 'advices', component: AuthorAdvicesComponent },
      { path: 'comments', component: AuthorCommentsComponent },
      { path: 'subjects', component: AuthorSubjectsComponent },
      { path: 'oral-exams', component: AuthorOralExamsComponent },
      { path: '', redirectTo: 'exams', pathMatch: 'full' },
    ]},
    { path: 'edit-exam', component: AuthorEditExamComponent },
    { path: 'edit-oral-exam', component: AuthorEditOralExamComponent },
    { path: 'admin', component: AdminComponent, canActivateChild: [AdminGuard], children: [
      { path: 'users', component: AdminUsersComponent },
      { path: 'whitelist', component: AdminWhitelistComponent },
      { path: 'tools', component: AdminToolsComponent },
      { path: 'stats', component: AdminStatsComponent },
      { path: 'activity', component: AdminActivityComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ]},
    { path: 'user', component: UserComponent },
    { path: 'help', component: HelpComponent },
    { path: '', redirectTo: 'learn', pathMatch: 'full' },
    { path: '**', component: ErrorComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthorGuard, AdminGuard]
})
export class MainRoutingModule { }
