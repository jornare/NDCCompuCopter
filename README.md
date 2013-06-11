NDCCompuCopter
==============

Publikum kan selv sende kommandoer til dronen via tweets tagget med #computasndc.

En kommando kan enten være en enkel eller json. 

Enkle kommandoer kan være:
* dance
* wave
* flip
* turnaround
* greenRed

En json kommando kan enten få dronen til å gjøre en bevegelse eller diverse blinking med lys, f.eks.:
* Bevegelse:
      { "animate": { "animation": "thetaDance", "duration": 2000} }
* Blinking med lys:
      { "animateLeds": { "animation": "blinkGreenRed", "hz": 5, "duration": 2} }

Se [dokumentasjon på github](https://github.com/felixge/node-ar-drone) for mulige kommandoer.

Operasjon av drone
------------------

For å ha rimelig kontroll, kan dronen kun ta i mot en kommando om gangen. Mellom hver kommando lander dronen.

*Klargjøring mellom hver tweet*
Når dronen er klar til å ta i mot neste kommando, trykker operatøren '!' i konsolet for serveren. Når kommandoen er utført, trykkes '!' en gang til for å hindre flere kommandoer i å bli utført.

Mellom hver kommando må dronen plasseres på midterste markør.

*Noen mulige feilsituajoner:*
* Alle lamper på dronen lyser rødt. Trykk 'R' i konsolet for å resette dronen.
* Ingenting skjer:
  * Bytt batteri på dronen og sett det gamle til lading
  * Sjekk at pc er koblet på fastnett
  * Sjekk at pc har trådløs forbindelse til drone: ar-drone...
  * Restart node-server: ^C for evt. å stoppe og node app.js for å starte igjen

Installasjon
------------

* install git, tortoiseGit
* install node.js (nodejs.org)
* install packages: npm install
* install supervisor package: npm install -g supervisor
* run server: node app.js



