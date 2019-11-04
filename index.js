"use strict";

// Require Third-Party Dependencies
const FastPriorityQueue = require("fastpriorityqueue");
const Addon = require("@slimio/addon");

// Require Internal Dependencies
const { buildMICRow } = require("./src/utils");

// CONSTANTS & GLOBALS
const AGGREGATE_INTERVAL_MS = 1000;
const Cards = new Map();

const Aggregator = new Addon("aggregator").lockOn("events");

/**
 * @function checkMic
 * @param {!number} micId
 */
async function checkMic(micId) {
    try {
        const options = { withSubscriber: true };
        const stats = await Aggregator.sendOne("events.get_mic_stats", [micId, options]);
        console.log(stats);
    }
    catch (error) {
        console.error(error);
    }
}

/**
 * @function aggregateInterval
 */
async function aggregateInterval() {
    for (const [id, mic] of Cards.entries()) {
        if (mic.timer.walk() && id > 2 && id < 4) {
            checkMic(id);
        }
    }
}
Aggregator.registerInterval(aggregateInterval, AGGREGATE_INTERVAL_MS);

Aggregator.on("awake", async() => {
    const mics = await Aggregator.sendOne("events.get_mic");
    Aggregator.logger.writeLine(`fetch ${mics.length} metric identity cards`);

    const filteredMics = mics.filter((mic) => !Cards.has(mic.id));
    for (const mic of filteredMics) {
        Cards.set(mic.id, buildMICRow(mic));
    }

    await Aggregator.ready();
});

Aggregator.of("Metric.create").filter((row) => !Cards.has(row[1])).subscribe(async(row) => {
    try {
        const [, id] = row;
        const mic = await Aggregator.sendOne("events.get_mic", [id]);

        Cards.set(id, buildMICRow(mic));
    }
    catch (error) {
        Aggregator.logger.writeLine(error.message);
    }
}, console.error);

module.exports = Aggregator;
