import { assignIn } from 'lodash';
import GameEventEmitter from './GameEventEmitter';

export default class ScreenObjectExample {

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} width 
     * @param {*} height 
     * @param {*} options 
     */
    constructor(ctx, x = 0, y = 0, width = 0, height = 0, options = {}) {
        let config = assignIn({
            ctx,
            position: { x, y },
            size: { width, height }
        }, options);

        for (let i in config) {
            this[i] = config[i];
        }

        if (this.dragBound) {
            this.dragBound.x = this.ctx.root.x + this.dragBound.x;
            this.dragBound.y = this.ctx.root.y + this.dragBound.y;
            this.dragBound.right = this.dragBound.x + this.dragBound.w;
            this.dragBound.bottom = this.dragBound.y + this.dragBound.h;
        }

        this.emitter = GameEventEmitter.getInstance();

        this.emitter.on('afterInit', () => {
            this.draw();
        });

        this.emitter.on('inLoop', () => {
            this.playing = true;
            this.draw();
            this.playing = false;
        });

        this.onDrag();
    }

    showAction(ctx, argv, noop) {}
    hideAction(ctx, argv, noop) {}
    setTextAction(ctx, argv, noop) {
        // this.element.getElementsByClassName('value')[0].innerText = (argv.text || '');
        this.text = argv.text;
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;

        // this.element.style.top = y + 'px';
        // this.element.style.left = x + 'px';

        // if (this.ctx) {
        //     this.draw();
        // }
    }

    getCanvasPosition() {
        let x = this.ctx.root.x + this.position.x;
        let y = this.ctx.root.y + this.position.y;
        return {
            x: x,
            y: y,
            midX: x + this.size.width / 2,
            midY: y + this.size.height / 2,
            right: x + this.size.width,
            bottom: y + this.size.height,
        }
    }

    draw(x, y) {
        x = x || this.position.x;
        y = y || this.position.y;

        if (this.ctx) {
            let canvasPosition = this.getCanvasPosition();
            // console.log('draw screen object');
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(canvasPosition.x, canvasPosition.y, this.size.width, this.size.height);
            this.ctx.fillStyle = 'lime';
            this.ctx.fillRect(canvasPosition.x + 1, canvasPosition.y + 1, this.size.width - 2, this.size.height - 2);
            if (this.dragBound) {
                this.drawRect(this.dragBound.x, this.dragBound.y, this.dragBound.w, this.dragBound.h);
            }

            this.ctx.fillStyle = "#000";
            this.ctx.font = "13px Arial";
            this.ctx.textAlign = "center";

            if (this.image) {
                this.ctx.clearRect(canvasPosition.x + 1, canvasPosition.y + 1, this.size.width - 2, this.size.height - 2);
                let image = new Image();
                image.src = this.image;
                this.ctx.drawImage(image, canvasPosition.x + 1, canvasPosition.y + 1, this.size.width - 2, this.size.height - 2);
            } else {

                this.ctx.fillText((this.name || ''), canvasPosition.midX, canvasPosition.midY);
            }
            this.ctx.fillText((this.text || ''), canvasPosition.midX, canvasPosition.midY + 15);
        }
    }

    onDrag() {
        this.emitter.on('screenMouseMoving', (data) => {
            if (this.onDragging && this.ctx) {
                let { e, moved } = data;
                let canvasPosition = this.getCanvasPosition();

                if (this.dragBound) {
                    if (canvasPosition.x >= this.dragBound.x && canvasPosition.x <= this.dragBound.right &&
                        canvasPosition.y >= this.dragBound.y && canvasPosition.y <= this.dragBound.bottom) {

                        if (canvasPosition.x + moved.x < this.dragBound.x || canvasPosition.right + moved.x > this.dragBound.right) {
                            moved.x = 0;
                        }
                        if (canvasPosition.y + moved.y < this.dragBound.y || canvasPosition.bottom + moved.y > this.dragBound.bottom) {
                            moved.y = 0;
                        }

                        this.setPosition(this.position.x + moved.x, this.position.y + moved.y);
                    }
                } else {
                    this.setPosition(this.position.x + moved.x, this.position.y + moved.y);
                }
                // if (!this.playing) {
                this.draw();
                // }
            }
        });

        this.emitter.on('screenMouseDown', (e) => {
            if (this.ctx) {
                let mousePosition = {
                    x: e.offsetX,
                    y: e.offsetY
                };

                let canvasPosition = this.getCanvasPosition();

                if (canvasPosition.x <= mousePosition.x && canvasPosition.right >= mousePosition.x &&
                    canvasPosition.y <= mousePosition.y && canvasPosition.bottom >= mousePosition.y) {

                    this.onDragging = true;
                }
            }
        });

        this.emitter.on('screenMouseUp', (e) => {
            this.onDragging = false;
        });
    }

    drawRect(x, y, w, h) {
        if (this.ctx) {
            this.ctx.beginPath();
            this.ctx.lineWidth = "1";
            this.ctx.strokeStyle = "#000";
            this.ctx.rect(x, y, w, h);
            this.ctx.stroke();
        }
    }
}