# Crucio

Crucio ist ein Online-Lern-System zum Üben von Klausuren mit Multiple-Choice-Fragen. Eingetragene Autoren können Klausuren erstellen und eintragen, die von den Benutzern gekreuzt werden können. Es wird derzeit an der Universität Leipzig verwendet und ist unter [www.crucio-leipzig.de](http://www.crucio-leipzig.de) erreichbar.

Auf der [Website](http://pantor.github.io/Crucio/) gibt es alle Informationen über Crucio. Die wichtigsten Funktionen sind:
- Benutzersystem (verschiedene Authentifikationsverfahren möglich, umfangreiche Benutzerverwaltung, Gruppenzuordnung zu Autoren und Admins)
- Autorenfunktion (Eingabe von Fragen und Klausuren online, Ansicht aller Kommentare)
- Verschiedenste Arten von Fragen (Multiple-Choice Fragen jeder Art, freie Fragen, Lösungen, Erklärungen, Hochladen von Bildern, Formeleditor…)
- Kommentarsystem zu jeder Frage
- Fragenansicht und Klausuransicht verfügbar
- Klausur als PDF (und deren Lösungszettel)
- Lernen nach Fächern
- Auswertung der Klausur
- Tagsystem (zur einfachen Sortierung von Fragen)
- Newsletterfunktion
- Supportsystem per E-Mail

Crucio ist für Smartphone und Tablet angepasst, hat eine offene API und ist Open Source. Hört sich gut an?



## Installation

Crucio richtet sich an alle Fachschaften, die ihren Studierenden ein Online-Lern-System zur Verfügung stellen möchten. Falls ihr Crucio bei euch einführen möchtet, braucht ihr einen Server mit PHP und einer MySQL-Datenbank; diese kann man für unter (100€) im Jahr mieten. Falls ihr Hilfe bei der Einrichtung und Wartung braucht, könnt ihr euch gerne melden.


## Bugs & Wünsche
Wenn ihr Bugs gefunden habt, trägst sie Bitte unter Issues ein. Dafür Danke! Ihr könnt dort ebenso Wünsche für neue Features eintragen und ein bisschen an Crucio mitgestalten.


## Entwicklung
Falls ihr Bugs entfernen oder neue Features einbauen möchtet, seid ihr herzlich dazu eingeladen! Ein paar Hinweise zum Projekt:


### Sprachen
Crucio ist in PHP, HTML, Javascript, [LESS](http://lesscss.org) und MySQL geschrieben.

### Frameworks
Die wichtigsten Frameworks, auf denen Crucio basiert, sind [AngularJS](https://angularjs.org), [Bootstrap](http://getbootstrap.com) und [SLIM](http://www.slimframework.com).

### Workflow
Zur Entwicklung wird [NPM](https://www.npmjs.com) und [Grunt](http://gruntjs.com) verwendet. Letzteres wird hauptsächlich für den LESS-Compiler und für Minify & Concat Aktionen genutzt. Die beiden Tools sollten zur Entwicklung installiert sein, NPM kann als Teil von [NodeJS](https://nodejs.org) von deren Website heruntergeladen werden. Grunt kann dann über `npm install -g grunt-cli` installiert werden. Es kann über `grunt watch` gestartet werden, Änderungen werden dann sofort verarbeitet.


## Website
Die Website von Crucio ([pantor.github.io/Crucio/](http://pantor.github.io/Crucio/)) wird in dem Branch `gh-pages` entwickelt. Selbstverständlich dürft ihr auch gerne dazu beitragen!



## Lizenz
Crucio ist unter der GNU GENERAL PUBLIC LICENSE Version 2 verfügbar.