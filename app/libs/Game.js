import { assignIn } from 'lodash';
import GameEventEmitter from './GameEventEmitter';

export default class Game {

    /**
     * 
     * @param {*} options 
     */
    constructor(options = {}) {
        this.emitter = GameEventEmitter.getInstance();
        this.playing = false;
        this.options = assignIn({
            screen: {
                size: {
                    width: 320,
                    height: 400
                }
            },
            ctx: {},
            noop: function() {},
            loopMs: 0,
        }, options);
        this.initCallbacks();
        this.emitEvent('afterInit');
    }

    initCallbacks() {
        this.onEvent('beforeStart', this.beforeStart);
        this.onEvent('afterStart', this.afterStart);
        this.onEvent('beforeLoop', this.beforeLoop);
        this.onEvent('inLoop', this.inLoop);
        this.onEvent('afterLoop', this.afterLoop);
        this.onEvent('beforeStop', this.beforeStop);
        this.onEvent('afterStop', this.afterStop);
    }

    onEvent(eventName, callback = function() {}) {
        this.emitter.on(eventName, callback.bind(this));
    }

    emitEvent(eventName, data) {
        this.emitter.emit(eventName, data);
    }

    start() {
        this.emitEvent('beforeStart');
        if (!this.playing) {
            this.playing = true;
            requestAnimationFrame(this.loop.bind(this));
        }
        this.emitEvent('afterStart');
    }

    stop() {
        this.emitEvent('beforeStop');
        this.playing = false;
        this.emitEvent('afterStop');
    }

    // continue () {
    //     if (!this.playing) {
    //         this.playing = true;
    //         // requestAnimationFrame(this.loop.bind(this));
    //     }
    // }

    // pause() {
    //     this.playing = false;
    // }

    loop() {
        if (!this.playing) {
            return;
        }
        setTimeout(() => {
            this.emitEvent('beforeLoop');
            this.emitEvent('inLoop');
            requestAnimationFrame(this.loop.bind(this));
            this.emitEvent('afterLoop');
        }, this.options.loopMs);
    }

    // draw() {
    //     // let screenElem = document.getElementById('game-screen');
    //     // screenElem.style.width = this.options.screen.size.width + 'px';
    //     // screenElem.style.height = this.options.screen.size.height + 'px';
    //     this.options.ctx.fillStyle = "#fff";
    //     this.options.ctx.fillRect(this.options.ctx.root.x, this.options.ctx.root.y, this.options.screen.size.width, this.options.screen.size.height);
    // }
}