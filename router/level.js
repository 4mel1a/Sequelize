const express = require("express")
const app = express()

// call model of level
const level = require("../models/index").level

// middleware for allow the request from body (agar bisa membaca data" yang kita kirimkan di body)
app.use(express.urlencoded({extended:true}))

// authorization
const verifyToken = require("./verifyToken")

app.get("/", verifyToken, async(req,res) => {
    level.findAll()
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
        nama_level: req.body.nama_level,
    }

    // execute insert data
    level.create(data)
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
        nama_level: req.body.nama_level,
    }

    // key yg menunjukkan data yang akan diubah
    let param = {
        id_level: req.body.id_level
    }

    // execute update data
    level.update(data,{where : param})
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

app.delete("/:id_level", verifyToken, async(req, res) => {
    let id_level = req.params.id_level
    let parameter = {
        id_level: id_level
    }

    // execute delete data
    level.destroy({where : parameter})
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