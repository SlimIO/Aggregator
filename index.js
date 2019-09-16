"use strict";

// Require Third-Party Dependencies
const Addon = require("@slimio/addon");

// CONSTANTS & GLOBALS
const AGGREGATE_INTERVAL_MS = 30000;
const Cards = new Map();

const Aggregator = new Addon("aggregator").lockOn("events");

/**
 * @function aggregateInterval
 */
async function aggregateInterval() {
    Aggregator.logger.writeLine("interval triggered");
    console.log(Cards);
}
Aggregator.registerInterval(aggregateInterval, AGGREGATE_INTERVAL_MS);

Aggregator.on("awake", async() => {
    const mics = await Aggregator.sendOne("events.get_mic");
    Aggregator.logger.writeLine(`fetch ${mics.length} metric identity cards`);

    mics.filter((mic) => !Cards.has(mic.id))
        .forEach((mic) => Cards.set(mic.id, { dt: Date.now(), mic }));
    await Aggregator.ready();
});

Aggregator.of("Metric.create").filter((row) => !Cards.has(row[1])).subscribe(async(row) => {
    const [, id] = row;
    const mic = await Aggregator.sendOne("events.get_mic", [id]);
    Cards.set(id, { dt: Date.now(), mic });
}, console.error);

module.exports = Aggregator;
