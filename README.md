# Crucio

Crucio is an e-learning system for multiple-choice questions. 

Crucio ist ein Online-Lernsystem für Multiple-Choice-Klausuren. Fachschaften können Alt- oder Probefragen eintragen und auf einfachem Wege allen Studierenden zur Verfügung stellen. Alle Informationen und einige Screenshots findet ihr auf der [Website](http://crucioproject.github.io). Crucio wird derzeit an der [Universität Leipzig](http://www.crucio-leipzig.de) verwendet.

Crucio is open source and freely available.

Crucio ist Open Source und damit kostenlos verfügbar. Falls du/ihr/deine Fachschaft Crucio einführen wollt, könnt ihr unter Installation weiterlesen. Bei Fragen könnt ihr an crucio@pantorix.de schreiben!


## Bugs & Feature Requests
Wenn ihr Fehler in Crucio gefunden habt, tragt sie bitte unter Issues ein. Dafür Danke! Ihr könnt dort ebenso Wünsche für neue Features eintragen und Crucio so mitgestalten.


## Installation
Falls du/ihr Crucio bei euch einführen möchtet, braucht ihr einen Server mit PHP und einer MySQL-Datenbank; diese kann man ab 75€ im Jahr mieten. Falls ihr Hilfe bei der Einrichtung und Wartung braucht, könnt ihr euch gerne melden.


## Development & Contribution
Falls ihr Bugs entfernen oder neue Features einbauen möchtet, seid ihr herzlich dazu eingeladen! Ihr könnt euch gerne über crucio@pantorix.de melden, oder direkt Pull-Requests an den `dev`-Branch senden. Ein paar Hinweise zum Projekt:


### Programming
Crucio is written in PHP, Javascript ES6, [SASS](http://sass-lang.com) and MySQL.

### Frameworks
Crucio is based on several frameworks and plug-ins. The most important ones are [AngularJS](https://angularjs.org), [Bootstrap](http://getbootstrap.com) and [SLIM](http://www.slimframework.com). For Icons [FontAwesome](http://fontawesome.io) is used.

### Workflow
For development [Gulp](http://gulpjs.com) is used; mainly for compiling SCSS files and minify- and concat actions. At first, [NodeJS](https://nodejs.org) needs to be installed, afterwards Gulp can be installed via `npm install -g gulp`. The needed dependencies for Crucio (which are listed in `package.json`) can be downloaded via `npm install`. 

## License
Crucio is released under the GNU GENERAL PUBLIC LICENSE v2.