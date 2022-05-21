const express = require('express');
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');
const transportActivity = require('./models/transportActivity.js');

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/v1/activities:
 *      get:
 *          summary: Returns all the activities of a specific user
 *          description: Returns all the activities of the logged user
 *          parameters:
 *              - in: cookie
 *                name: userId
 *                required: true
 *                description: The userId present in the cookie of the browser login
 *                schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: The list of activities performed by the user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:  
 *                                  type: object
 *                                  properties: 
 *                                      self:
 *                                          type: string
 *                                          description: The link to the activity
 *                                      type:
 *                                          type: string
 *                                          description: The type of the activity
 *                                      date:
 *                                          type: date 
 *                                          description: The date of insertion of the activity 
 *                                      userId:
 *                                          type: string
 *                                          description: The id of the user
 *                          example:
 *                              - self: "/api/v1/activities/product/6285204dec2411e44ef73902"
 *                                type: "product"
 *                                date: "2022-05-18T16:35:25.296Z"
 *                                userId: "628367e9078d0308f8dd76ba"
 */

router.get('', async (req, res) => {
    let garbage = await garbageActivity.find({ userId: req.cookies['userId'] });
    let product = await productActivity.find({ userId: req.cookies['userId'] });
    let transport = await transportActivity.find({ userId: req.cookies['userId'] });

    let resp = [];
    for (item of product) {
        resp.push({
            self: "/api/v1/activities/product/" + item.id,
            type: "product",
            date: item.date,
            userId: item.userId
        });
    }

    for (item of garbage) {
        resp.push({
            self: "/api/v1/activities/garbage/" + item.id,
            type: "garbage",
            date: item.date,
            userId: item.userId
        });
    }

    for (item of transport) {
        resp.push({
            self: "/api/v1/activities/transport/" + item.id,
            type: "transport",
            date: item.date,
            userId: item.userId
        });
    }
    res.status(200).json(resp);
});

router.get('/total_impact', async (req, res) => {

    let userId = req.cookies['userId'];
    let garbage, product, transport;
    let search = false;
    if (userId) {
        search = { userId: userId };
    }
    garbage = await garbageActivity.find(search ? search : {});
    product = await productActivity.find(search ? search : {});
    transport = await transportActivity.find(search ? search : {});
    // TODO: Select only authenticated
    let total_impact = 0;
    let resp;
    for (item of product) {
        total_impact += item.impact;
    }

    for (item of garbage) {
        total_impact += item.impact;
    }

    for (item of transport) {
        total_impact += item.impact;
    }
    resp = { "total_impact": total_impact };
    res.status(200).json(resp);
});

module.exports = router;