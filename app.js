const express = require('express')
const AWS = require('aws-sdk')
const url = require('url');

const app = express()
const port = 3000

app.use(express.urlencoded());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const REGION = 'ap-southeast-1';
const ACCESS_KEY = 'AKIA6EVSUW7MT7GZ2GOP';
const SECRET_KEY = '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';
const TABLE_NAME = "MayTinh"

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
})

const client = new AWS.DynamoDB.DocumentClient()

app.get('/', (req, res) => {
    const params = {
        TableName: TABLE_NAME,
    }
    client.scan(params, (err, data) => {
        console.log(err)
        if (err) {
            res.send("Có lỗi xảy ra!");
            return
        }

        res.render("index.ejs", {
            data: data.Items,
            err: {},
            fail: null,
        })
    })

})


app.get('/them-may-tinh', (req, res) => {

    res.render("them.ejs", {
        err: {},
        fail: null
    })

})


app.post('/them-may-tinh', (req, res) => {

    const params = {
        TableName: TABLE_NAME,
        Item: req.body
    }
    client.put(params, (err, data) => {
        console.log(err)
        if (err) {
            res.redirect(url.format({
                pathname: "/them-du-lieu",
                query: { "fail": "Có lỗi xảy ra, không thể thêm máy tính!" }
            }))
            return
        }

        res.redirect("/")
    })

})


app.get('/xoa-may-tinh', (req, res) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            ma_may: req.query.ma_may
        }
    }
    client.delete(params, (err, data) => {
        console.log(err)
        if (err) {
            res.send("Có lỗi xảy ra!");
            return
        }

        res.redirect("/")
    })

})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})