// Require Third-Party Dependencies
const Addon = require("@slimio/addon");

// Create Addon
const Aggregator = new Addon("aggregator").lockOn("events");

Aggregator.on("awake", () => {
    Aggregator.ready();
});

// Export "Aggregator" addon for Core
module.exports = Aggregator;
