// Require Third-Party Dependencies
const Addon = require("@slimio/addon");

// Globals
const Cards = new Map();

// Create Addon
const Aggregator = new Addon("aggregator").lockOn("events");

Aggregator.on("awake", () => {
    Aggregator.ready();
});

Aggregator.of("Metric.create").subscribe(async([dbName, id]) => {
    if (Cards.has(id)) {
        return;
    }

    // console.log(`METRIC CREATED - ${dbName}.db, id: ${id}`);
    try {
        const mic = await Aggregator.sendOne("events.get_mic", [id]);
        console.log(mic);
        Cards.set(id, { dt: Date.now(), mic });
    }
    catch (err) {
        console.error(err);
    }
}, console.error);

// Export "Aggregator" addon for Core
module.exports = Aggregator;
