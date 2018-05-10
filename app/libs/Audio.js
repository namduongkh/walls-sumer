export default class Audio {

    constructor(src, id) {
        this.id = id;
        this.src = src;

        this.element = document.createElement("AUDIO");

        this.element.setAttribute("id", this.id);
        this.element.setAttribute("src", global.siteUrl + this.src);
        this.element.setAttribute("style", "width:0px;height:0px;opacity:0;position:fixed;top:-100%;left:-100%");

        this.element.setAttribute("controls", "controls");
    }

    /**
     * 
     * @param {object} attrs Attributes of Audio Object
     */
    embed(attrs) {
        for (let attr in attrs) {
            this.element.setAttribute(attr, attrs[attr]);
        }
        document.body.appendChild(this.element);
    }

    play() {
        return this.element.play();
    }

    pause() {
        return this.element.pause();
    }

    load() {
        return this.element.load();
    }
}