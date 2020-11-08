const express = require("express")
const app = express()

// call model
const tagihan = require("../models/index").tagihan
const penggunaan = require("../models/index").penggunaan

// middleware for allow the request from body (agar bisa membaca data yang kita kirimkan di body)
app.use(express.urlencoded({extended:true}))

// authorization
const verifyToken = require("./verifyToken")

app.get("/", verifyToken, async(req, res) => {
    tagihan.findAll({
        include: ["penggunaan"]
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

app.post('/', async (req, res) => {
    // tampung data request yang akan dimasukkan
    let data = {
      id_penggunaan: req.body.id_penggunaan,
      bulan: req.body.bulan,
      tahun: req.body.tahun,
      jumlah_meter: req.body.jumlah_meter,
      status: false,
    };
  
    // excute insert data
    tagihan.create(data)
      .then((result) => {
        // ambil id_penggunaan
        const idPengguna = {
          id_penggunaan: req.body.id_penggunaan,
        };
  
        // findOne id_penggunaan (untuk memanggil id_penggunaan yang dipinjam)
        penggunaan.findOne({ where: idPengguna })
        .then((resultPengguna) => {
          const pengguna = {
            meter_awal: resultPengguna.meter_awal,
            meter_akhir: resultPengguna.meter_akhir,
          };
          const jumlah = {
            jumlah_meter: pengguna.meter_akhir - pengguna.meter_awal,
          };
  
          tagihan.update(jumlah, { where: idPengguna })
          .then((result3) => {
            res.json({
              message: 'Data has been inserted',
              data: result,
            });
          });
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  });

app.put("/", verifyToken, async(req, res) => {
    // tampung data request yang akan diubah
    let data = {
        id_penggunaan: req.body.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: req.body.jumlah_meter,
        status: false,
    }
    
    // ket yang menunjukkan data yang akan diubah
    let param = {
        id_tagihan: req.body.id_tagihan
    }

    // excute update data
    tagihan.update(data,{where : param})
    .then(result => {
        // ambil id_penggunaan
        const idPengguna = {
            id_penggunaan: req.body.id_penggunaan,
          };
    
          // findOne id_penggunaan (untuk memanggil id_penggunaan yang dipinjam)
          penggunaan.findOne({ where: idPengguna })
          .then((resultPengguna) => {
            const pengguna = {
              meter_awal: resultPengguna.meter_awal,
              meter_akhir: resultPengguna.meter_akhir,
            };
            const jumlah = {
              jumlah_meter: pengguna.meter_akhir - pengguna.meter_awal,
            };
    
            tagihan.update(jumlah, { where: idPengguna })
            .then((result3) => {
              res.json({
                message: 'Data has been updated',
                data: result,
              });
            });
        });
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:id_tagihan", verifyToken, async(req, res) => {
    let id_tagihan = req.params.id_tagihan
    let parameter = {
        id_tagihan: id_tagihan
    }

    // execute delete data
    tagihan.destroy({where : parameter})
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