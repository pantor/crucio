# Crucio

Crucio ist ein Online-Lernsystem für Multiple-Choice-Klausuren. Fachschaften können Alt- oder Probefragen eintragen und auf einfachem Wege allen Studierenden zur Verfügung stellen. Alle Informationen und einige Screenshots findet ihr auf der [Website](http://crucioproject.github.io). Crucio wird derzeit an der [Universität Leipzig](http://www.crucio-leipzig.de) verwendet.

Crucio ist Open Source und damit kostenlos verfügbar. Falls du/ihr/deine Fachschaft Crucio einführen wollt, könnt ihr unter Installation weiterlesen. Bei Fragen könnt ihr an 'crucio@pantorix.de' schreiben!


## Fehler & Wünsche
Wenn ihr Fehler in Crucio gefunden habt, tragt sie bitte unter Issues ein. Dafür Danke! Ihr könnt dort ebenso Wünsche für neue Features eintragen und Crucio so mitgestalten.


## Installation
Falls du/ihr Crucio bei euch einführen möchtet, braucht ihr einen Server mit PHP und einer MySQL-Datenbank; diese kann man ab 60€ im Jahr mieten. Falls ihr Hilfe bei der Einrichtung und Wartung braucht, könnt ihr euch gerne melden.


## Entwicklung
Falls ihr Bugs entfernen oder neue Features einbauen möchtet, seid ihr herzlich dazu eingeladen! Ihr könnt euch gerne über 'crucio@pantorix.de' melden, oder direkt Pull-Requests an den 'Dev'-Branch senden. Ein paar Hinweise zum Projekt:


### Programmiersprachen
Crucio ist in PHP, HTML, Javascript, [LESS](http://lesscss.org) und MySQL geschrieben.

### Frameworks
Die wichtigsten Frameworks, auf denen Crucio basiert, sind [AngularJS](https://angularjs.org), [Bootstrap](http://getbootstrap.com) und [SLIM](http://www.slimframework.com). Für Icons wird [FontAwesome](http://fontawesome.io) verwendet.

### Workflow
Zur Entwicklung wird [NPM](https://www.npmjs.com) und [Grunt](http://gruntjs.com) verwendet. Letzteres wird hauptsächlich für den LESS-Compiler und für Minify & Concat Aktionen genutzt. Die beiden Tools sollten zur Entwicklung installiert sein, NPM kann als Teil von [NodeJS](https://nodejs.org) von deren Website heruntergeladen werden. Grunt kann dann über `npm install -g grunt-cli` installiert werden. Es müssen einmalig die benötigten Pakete heruntergeladen werden, dies passiert über `npm install`.

Über `grunt watch` wird dann eine Umgebung gestartet, bei der Änderungen sofort verarbeitet werden.

## Lizenz
Crucio ist unter der GNU GENERAL PUBLIC LICENSE Version 2 verfügbar.