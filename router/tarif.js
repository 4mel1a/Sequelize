const express = require("express")
const app = express()

// call model of tarif
const tarif = require("../models/index").tarif

// middleware for allow the request from body (agar bisa membaca data" yang kita kirimkan di body)
app.use(express.urlencoded({extended:true}))

// authorization
const verifyToken = require("./verifyToken")

app.get("/", verifyToken, async(req,res) => {
    tarif.findAll()
    .then(result => {
        res.json(result)
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", async(req, res) => {
    // tampung data request yang akan digunakan
    let data = {
        daya: req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }

    // execute insert data
    tarif.create(data)
    .then(result => {
        res.json({
            message: "Data has been inserted",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put("/", verifyToken, async(req, res) => {
    // tampung data request yang akan di ubah 
    let data = {
        daya: req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }

    // key yg menunjukkan data yang akan diubah
    let param = {
        id_tarif: req.body.id_tarif
    }

    // execute update data
    tarif.update(data,{where : param})
    .then(result => {
        res.json({
            message: "Data has been updated",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:id_tarif", verifyToken, async(req, res) => {
    let id_tarif = req.params.id_tarif
    let parameter = {
        id_tarif: id_tarif
    }

    // execute delete data
    tarif.destroy({where : parameter})
    .then(result => {
        res.json({
            message: "Data has been destroyed",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app