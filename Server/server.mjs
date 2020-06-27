import * as fs from 'fs';
import express from 'express';
const app = express();

app.get('/', function (req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    fs.readFile('highscores.json', 'utf8', (err, data) => {
        
        if (err) {
            console.log('Error: ' + err);
            res.write('Error: '+ err);
            return;
        }else{
            const highScores = JSON.parse(data);
            const newScore = Number(req.query.score);
            const newName = req.query.name;
            let insertPos = 9999;

            for (let i=0; i<highScores.length; i++){
                if (newScore >= highScores[i].score){
                  insertPos = i;
                  break
                };
            }
            // Neuer Score in Array einfügen
            highScores.splice(insertPos,0,{"score":newScore, "name": newName});
            // letzter Score wegschneiden
            highScores.splice(5,1);
            res.json(highScores);

            fs.writeFile('highscores.json', JSON.stringify(highScores) , (err) => {
                if (err){
                  console.log('Error: ' + err);
                  res.write('Error: '+ err);
                } else {
                  console.log('Wrote new highscore');
                }
            });
        }
    });
});
  
app.listen(8080, function () {
    console.log('Flipper Server listening on port 8080!');
});
  