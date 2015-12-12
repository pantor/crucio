class GlobalStatisticController {
    constructor(Page, Auth, API, $interval) {
        this.API = API;

        Page.setTitleAndNav('Statistik | Crucio', 'Admin');

        this.user = Auth.getUser();

        this.activeTab = 'stats';

        this.update_activity = false;
        this.show_activity = { search_query: !true, result: !true, login: !true, register: !true, comment: !true, exam_new: !true, exam_update: !true };

        this.reloadData = function () {
            let first = true;
            this.API.get('stats/general').success((result) => {
                this.stats = result.stats;

                if (first) {
                    this.chart_questions = {
                        labels: ['Gesamt', 'Sichtbar', 'Mit Lösung', 'Mit Erklärung', 'Mit Kategorie', 'Freie Frage'],
                        datasets: [{
                            data: [
                                this.stats.question_count,
                                this.stats.visible_question_count,
                                this.stats.question_count - this.stats.question_without_answer_count,
                                this.stats.question_explanation_count,
                                this.stats.question_topic_count,
                                this.stats.question_free_count,
                            ],
                        }],
                    };

                    this.chart_time_result_today = {
                        labels: this.stats.result_dep_time_today_label,
                        datasets: [{
                            label: 'My Second dataset',
                            fillColor: 'rgba(151,187,205,0.2)',
                            strokeColor: 'rgba(151,187,205,1)',
                            pointColor: 'rgba(151,187,205,1)',
                            pointStrokeColor: '#fff',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(151,187,205,1)',
                            data: this.stats.result_dep_time_today,
                        }],
                    };

                    first = false;
                }
            });

            this.API.get('stats/search-queries').success((result) => {
                this.search_queries = result.search_queries;
            });

            this.API.post('stats/activities', this.show_activity).success((result) => {
                this.activities = result.activities;
            });
        };

        this.reloadData();
        $interval(() => {
            if (this.update_activity) {
                this.reloadData();
            }
        }, 2400);
    }
}

angular.module('adminModule').controller('GlobalStatisticController', GlobalStatisticController);
