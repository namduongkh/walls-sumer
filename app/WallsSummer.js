import Game from './libs/Game';
import { assignIn } from "lodash";
import { series } from "async";
import Bezier from 'bezier-js'

export default class WallsSummer extends Game {

    /*
    options = {
        screen,
        ctx,
        noop,
        cream,
        prize,
        plane,
        text,
        chessman,
        loopMs: 3000,
        moveStep: 100,
        fadeTimeout: 300,
        planeMoveTimeout: 300,
        config: {
            planeMovePosition,
            planeBezierPosition
        }
    }
    */
    constructor(options) {
        options = assignIn({
            loopMs: 3000,
            moveStep: 100,
            fadeTimeout: 300,
            planeMoveTimeout: 300
        }, options);
        super(options);
        this.getRootPlanePosition();
        this.initBeginState();
    }

    beforeLoop() {
        // console.log('beforeLoop');
        this.initBeginState();
    }

    inLoop() {
        // console.log('inLoop');
        setTimeout(() => {
            series([
                (cb) => {
                    this.fadeInComponent(this.options.cream, cb);
                },
                (cb) => {
                    this.fadeInComponent(this.options.prize, cb);
                },
                (cb) => {
                    this.fadeInComponent(this.options.text, cb);
                },
                (cb) => {
                    this.fadeInComponent(this.options.chessman, cb);
                },
                (cb) => {
                    this.movePlane();
                },
            ], () => {

            });
        }, 50);
    }

    initBeginState() {
        // console.log('initBeginState');
        this.options.plane.setPosition(this.rootPlanePosition.x, this.rootPlanePosition.y);
        this.hiddenComponent(this.options.cream);
        this.hiddenComponent(this.options.prize);
        this.hiddenComponent(this.options.text);
        this.hiddenComponent(this.options.chessman);
    }

    movePlane(cb = function() {}) {
        let curve = new Bezier(this.options.plane.position.x, this.options.plane.position.y,
            this.options.config.planeBezierPosition.x, this.options.config.planeBezierPosition.y,
            this.options.config.planeMovePosition.x, this.options.config.planeMovePosition.y);

        this.LUT = curve.getLUT(this.options.moveStep);

        if (this.movePlanInterval) {
            clearInterval(this.movePlanInterval);
        }
        let i = 0;
        this.movePlanInterval = setInterval(() => {
            // this.options.plane.setPosition(this.LUT[i].x, this.LUT[i].y);
            this.options.plane.animateAction(this.ctx, {
                properties: {
                    position: {
                        x: this.LUT[i].x,
                        y: this.LUT[i].y
                    }
                },
                duration: 0,
                timingFunction: 'linear'
            }, this.noop);
            i++;
            if (i >= this.LUT.length) {
                clearInterval(this.movePlanInterval);
            }
        }, this.options.planeMoveTimeout / this.options.moveStep);

        setTimeout(cb, this.options.planeMoveTimeout)
    }

    getRootPlanePosition() {
        this.rootPlanePosition = this.options.plane.position;
    }

    fadeInComponent(component, cb = function() {}) {
        if (component) {
            component.animateAction(this.ctx, {
                properties: {
                    opacity: 1,
                },
                duration: this.options.fadeTimeout,
                timingFunction: 'linear'
            }, this.noop);
            setTimeout(cb, this.options.fadeTimeout);
        } else {
            cb();
        }
    }

    hiddenComponent(component) {
        if (component) {
            component.setOpacity(0);
        }
    }
}