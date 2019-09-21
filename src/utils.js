"use strict";

// Require Third-party Dependencies
const Scheduler = require("@slimio/scheduler");

/**
 * @function buildMICRow
 * @param {*} mic
 * @returns {object}
 */
function buildMICRow(mic) {
    const { sample_interval, aggregation_mode } = mic;
    const interval = sample_interval;

    return {
        timer: new Scheduler({ interval }),
        sample_interval,
        aggregation_mode
    };
}

module.exports = { buildMICRow };
