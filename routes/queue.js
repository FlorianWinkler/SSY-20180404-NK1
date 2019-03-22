const express = require('express');
const router = express.Router();

router.post('/:id', newMessage);
router.get('/:id', getMessage);

let queues = {};

function newMessage(req, res){
    let queue_name = req.params.id;
    if(queues[queue_name] === undefined){
        queues[queue_name] = [];
    }
    queues[queue_name].push(req.body);
    console.log(req.body);
    console.log(queues);
    res.json(true);
}

function getMessage(req,res){
    let queue_name = req.params.id;
    if(queues[queue_name] === undefined){
        res.status(204).end();
        return;
    }
    if(queues[queue_name].length === 0){
        res.status(204).end();
        return;
    }
    res.json(queues[queue_name].shift());
}

module.exports = router;
