// Asynchroner Einkaufswagen-Worker

/**
 * Diese Funktion wird automatisch regelmäßig ausgeführt (alle 500ms)
 * Allerdings nur, wenn unten im module.exports die Variable is_enabled=true gesetzt wird!
 *
 * Aufgabe:
 * a. der Worker ruft in regelmäßigen Abständen die Queue /queue/cart_input_queue ab
 * b. Falls eine Nachricht vorhanden ist, ruft er das Produkt-Service für die Daten der Produkte auf
 * c. Der Worker berechnet das Gesamtgewicht und den Gesamtpreis des Warenkorbs.
 * d. Der Worker ruft das Porto-Service auf, um das Porto zu berechnen
 * e. Das Ergebnis (Warenkorb inkl. Preis, Gewicht und Porto) schreibt der Worker in die Queue /queue/cart_output_queue.
 *
 * Erwartetes Format der Input-Nachricht: (JSON)
 * {"liste": [{"nummer":1,"anzahl":2}, {"nummer":2,"anzahl":1}, {"nummer":3, "anzahl":7} ]}
 *
 * Erwartetes Format der Output-Nachricht: (JSON)
 * {"gesamt_summe":23.4,
 *  "gesamt_gewicht":2.96,
 *  "porto":5,
 *  "liste":
 *     [
 *         {"name":"Berti Zuckerl","preis":2.99,"gewicht":0.15,"anzahl":2,"preis_summe":5.98,"gewicht_summe":0.3}
 *         {"name":"Mampf Burger","preis":3.49,"gewicht":0.35,"anzahl":1,"preis_summe":3.49,"gewicht_summe":0.35}
 *         {"name":"Lilo's Schokolade","preis":1.99,"gewicht":0.33,"anzahl":7,"preis_summe":13.93,"gewicht_summe":2.31}
 *     ]
 * }
 *      Anmerkungen: - Datenbankfelder $loki & meta dürfen in den Records bleiben
 *                   - anzahl-Feld muss hinzugefügt werden
 *                   - preis_summe- & gewicht_summe-Felder müssen hinzugefügt werden
 *
 * Hinweise:
 * - verwenden Sie für Requests 127.0.0.1:3000, nicht localhost:3000
 * - Status-Code der Response können Sie mit response.statusCode abfragen (z.B. um auf leere Queue zu testen)
 */
function run_worker() {
}

module.exports = {
    is_enabled: false,
    run: run_worker
};