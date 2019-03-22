/**
 * Der Scheduler ruft periodisch (alle 500ms) die Worker auf.
 * Allerdings nur, wenn die Worker aktiviert sind, d.h. wenn deren is_enabled-Variable=true ist.
 *
 * (Der Scheduler selbst wird direkt in bin/www gestartet.)
 */
const cart_worker = require('./cart_worker');
const name_worker = require('./name_worker');

// Ruft regelmäßig die übergebene Funktion run_function auf
function polling(run_function) {
    setTimeout(function() { polling(run_function) }, 500);
    run_function();
}

// name_worker
if (name_worker.is_enabled) {
    polling(name_worker.run);
}

// cart_worker
if (cart_worker.is_enabled) {
    polling(cart_worker.run);
}

module.exports = {};
