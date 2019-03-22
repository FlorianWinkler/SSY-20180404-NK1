/**
 * Damit die Tests funktionieren, müssen Sie genau das Request-Format einhalten.
 * Im client-Verzeichnis finden Sie beispielhafte Request- & Response-Inhalte.
 */

const Request = require('request');

let score = 0;
test1a();


///// Porto-Service ////////////////////////////////////////////////////

function test1a() {
    Request.post({
        url: 'http://127.0.0.1:3000/porto',
        json: { gewicht: 100, preis: 52 }
    }, testResponse("1a", 5, response1a, test1d));

    function response1a(body) {
        return (body.porto === 0)
    }
}

function test1d() {
    Request.post({
        url: 'http://127.0.0.1:3000/porto',
        json: { gewicht: 3.1, preis: 27 }
    }, testResponse("1d", 5, response1d, test2a));

    function response1d(body) {
        return (body.porto === 5)
    }
}


///// Shopping-Cart-Service ////////////////////////////////////////////

function test2a() {
    Request.get({ url: 'http://127.0.0.1:3000/product/2', json: true },
        testResponse("2a", 6, response2a, test2b));

    function response2a(body) {
        return (body.name === "Mampf Burger" &&
                body.preis === 3.49 &&
                body.gewicht === 0.35)
    }
}

function test2b() {
    Request.get({ url: 'http://127.0.0.1:3000/product/?ids=[1,2]', json: true},
        testResponse("2b", 6, response2b, test3a));

    function response2b(body) {
        if (body.length !== 2)
            return false;
        if (body[0].name !== "Berti Zuckerl" ||
            body[0].preis !== 2.99 ||
            body[0].gewicht !== 0.15)
            return false;
        if (body[1].name !== "Mampf Burger" ||
            body[1].preis !== 3.49 ||
            body[1].gewicht !== 0.35)
            return false;
        return true;
    }
}



///// Queue ////////////////////////////////////////////////////////////

function test3a() {
    Request.post({
        url: 'http://127.0.0.1:3000/queue/test_queue',
        json: { value: 123 }
    }, testResponse("3a", 7, response3a, test3b));

    function response3a(body) {
        // body enthält nur den "true"-Boolean-Wert
        return (body === true)
    }
}

// liest vorher geschriebene Nachricht
function test3b() {
    Request.get({url: 'http://127.0.0.1:3000/queue/test_queue', json: true},
        testResponse("3b", 5, response3b, test3cde));

    function response3b(body) {
        return (body.value === 123)
    }
}

// Testet ob Queues strikt voneinander getrennt sind
function test3cde() {
    // zuerst 3 Nachrichten in zwei unterschiedliche Queues hineinschicken
    Request.post({url: 'http://127.0.0.1:3000/queue/test_queue_1',
                 json: {score: 123, text: "Amazing"}}, function() {
    Request.post({url: 'http://127.0.0.1:3000/queue/test_queue_zwei',
                 json: {score: 456, slogan: "Wow"}}, function() {
    Request.post({url: 'http://127.0.0.1:3000/queue/test_queue_1',
                 json: {score: 789, title: "Crazy"}}, function() {

    // dann 3 Nachrichten in anderer Reihenfolge wieder auslesen
    // Test 3c
    Request.get({url: 'http://127.0.0.1:3000/queue/test_queue_zwei', json: true},
        testResponse("3c", 2, response3c, get_input_item_3d));
    });});});

    function response3c(body) {
        return (body.score === 456 &&
                body.slogan === "Wow")
    }

    // Test 3d
    function get_input_item_3d() {
        Request.get({url: 'http://127.0.0.1:3000/queue/test_queue_1', json: true},
            testResponse("3d", 2, response3d, get_input_item_3e));
    }

    function response3d(body) {
        return (body.score === 123 &&
                body.text === "Amazing")
    }

    // Test 3e
    function get_input_item_3e() {
        Request.get({url: 'http://127.0.0.1:3000/queue/test_queue_1', json: true},
            testResponse("3e", 2, response3e, test3f));
    }

    function response3e(body) {
        return (body.score === 789 &&
                body.title === "Crazy")
    }
}


