
import Card from './card';

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            //var  deal_num = parseInt(window.prompt("Please enter How many cards you would like to deal: "));
            //const myGame = new Game();
            //let playerSprite;
            let opponentSprite;
            if (scene.isPlayerA) {
                    opponentSprite = 'domino-back';
            } else {
                    opponentSprite = 'domino-back';
            };
            for (let i = 0; i < 7; i++) {
                let playerCard = new Card(scene);
                    playerCard.render(175 + (i * 100), 650, (Math.floor(Math.random() * 51) + 1).toString());
                let opponentCard = new Card(scene);
                    scene.opponentCards.push(opponentCard.render(175 + (i * 100), 125, opponentSprite).disableInteractive());
            }
        }
    }
}