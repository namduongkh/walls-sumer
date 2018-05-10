import EventEmitter from "events";

export default class GameEventEmitter extends EventEmitter {
    static getInstance() {
        if (!this.instance) {
            this.instance = new GameEventEmitter();
        }
        return this.instance;
    }
}