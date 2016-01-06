class AuthorController {
  constructor(Page, Auth, API, $location) {
    this.API = API;
    this.$location = $location;

    Page.setTitleAndNav('Autor | Crucio', 'Autor');
    this.activeTab = 'exams';

    this.user = Auth.getUser();

    this.exam_search = { author: this.user };
    this.comment_search = { author: this.user };

    this.API.get('exams/distinct').success(result => {
      this.distinct_semesters = result.semesters;
      this.distinct_authors = result.authors;
      this.distinct_subjects = result.subjects;
    });

    this.API.get('subjects').success(result => {
      this.subject_list = result.subjects;
    });

    this.loadExams();
    this.loadComments();
  }

  loadExams() {
    const data = {
      subject_id: this.exam_search.subject && this.exam_search.subject.subject_id,
      author_id: this.exam_search.author && this.exam_search.author.user_id,
      semester: this.exam_search.semester,
      query: this.exam_search.query,
      limit: 200,
    };
    this.API.get('exams', data).success(result => {
      this.exams = result.exams;
    });
  }

  loadComments() {
    const data = {
      author_id: this.comment_search.author && this.comment_search.author.user_id,
      query: this.comment_search.query,
      limit: 100,
    };
    this.API.get('comments/author', data).success(result => {
      this.comments = result.comments;

      this.questions_by_comment = [];
      for (const c of this.comments) {
        // found = this.questions_by_comment.findIndex(e => { e[0].question == c.question });
        let found = -1;
        for (let i = 0; i < this.questions_by_comment.length; i++) {
          if (this.questions_by_comment[i][0].question === c.question) {
            found = i;
            break;
          }
        }

        if (found > 0) {
          this.questions_by_comment[found].push(c);
        } else {
          this.questions_by_comment.push([c]);
        }
      }
      this.questions_by_comment.sort((a, b) => { return b[0].date - a[0].date; });
      this.questions_by_comment_display = this.questions_by_comment;
    });
  }

  newExam() {
    const data = {
      subject_id: 1,
      user_id_added: this.user.user_id,
      professor: '',
      semester: '',
      date: '',
      type: '',
      duration: '',
      notes: '',
    };

    this.API.post('exams', data).success(result => {
      this.$location.path('/edit-exam').search('id', result.exam_id);
    });
  }
}

angular.module('crucioApp').controller('AuthorController', AuthorController);
