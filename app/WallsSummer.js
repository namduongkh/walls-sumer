import Game from './libs/Game';
import _ from "lodash";
import async from "async";
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
        prizeAnimateTimeout: 300,
        prizeAnimateConfig: {}
        texts: []
        config: {
            planeMove,
            planeBezier,
            prizeDrop,
            prizeDropMode,
            planeRoot
        }
    }
    */
    constructor(options) {
        options = _.assignIn({
            loopMs: 3000,
            moveStep: 100,
            fadeTimeout: 300,
            planeMoveTimeout: 300,
            dropTimeout: 300,
            prizeAnimateTimeout: 300,
            prizeAnimateConfig: {
                shakeDeg: 3,
                shakeTimes: 10,
                maxZoom: 1.1,
                shakeDelay: 0,
                fadeInTime: 100
            }
        }, options);
        super(options);
        this.getRootPlanePosition();
        this.getRootPrizePosition();
        this.initBeginState();

        // let style = document.createElement('style');
        // style.innerHTML = `
        //     @keyframes shake {
        //         0% { transform: translate(1px, 1px) rotate(0deg); }
        //         10% { transform: translate(-1px, -2px) rotate(-1deg); }
        //         20% { transform: translate(-3px, 0px) rotate(1deg); }
        //         30% { transform: translate(3px, 2px) rotate(0deg); }
        //         40% { transform: translate(1px, -1px) rotate(1deg); }
        //         50% { transform: translate(-1px, 2px) rotate(-1deg); }
        //         60% { transform: translate(-3px, 1px) rotate(0deg); }
        //         70% { transform: translate(3px, 1px) rotate(-1deg); }
        //         80% { transform: translate(-1px, -1px) rotate(1deg); }
        //         90% { transform: translate(1px, 2px) rotate(0deg); }
        //         100% { transform: translate(1px, -2px) rotate(-1deg); }
        //     }
        //     .shake-ani {
        //         animation: shake 0.5s; 
        //         animation-iteration-count: infinite;
        //     }
        // `;

        // document.head.appendChild(style);
    }

    beforeLoop() {
        // console.log('beforeLoop');
        this.initBeginState();
    }

    inLoop() {
        // console.log('inLoop');
        setTimeout(() => {
            async.series([
                (cb) => {
                    this.fadeInComponent(this.options.cream, this.options.fadeTimeout, cb);
                },
                (cb) => {
                    if (!this.options.config.prizeDropMode) {
                        this.prizeAnimate(this.options.prize, this.options.prizeAnimateTimeout, cb)
                    } else {
                        this.dropComponent(this.options.prize, this.options.config.prizeDrop, cb);
                    }
                },
                (cb) => {
                    this.fadeInComponent(this.options.texts, this.options.fadeTimeout, cb);
                },
                (cb) => {
                    this.fadeInComponent(this.options.chessman, this.options.fadeTimeout, cb);
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
        this.hiddenComponent(this.options.texts);
        this.hiddenComponent(this.options.chessman);
        if (!this.options.config.prizeDropMode) {
            this.hiddenComponent(this.options.prize);
        } else {
            this.options.prize.setPosition(this.rootPrizePosition.x, this.rootPrizePosition.y);
        }
    }

    movePlane(cb = () => {}) {
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
        //     this.options.plane.animateAction(this.options.ctx, {
        //         properties: {
        //             position: {
        //                 x: this.LUT[i].x,
        //                 y: this.LUT[i].y
        //             }
        //         },
        //         duration: 0,
        //         timingFunction: 'linear'
        //     }, this.options.noop);
        //     i++;
        //     if (i >= this.LUT.length) {
        //         clearInterval(this.movePlanInterval);
        //     }
        // }, intervaMs);

        this.options.plane.animateAction(this.options.ctx, {
            properties: {
                position: {
                    x: this.options.config.planeMovePosition.x,
                    y: this.options.config.planeMovePosition.y,
                }
            },
            duration: this.options.planeMoveTimeout,
            timingFunction: 'ease-out'
        }, this.options.noop);

        setTimeout(cb, this.options.planeMoveTimeout)
    }

    getRootPlanePosition() {
        let planeRoot = this.options.screen.find('planeroot');
        this.rootPlanePosition = planeRoot ? planeRoot.position : this.options.plane.position;
    }

    getRootPrizePosition() {
        this.rootPrizePosition = this.options.prize.position;
    }

    fadeInComponent(component, timeout, cb = () => {}) {
        let that = this;

        function fadeIn(com, time) {
            com.animateAction(that.options.ctx, {
                properties: {
                    opacity: 1,
                    // size: {
                    //     width: component.size.width,
                    //     height: component.size.height,
                    // }
                },
                duration: time,
                // timingFunction: ''
            }, that.options.noop);
        }
        if (component) {
            // console.log('size', component.size.width, component.size.height);
            // component.setSize(component.size.width, component.size.height);
            if (Array.isArray(component)) {
                async.series(_.map(component, (com) => {
                    return (c) => {
                        fadeIn(com, timeout / component.length);
                        setTimeout(c, timeout / component.length);
                    }
                }));
            } else {
                fadeIn(component, timeout);
            }
            setTimeout(cb, timeout);
        } else {
            cb();
        }
    }

    prizeAnimate(component, timeout, cb = () => {}) {
        if (component) {
            let that = this;
            that.fadeInComponent(component, this.options.prizeAnimateConfig.fadeInTime);
            setTimeout(function() {
                that.shakeComponent(component, timeout - that.options.prizeAnimateConfig.shakeDelay);
            }, that.options.prizeAnimateConfig.shakeDelay);
            setTimeout(cb, timeout);
        } else {
            cb();
        }
    }

    shakeComponent(component, timeout, cb = () => {}) {
        if (component) {
            let that = this;

            component.getNode(() => {
                function shake(i, positive, timeout, deg) {
                    // component.animateAction(that.options.ctx, {
                    //     properties: {
                    //         rotation: positive ? deg : -deg,
                    //     },
                    //     duration: timeout - (timeout / 100 * 10),
                    // }, that.options.noop);
                    let transform = component.node.style.transform.replace(/rotate\(-{0,1}\d+deg\)/gi, "");
                    component.css(component.node, {
                        transform: transform + ' rotate(' + (positive ? deg : -deg) + 'deg)'
                    });
                    if (i > 1) {
                        setTimeout(() => {
                            shake(i - 1, !positive, timeout, deg);
                        }, timeout);
                    } else {
                        component.css(component.node, {
                            transform: transform + ' rotate(' + 0 + 'deg)'
                        });
                    }
                }

                shake(that.options.prizeAnimateConfig.shakeTimes,
                    true, timeout / that.options.prizeAnimateConfig.shakeTimes,
                    that.options.prizeAnimateConfig.shakeDeg);

                // component.node.className = component.node.className += ' shake-ani';
            });

            setTimeout(cb, timeout);
        } else {
            cb();
        }
    }

    // zoomComponent(component, timeout, cb = () => {}) {
    //     if (component) {

    //     } else {
    //         cb();
    //     }
    // }

    hiddenComponent(component) {
        let that = this;

        function hidden(com) {
            com.animateAction(that.options.ctx, {
                properties: {
                    opacity: 0,
                },
                duration: 0,
            }, that.options.noop);
        }
        if (component) {
            if (Array.isArray(component)) {
                _.each(component, (com) => {
                    hidden(com);
                });
            } else {
                // component.setOpacity(0);
                // component.animateAction(this.options.ctx, {
                //     properties: {
                //         opacity: 0,
                //     },
                //     duration: 0,
                // }, this.options.noop);
                hidden(component);
            }
        }
    }

    dropComponent(component, dropPositionComponent, cb = () => {}) {
        if (component && dropPositionComponent) {
            let dropPosition = {
                x: dropPositionComponent.position.x,
                y: dropPositionComponent.position.y,
            }
            component.animateAction(this.options.ctx, {
                properties: {
                    position: dropPosition,
                },
                duration: this.options.dropTimeout,
                // timingFunction: 'ease-in'
            }, this.options.noop);
            setTimeout(cb, this.options.dropTimeout);
        } else {
            cb();
        }
    }
}