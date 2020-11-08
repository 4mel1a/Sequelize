const express = require("express")
const app = express()

// call model for penggunaan
const penggunaan = require("../models/index").penggunaan

// middleware for allow the request from body (agar bisa membaca data yang kita kirimkan di body)
app.use(express.urlencoded({extended:true}))

// authorization
const verifyToken = require("./verifyToken")

app.get("/", verifyToken, async(req, res) => {
    penggunaan.findAll({
        include: ["pelanggan"]
    })
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
    // tampung data request yang akan dimasukkan
    let data = {
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir
    }

    // excute insert data
    penggunaan.create(data)
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
    // tampung data request yang akan diubah
    let data = {
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir
    }
    
    // ket yang menunjukkan data yang akan diubah
    let param = {
        id_penggunaan: req.body.id_penggunaan
    }

    // excute update data
    penggunaan.update(data,{where : param})
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

app.delete("/:id_penggunaan", verifyToken, async(req, res) => {
    let id_penggunaan = req.params.id_penggunaan
    let parameter = {
        id_penggunaan: id_penggunaan
    }

    // execute delete data
    penggunaan.destroy({where : parameter})
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