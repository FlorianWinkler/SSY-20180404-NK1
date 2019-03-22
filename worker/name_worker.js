// Asynchroner "Name eines Guts"-Worker

const Request = require('request');

/**
 * Diese Funktion wird automatisch regelmäßig ausgeführt (alle 500ms).
 * Allerdings nur, wenn unten im module.exports die Variable is_enabled=true gesetzt wird!
 *
 * Aufgabe:
 * a. der Worker ruft in regelmäßigen Abständen die Queue /queue/name_input_queue ab
 * b. Falls eine Nachricht vorhanden ist, ruft er das Produkt-Service auf, um die Produktdaten zu erhalten
 * c. das Ergebnis (den Namen des Produkts) schreibt er in die Queue /queue/name_output_queue.
 *
 * Erwartetes Format der Input-Nachricht: (JSON)
 * {"id":3}
 *
 * Erwartetes Format der Output-Nachricht: (JSON)
 * {"name":"Lilo's Schokolade"}
 *
 * Hinweise:
 * - verwenden Sie für Requests 127.0.0.1:3000, nicht localhost:3000
 * - Status-Code der Response können Sie mit response.statusCode abfragen (z.B. um auf leere Queue zu testen)
 */
function run_worker() {

    //Schritt 1: Input-Queue abfragen
    Request.get({
        url: 'http://127.0.0.1:3000/queue/name_input_queue',
        json: true
    }, inputResponse);

    function inputResponse(err, inputResp, inputBody){
        if(inputResp.statusCode === 204){
            // Queue ist leer
            return;
        }
        // inputBody == message
        let productId = inputBody.id;

        // Schritt 2: Product Service abfragen
        Request.get({
            url: 'http://127.0.0.1:3000/product/'+productId,
            json: true
        }, productResponse);

        function productResponse(err, prodResp, inputBody){
            let productName = inputBody.name;

            // Schritt 3: Ergebnis in Output-Queue schreiben
            Request.post({
                url: 'http://127.0.0.1:3000/queue/name_output_queue',
                json:{
                    name: productName
                }
            })

        }
    }


}

module.exports = {
    is_enabled: true,
    run: run_worker
};
