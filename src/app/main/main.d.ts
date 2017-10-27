declare namespace Crucio {
  interface User {
    user_id: number;
    username: string;
    active: number;
    course_id: number;
    email: string;
    group_id: number;
    last_sign_in: number;
    sign_up_date: number;
    LostpasswordRequest: number;
    password: string;
    remember_me: string;
    semester: number;
    highlightExams: number;
    showComments: number;
    useAnswers: number;
    useTags: number;
    remember_user?: boolean;
    group_name?: string;
  }

  interface Exam {
    exam_id: number;
    file_name: string;
    subject_id: number;
    semester: number;
    date: string;
    answered_questions?: number;
  }

  interface OralExam {
    oral_exam_id: number;
    semester: number;
    year: number;
    examiner_count: number;
    examiner_1: string;
    examiner_2: string;
    examiner_3: string;
    examiner_4: string;
    filename: string;
  }

  interface Comment {
    comment_id?: number;
    comment: string;
    reply_to: number;
    date: number;
    question_id: number;
    user_id?: number;
    username: string;
    question?: string;
    voting?: number;
    user_voting?: number;
  }

  interface Question {
    question_id?: number;
    question: string;
    correct_answer: number;
    type: number;
    question_image_url?: string;
    explanation?: string;
    category_id: number;
    answers: string[];
  }

  interface AnalyseCount {
    correct: number;
    wrong: number;
    seen: number;
    solved: number;
    free: number;
    no_answer: number;
    all: number;
    worked: number;
  }

  interface Category {
    category_id: number;
    category: string;
  }

  interface Subject {
    subject_id: number;
    subject: string;
    categories: Category[];
  }

  interface Mail {
    text: string;
    name: string;
    email: string;
  }

  interface MailQuestion extends Mail {
    mail_subject: string;
    question_id: number;
    author: string;
    question: string;
    exam_id: number;
    subject: string;
    author_email: string;
    date: any;
  }

  interface CollectionListItem {
    question_id: number;
    mark_answer: number; // boolean
    given_result: number; // rename to given_answer
    strike: boolean[];
  }

  type Method = 'question' | 'exam' | 'pdf-exam' | 'pdf-solution' | 'pdf-both';
  type Type = 'exam' | 'subjects' | 'query' | 'tags';

  interface CombinationElement {
    data: CollectionListItem;
    question: Question;
  }
}

interface Storage {
  crucioCollection: any;
}
