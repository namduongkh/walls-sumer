import Game from './libs/Game';
import _ from "lodash";
import async from "async";
import Bezier from 'bezier-js'

export default class WallsSummer extends Game {

    /*
    options = {
        screen: screen,
        ctx: ctx,
        noop: noop,
        cream: screen.find('cream'),
        plane: screen.find('plane'),
        texts: [
            screen.find('text'),
            screen.find('text_2'),
            screen.find('text_3'),
        ],
        prize: screen.find('prize'),
        loopDuration: 6000,
        fadeDuration: 1000,
        prizeAnimate: {
            duration: 750,
            shakeDeg: 1.5,
            shakeTimes: 10,
            maxZoom: 1.1,
            shakeDelay: 0,
            fadeInDuration: 300,
        },
        flare: screen.find('flarelight'),
        flareAnimate: {
            duration: 500,
            baseComponentName: 'text_3',
            rootPositionName: 'flarelightpos'
        },
        planeMove: {
            movePositionComponent: screen.find('planemovehere'),
            duration: 750
        },
        config: {
            
        }
    */
    constructor(options) {
        options = _.assignIn({
            loopDuration: 3000,
            moveStep: 100,
            fadeDuration: 300,
            prizeAnimate: {
                shakeDeg: 3,
                shakeTimes: 10,
                maxZoom: 1.1,
                shakeDelay: 0,
                fadeInDuration: 100,
                duration: 500
            },
            config: {}
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
                    this.fadeInComponent(this.options.cream, this.options.fadeDuration, cb);
                },
                (cb) => {
                    // if (!this.options.config.prizeDropMode) {
                    this.prizeAnimate(this.options.prize, cb);
                    // } else {
                    //     this.dropComponent(this.options.prize, this.options.config.prizeDrop, cb);
                    // }
                },
                (cb) => {
                    this.fadeInComponent(this.options.texts, this.options.textDuration, cb);
                },
                // (cb) => {
                //     this.fadeInComponent(this.options.chessman, this.options.fadeDuration, cb);
                // },
                (cb) => {
                    cb();
                    // this.zoomInOutComponent(this.options.zoomInOut.component, this.options.zoomInOut.duration, this.options.zoomInOut.percent, cb);
                },
                (cb) => {
                    this.movePlane(cb);
                },
                (cb) => {
                    this.flareAnimate(this.options.flare, cb);
                },
            ], () => {

            });
        }, 100);
    }

    initBeginState() {
        // console.log('initBeginState');
        this.getRootPlanePosition();
        this.options.plane.setPosition(this.rootPlanePosition.x, this.rootPlanePosition.y);
        this.hiddenComponent(this.options.cream);
        this.hiddenComponent(this.options.texts);
        // this.hiddenComponent(this.options.chessman);
        // if (!this.options.config.prizeDropMode) {
        // console.log('this.options.prize', this.options.prize);
        this.hiddenComponent(this.options.prize);
        // } else {
        //     this.options.prize.setPosition(this.rootPrizePosition.x, this.rootPrizePosition.y);
        // }
        if (this.options.flare) {
            this.resetFlare(this.options.flare);
            // let baseComponent = this.options.screen.find(this.options.flareAnimate.baseComponentName);
            // this.hiddenComponent(baseComponent);
        }
    }

    movePlane(cb = () => {}) {
        // this.options.config.planeMovePosition = this.options.config.planeMove.position;
        // this.options.config.planeBezierPosition = this.options.config.planeBezier.position;

        let planeMovePosition = this.options.planeAnimate.movePositionComponent.position;

        // let curve = new Bezier(this.options.plane.position.x, this.options.plane.position.y,
        //     this.options.config.planeBezierPosition.x, this.options.config.planeBezierPosition.y,
        //     this.options.config.planeMovePosition.x, this.options.config.planeMovePosition.y);

        // this.LUT = curve.getLUT(this.options.moveStep);

        // if (this.movePlanInterval) {
        //     clearInterval(this.movePlanInterval);
        // }
        // let i = 0;
        // let intervaMs = this.options.planeAnimateTimeout / this.options.moveStep;
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
                    x: planeMovePosition.x,
                    y: planeMovePosition.y,
                }
            },
            duration: this.options.planeAnimate.duration,
            timingFunction: 'ease-out'
        }, this.options.noop);

        setTimeout(cb, this.options.planeAnimate.duration)
    }

    getRootPlanePosition() {
        let planeRoot = this.options.screen.find(this.options.planeAnimate.rootName);
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

    prizeAnimate(component, cb = () => {}) {
        let duration = this.options.prizeAnimate && this.options.prizeAnimate.duration ? this.options.prizeAnimate.duration : 500;
        if (component) {
            let that = this;
            that.fadeInComponent(component, this.options.prizeAnimate.fadeInDuration);
            setTimeout(function() {
                that.shakeComponent(component, duration - that.options.prizeAnimate.shakeDelay);
            }, that.options.prizeAnimate.shakeDelay);
            setTimeout(cb, duration);
        } else {
            cb();
        }
    }

    shakeComponent(component, timeout, cb = () => {}) {
        if (component) {
            let that = this;
            let posComponent = this.options.screen.find(this.options.prizeAnimate.prizePosName);
            component.getNode(() => {
                function shake(i, positive, timeout, deg) {
                    // component.animateAction(that.options.ctx, {
                    //     properties: {
                    //         rotation: positive ? deg : -deg,
                    //     },
                    //     duration: timeout - (timeout / 100 * 10),
                    // }, that.options.noop);
                    // console.log('before',  component.node.style.transform);
                    let transform = component.node.style.transform.toString().replace(/rotate\([-]{0,1}[\d\.]+deg\)/gi, "");
                    // console.log('after', transform);
                    component.css(component.node, {
                        transform: transform + ' rotate(' + (positive ? deg : -deg) + 'deg)',
                        transition: 'transform ' + (timeout * 0.9) / 1000 + 's linear'
                    });
                    if (i > 1) {
                        setTimeout(() => {
                            shake(i - 1, !positive, timeout, deg);
                        }, timeout);
                    } else {
                        component.css(component.node, {
                            transform: transform + ' rotate(' + 0 + 'deg)',
                            transition: 'transform ' + (timeout * 0.9) / 1000 + 's linear'
                        });
                    }
                }

                shake(that.options.prizeAnimate.shakeTimes,
                    true, timeout / that.options.prizeAnimate.shakeTimes,
                    that.options.prizeAnimate.shakeDeg);

                // component.node.className = component.node.className += ' shake-ani';
            });

            async.series([(c) => {
                    component.scaleAction(this.options.ctx, {
                        scale: 110,
                        duration: timeout / 2,
                        // timingFunction: 'ease-in-out'
                    }, c);
                },
                (c) => {
                    component.scaleAction(this.options.ctx, {
                        scale: 90.909090909090,
                        duration: timeout / 2,
                        // timingFunction: 'ease-in-out'
                    }, c);
                },
                (c) => {
                    component.setPosition(posComponent.position.x, posComponent.position.y);
                    c();
                }
            ]);

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

    flareAnimate(flare, cb = () => {}) {
        if (flare) {
            let that = this;
            let baseComponent = that.options.screen.find(that.options.flareAnimate.baseComponentName);

            // that.hiddenComponent(baseComponent);
            // setTimeout(() => {
            // that.fadeInComponent(baseComponent, that.options.flareAnimate.duration);
            // }, 50);

            async.series([
                (c) => {
                    // console.log('show');
                    flare.animateAction(that.options.ctx, {
                        properties: {
                            opacity: 1
                        },
                        duration: (that.options.flareAnimate.duration || 500) * 0.1,
                    }, c);
                },
                (c) => {
                    // console.log('move');
                    flare.animateAction(that.options.ctx, {
                        properties: {
                            position: {
                                // x: flare.position.x + baseComponent.size.width,
                                x: baseComponent.position.x + baseComponent.size.width + flare.size.width,
                                y: flare.position.y
                            }
                        },
                        timingFunction: 'ease-in-out',
                        duration: (that.options.flareAnimate.duration || 500) * 0.8,
                    }, c);
                },
                (c) => {
                    // console.log('hide');
                    flare.animateAction(that.options.ctx, {
                        properties: {
                            opacity: 0
                        },
                        duration: (that.options.flareAnimate.duration || 500) * 0.1,
                    }, c);
                },
                (c) => {
                    // let rootPosition = that.options.screen.find(rootPositionName);
                    // flare.setPosition(rootPosition.x, rootPosition.y);
                    that.resetFlare(flare);
                    c();
                },
            ]);

            setTimeout(cb, that.options.flareAnimate.duration);
        } else {
            cb();
        }
    }

    resetFlare(flare) {
        this.hiddenComponent(flare);
        // let rootPosition = this.options.screen.find(this.options.flareAnimate.rootPositionName);
        let baseComponent = this.options.screen.find(this.options.flareAnimate.baseComponentName);
        flare.setPosition(baseComponent.position.x - flare.size.width, baseComponent.position.y);
    }

    zoomInOutComponent(component, duration, zoomPercent, cb = () => {}) {
        if (component) {
            let posComponent = this.options.screen.find(this.options.zoomInOut.rootPosName);
            async.series([
                (c) => {
                    component.scaleAction(this.options.ctx, {
                        scale: zoomPercent,
                        duration: duration / 2,
                    }, c);
                },
                (c) => {
                    component.scaleAction(this.options.ctx, {
                        scale: 100 / (zoomPercent / 100),
                        duration: duration / 2,
                    }, c);
                },
                (c) => {
                    component.setPosition(posComponent.position.x, posComponent.position.y);
                    c();
                }
            ]);
            setTimeout(cb, duration);
        } else {
            cb();
        }
    }
}