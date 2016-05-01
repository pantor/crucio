# Crucio

Crucio is an e-learning system for multiple-choice questions. Student groups can enter old or mock exams and make them available for all fellow students in an easy way. All information and some screenshot can be found on the [project website](http://crucioproject.github.io). Crucio is currently used at the [Leipzig University](http://www.crucio-leipzig.de).

Crucio is open source and freely available. If you or your student union want to introduce Crucio for your exam collection, feel free to contact us at kontakt@crucio-leipzig.de!


## Bugs & Feature Requests
Please report bugs in the issue tracker (Issues Tab). Thanks! In the same way, you can list your feature requests for Crucio. We appreciate every piece of contributing!


## Development & Contribution
If you want to remove bugs, introduce new features or learn about the project, we are happy to welcome you onboard! A few notes about Crucio:

### Programming
Crucio is written in PHP, Typescript, [Sass](http://sass-lang.com) and MySQL. Furthermore, it is based on several frameworks and plug-ins. The most important ones are [AngularJS](https://angularjs.org), [Bootstrap](http://getbootstrap.com) and [Slim](http://www.slimframework.com). For Icons [FontAwesome](http://fontawesome.io) is used.

### Workflow
For development [Gulp](http://gulpjs.com) is used; mainly for compiling SCSS files and minify- and concat actions. At first, [NodeJS](https://nodejs.org) needs to be installed, afterwards Gulp can be installed via `npm install -g gulp`. The needed dependencies for Crucio (which are listed in `package.json`) can be downloaded via `npm install`. Pull-requests can be send to the `dev`-branch.


## License
Crucio is released under the GNU GENERAL PUBLIC LICENSE v2.
