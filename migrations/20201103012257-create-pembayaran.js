'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pembayaran', {
      id_pembayaran: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_tagihan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model: "tagihan", //table name
          key: "id_tagihan"  //primary key of tagihan
        }
      },
      tgl_pembayaran: {
        type: Sequelize.DATE
      },
      bulan_bayar: {
        type: Sequelize.STRING
      },
      biaya_admin: {
        type: Sequelize.INTEGER
      },
      total_admin: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      bukti: {
        type: Sequelize.STRING
      },
      id_admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model: "admin",  //table name
          key: "id_admin"  //primary key of admin
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pembayaran');
  }
};