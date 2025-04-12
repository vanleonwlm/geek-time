export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export const random = (seed) => Math.ceil(Math.random() * seed);
