import Card from '../helpers/card';
import Zone from '../helpers/zone';
import io from 'socket.io-client';
import Dealer from '../helpers/dealer';

export default class Game extends Phaser.Scene{
    constructor() {
        super({
            key: 'Game'
        });
    }
    preload(){
        this.load.image('domino-back','src/assets/war_game.jpg');
        for(var i =0; i<51; i++)
        {
            this.load.image((i+1).toString(),'src/assets/row-1-col-'.concat((i+1).toString()).concat('.jpg'));
        }
        this.load.audio('main_beat','src/assets/[FREE FOR PROFIT] Japanese X NF Type Beat Strings Prod. Fusion.mp3');
        this.load.audio('card_shuffle','src/assets/Sport - Deck of Cards Dealing Sound Effect-[AudioTrimmer.com].mp3');
    }

    create() {
        //var  deal_num = parseInt(window.prompt("Please enter How many cards you would like to deal: "));
        const config2 = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
                };
                
        
        var main_track = this.sound.add('main_beat', config2);
        var cardsound = this.sound.add('card_shuffle', config2);
        main_track.play();
        
        this.isPlayerA = false;
        this.opponentCards = [];

        this.zoneDrop = new Zone(this);
        this.dropZoneDrop = this.zoneDrop.renderZoneDrop();
        this.outlineDrop = this.zoneDrop.renderOutline(this.dropZoneDrop);

        this.zoneGrave1 = new Zone(this);
        this.dropZoneGrave1 = this.zoneGrave1.renderZoneGrave1();
        this.outlineGrave1 = this.zoneGrave1.renderOutline(this.dropZoneGrave1);
        this.dropZoneGrave1.disableInteractive();

        this.zoneGrave2 = new Zone(this);
        this.dropZoneGrave2 = this.zoneGrave2.renderZoneGrave2();
        this.outlineGrave2 = this.zoneGrave2.renderOutline(this.dropZoneGrave2);
        this.dropZoneGrave2.disableInteractive();


        this.dealer = new Dealer(this);

        let self = this;

        this.socket = io('http://localhost:3000');

        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function () {
            //cardsound.play();
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        })
        
        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZoneDrop.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZoneDrop.x - 350) + (self.dropZoneDrop.data.values.cards * 50)), (self.dropZoneDrop.y), sprite).disableInteractive();
            }
        })

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealText.on('pointerdown', function () {
            //var deal_num = parseInt(window.prompt("Please enter How many cards you would like to deal: "));
            self.socket.emit("dealCards");
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZoneDrop) {
            dropZoneDrop.data.values.cards++;
            gameObject.x = (dropZoneDrop.x - 250) + (dropZoneDrop.data.values.cards * 50);
            gameObject.y = dropZoneDrop.y;
            gameObject.disableInteractive();
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
        })


    }

    update() {

    }
}
