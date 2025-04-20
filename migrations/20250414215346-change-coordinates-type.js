'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('markers', 'coordinates', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('markers', 'coordinates', {
      type: Sequelize.ARRAY(Sequelize.FLOAT),
      allowNull: false
    });
  }
};
