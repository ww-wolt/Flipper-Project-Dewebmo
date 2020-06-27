
## Spiel starten

1. Lokalen Server starten starten:  
    $ cd ".../Flipper-Project/Server  
    $ npm start 

2. Spiel starten  
    $ cd ".../Flipper-Project/Client 
    -> Live Server starten  
    -> Seite in Firefox öffnen! (Experimental Features müssen aktiviert sein)  
    (Chrome/Brave performt einiges langsamer und hat Scrolling-Probleme)


## Performance

Falls Rechner zu wenig Performance bietet und Spiel ruckelig läuft, lässt sich der Box-Shadow Blur der Linien anpassen, wodurch einiges weniger Zeit fürs Painting pro Frame benötigt wird.

**style.css**

Zeile 233:  
box-shadow: 0 0 4px 2px #2EFFF2 ->   
box-shadow: 0 0 0 2px #2EFFF2;

**Table.mjs**

Zeile 270:  
sheet.innerHTML = '.line{box-shadow: 0 0 4px 2px #FF45B5}' ->  
sheet.innerHTML = '.line{box-shadow: 0 0 0 2px #FF45B5}'


## Anmerkungen

Das Abrufen der der Highscores vom Server hat leider noch einen Bug, daher werden Beispieldaten angezeigt.
