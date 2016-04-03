class AuthorController {
  API: API;
  $location: any;
  activeTab: string;
  user: User;
  examSearch: any;
  commentSearch: any;
  distinctSemesters: any;
  distinctAuthors: any;
  distinctSubjects: any;
  subjectList: any;
  exams: any;
  comments: any;
  questionsByComment: any;

  constructor(Page, Auth, API, $location) {
    this.API = API;
    this.$location = $location;

    Page.setTitleAndNav('Autor | Crucio', 'Autor');
    this.activeTab = 'exams';

    this.user = Auth.getUser();

    this.examSearch = { author: this.user };
    this.commentSearch = { author: this.user };

    this.API.get('exams/distinct').then(result => {
      this.distinctSemesters = result.data.semesters;
      this.distinctAuthors = result.data.authors;
      this.distinctSubjects = result.data.subjects;
    });

    this.API.get('subjects').then(result => {
      this.subjectList = result.data.subjects;
    });

    this.loadExams();
    this.loadComments();
  }

  loadExams() {
    const data = {
      subject_id: this.examSearch.subject && this.examSearch.subject.subject_id,
      author_id: this.examSearch.author && this.examSearch.author.user_id,
      semester: this.examSearch.semester,
      query: this.examSearch.query,
      limit: 200,
    };
    this.API.get('exams', data).then(result => {
      this.exams = result.data.exams;
    });
  }

  loadComments() {
    const data = {
      author_id: this.commentSearch.author && this.commentSearch.author.user_id,
      query: this.commentSearch.query,
      limit: 100,
    };
    this.API.get('comments/author', data).then(result => {
      this.comments = result.data.comments;

      this.questionsByComment = [];
      for (const c of this.comments) {
        // found = this.questionsByComment.findIndex(e => { e[0].question == c.question });
        let found = -1;
        for (let i = 0; i < this.questionsByComment.length; i++) {
          if (this.questionsByComment[i][0].question === c.question) {
            found = i;
            break;
          }
        }

        if (found > 0) {
          this.questionsByComment[found].push(c);
        } else {
          this.questionsByComment.push([c]);
        }
      }
      this.questionsByComment.sort((a, b) => { return b[0].date - a[0].date; });
    });
  }

  newExam() {
    const data = {
      subject_id: 1,
      user_id_added: this.user.user_id,
    };

    this.API.post('exams', data).then(result => {
      this.$location.path('/edit-exam').search('id', result.data.exam_id);
    });
  }
}

angular.module('crucioApp').component('authorcomponent', {
  templateUrl: 'views/author.html',
  controller: AuthorController,
});
