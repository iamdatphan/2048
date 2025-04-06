export default class Tile {
    #tileElement;
    #x;
    #y;
    #value;

    constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile");
        tileContainer.append(this.#tileElement);
        this.value = value;
    }

    get value() {
        return this.#value;
    }

    set value(v) {
        this.#value = v;
        this.#tileElement.textContent = v;

        // Determine how many times the v has been raised to the power of 2
        // For example, if v is 8, then power is 3, because 2^3 = 8
        const power = Math.log2(v);

        // Every time the power increases by 1,
        // the background color lightness decreases by 9%
        // (or the background color becomes darker by 9%)
        const backgroundLightness = 100 - power * 9;

        this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`);
        // If the background color is dark, the text color should be light, and vice versa
        this.#tileElement.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`);
    }

    set x(value) {
        this.#x = value;
        this.#tileElement.style.setProperty("--x", value);
    }

    set y(value) {
        this.#y = value;
        this.#tileElement.style.setProperty("--y", value);
    }

    remove() {
        // Remove the tile element from the DOM
        this.#tileElement.remove();
    }

    waitForTransition(animation = false) {
        return new Promise((resolve) => {
            this.#tileElement.addEventListener(animation ? "animationend" : "transitionend", resolve, {
                once: true,
            });
        });
    }
}