// testet, ob eine leere Queue den passenden Status-Code retourniert
function test3f() {
    Request.get({url: 'http://127.0.0.1:3000/queue/empty_queue'},
        testResponse("3f", 2, response3f, test4));

    function response3f(body, statusCode) {
        return (statusCode === 204 &&
                body.length === 0)
    }
}



///// Name-Worker /////////////////////////////////////////////////////

function test4() {
    push_and_pop_queue("4", 18,
        { id: 3 },
        'name_input_queue',
        'name_output_queue',
        response4, test5);

    function response4(body) {
        return (body.name === "Lilo's Schokolade")
    }
}


///// Preis-Worker /////////////////////////////////////////////////////

function test5() {
    push_and_pop_queue("5", 40,
        { liste: [
            {nummer:1, anzahl:2},
            {nummer:2, anzahl:1},
            {nummer:3, anzahl:7}
        ]},
        'cart_input_queue',
        'cart_output_queue',
        response5, endResult);

    function response5(body) {
        return (body.gesamt_summe === 23.4 &&
                body.gesamt_gewicht === 2.96 &&
                body.porto === 5 &&
                body.liste.length === 3 &&

                body.liste[0].name === "Berti Zuckerl" &&
                body.liste[0].anzahl === 2 &&
                body.liste[0].preis_summe === 5.98 &&
                body.liste[0].gewicht_summe === 0.3 &&

                body.liste[1].preis === 3.49 &&
                body.liste[1].anzahl === 1 &&
                body.liste[1].preis_summe === 3.49 &&
                body.liste[1].gewicht_summe === 0.35 &&

                body.liste[2].gewicht === 0.33 &&
                body.liste[2].anzahl === 7 &&
                body.liste[2].preis_summe === 13.93 &&
                body.liste[2].gewicht_summe === 2.31
        )
    }
}

function endResult() {
    console.log("Punktezahl: "+score+" von 100");
}




///// Hilfsfunktionen //////////////////////////////////////////////////

function testResponse(nr, add_score, test_function, next_function) {
    function test(error, response, body) {
        try {
            if (typeof response === "undefined" || response.statusCode === 404)
                console.log("Test "+nr+": Funktion nicht implementiert.");
            else if (error === null && test_function(body, response.statusCode)) {
                if (add_score > 0) {
                    console.log("Test " + nr + " funktioniert.");
                    score += add_score;
                }
            }
            else
                console.log("Test "+nr+" liefert falsches Ergebnis: "+JSON.stringify(body));
        }
        catch(e) {
            console.log("Test "+nr+" schlägt fehl: " + e);
        }

        if(next_function) {
            let statusCode = typeof response === "undefined" ? 500 : response.statusCode;
            next_function(body, statusCode);
        }
    }
    return test;
}

function push_and_pop_queue(nr, add_score, message, input_queue, output_queue, test_function, next_function) {
    let retry_count = 0;

    Request.post({url: 'http://127.0.0.1:3000/queue/'+input_queue,  json: message},
        testResponse(nr+"i", 0, queue_response, read_queue));

    function queue_response(body) {
        return (body === true)
    }

    function read_queue() {
        retry_count++;
        if (retry_count >= 6) {
            console.log("Test "+nr+" funktioniert nicht (keine Antwort).");
        } else {
            Request.get({url: 'http://127.0.0.1:3000/queue/' + output_queue, json: true},
                testResponse(nr + "o", 0, function () { return true }, verify_answer));
        }
    }

    function verify_answer(body, statusCode) {
        if (statusCode === 204) {
            setTimeout(read_queue, 250);
        } else {
            try {
                if (typeof body === "undefined" || statusCode === 404) {
                    console.log("Test " + nr + "o: Funktion nicht implementiert.");
                } else if (test_function(body)) {
                    console.log("Test " + nr + " funktioniert.");
                    score += add_score;
                }
                else {
                    console.log("Test " + nr + "o liefert falsches Ergebnis: " + JSON.stringify(body));
                }
            }
            catch(e) {
                console.log("Test "+nr+"o schlägt fehl: " + e);
            }
            if (next_function) {
                next_function(body)
            }
        }
    }
}
