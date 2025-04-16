export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const random = (seed) => Math.ceil(Math.random() * seed);

export const parseInt = (value, defaultValue) => {
    if (value == null) {
        return defaultValue;
    }
    const intValue = Number.parseInt(value);
    return Number.isNaN(intValue) ? defaultValue : intValue;
}
