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
        dropTimeout: 300,
        config: {
            planeMove,
            planeBezier,
            prizeDrop,
            prizeDropMode
        }
    }
    */
    constructor(options) {
        options = assignIn({
            loopMs: 3000,
            moveStep: 100,
            fadeTimeout: 300,
            planeMoveTimeout: 300,
            dropTimeout: 300
        }, options);
        super(options);
        this.getRootPlanePosition();
        this.getRootPrizePosition();
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
                    if (!this.options.config.prizeDropMode) {
                        this.fadeInComponent(this.options.prize, cb);
                    } else {
                        this.dropComponent(this.options.prize, this.options.config.prizeDrop, cb);
                    }
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
        }, 100);
    }

    initBeginState() {
        // console.log('initBeginState');
        this.options.plane.setPosition(this.rootPlanePosition.x, this.rootPlanePosition.y);
        this.hiddenComponent(this.options.cream);
        this.hiddenComponent(this.options.text);
        this.hiddenComponent(this.options.chessman);
        if (!this.options.config.prizeDropMode) {
            this.hiddenComponent(this.options.prize);
        } else {
            this.options.prize.setPosition(this.rootPrizePosition.x, this.rootPrizePosition.y);
        }
    }

    movePlane(cb = function() {}) {
        this.options.config.planeMovePosition = this.options.config.planeMove.position;
        this.options.config.planeBezierPosition = this.options.config.planeBezier.position;

        // let curve = new Bezier(this.options.plane.position.x, this.options.plane.position.y,
        //     this.options.config.planeBezierPosition.x, this.options.config.planeBezierPosition.y,
        //     this.options.config.planeMovePosition.x, this.options.config.planeMovePosition.y);

        // this.LUT = curve.getLUT(this.options.moveStep);

        // if (this.movePlanInterval) {
        //     clearInterval(this.movePlanInterval);
        // }
        // let i = 0;
        // let intervaMs = this.options.planeMoveTimeout / this.options.moveStep;
        // this.movePlanInterval = setInterval(() => {
        //     // this.options.plane.setPosition(this.LUT[i].x, this.LUT[i].y);
        //     this.options.plane.animateAction(this.ctx, {
        //         properties: {
        //             position: {
        //                 x: this.LUT[i].x,
        //                 y: this.LUT[i].y
        //             }
        //         },
        //         duration: 0,
        //         timingFunction: 'linear'
        //     }, this.noop);
        //     i++;
        //     if (i >= this.LUT.length) {
        //         clearInterval(this.movePlanInterval);
        //     }
        // }, intervaMs);

        this.options.plane.animateAction(this.ctx, {
            properties: {
                position: {
                    x: this.options.config.planeMovePosition.x,
                    y: this.options.config.planeMovePosition.y,
                }
            },
            duration: this.options.planeMoveTimeout,
            timingFunction: 'ease-in-out'
        }, this.noop);

        setTimeout(cb, this.options.planeMoveTimeout)
    }

    getRootPlanePosition() {
        this.rootPlanePosition = this.options.plane.position;
    }

    getRootPrizePosition() {
        this.rootPrizePosition = this.options.prize.position;
    }

    fadeInComponent(component, cb = function() {}) {
        if (component) {
            // console.log('size', component.size.width, component.size.height);
            // component.setSize(component.size.width, component.size.height);
            component.animateAction(this.ctx, {
                properties: {
                    opacity: 1,
                    // size: {
                    //     width: component.size.width,
                    //     height: component.size.height,
                    // }
                },
                duration: this.options.fadeTimeout,
                // timingFunction: ''
            }, this.noop);
            setTimeout(cb, this.options.fadeTimeout);
        } else {
            cb();
        }
    }

    hiddenComponent(component) {
        if (component) {
            // component.setOpacity(0);
            component.animateAction(this.ctx, {
                properties: {
                    opacity: 0,
                },
                duration: 0,
            }, this.noop);
        }
    }

    dropComponent(component, dropPositionComponent, cb = function() {}) {
        if (component && dropPositionComponent) {
            let dropPosition = {
                x: dropPositionComponent.position.x,
                y: dropPositionComponent.position.y,
            }
            component.animateAction(this.ctx, {
                properties: {
                    position: dropPosition,
                },
                duration: this.options.dropTimeout,
                // timingFunction: 'ease-in'
            }, this.noop);
            setTimeout(cb, this.options.dropTimeout);
        } else {
            cb();
        }
    }
}