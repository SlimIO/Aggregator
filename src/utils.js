// Require Third-party Dependencies
import Scheduler from "@slimio/scheduler";

/**
 * @function buildMICRow
 * @param {*} mic
 * @returns {object}
 */
export function buildMICRow(mic) {
    const { sample_interval, aggregation_mode } = mic;
    const interval = sample_interval;

    return {
        timer: new Scheduler({ interval }),
        sample_interval,
        aggregation_mode
    };
}
