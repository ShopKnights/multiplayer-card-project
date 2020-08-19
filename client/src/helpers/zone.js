export default class Zone {
    constructor(scene) {
        this.renderZoneDrop = () => {
            let dropZone = scene.add.zone(500, 375, 600, 250).setRectangleDropZone(600, 250);
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        this.renderZoneGrave1 = () => {
            let dropZone = scene.add.zone(1200, 175, 600, 250).setRectangleDropZone(600, 250);
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        this.renderZoneGrave2 = () => {
            let dropZone = scene.add.zone(1200, 575, 600, 250).setRectangleDropZone(600, 250);
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xff69b4);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
        }
        
    }
}