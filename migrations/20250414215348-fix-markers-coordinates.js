'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
 
    await queryInterface.createTable('markers_temp', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      coordinates: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('intact', 'damaged', 'needs_inspection'),
        allowNull: false,
        defaultValue: 'intact'
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


    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_markers_temp_status" AS ENUM ('intact', 'damaged', 'needs_inspection');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);


    await queryInterface.sequelize.query(`
      INSERT INTO markers_temp (id, coordinates, title, description, status, "createdAt", "updatedAt")
      SELECT id, coordinates::text, title, description, status::text::"enum_markers_temp_status", "createdAt", "updatedAt"
      FROM markers;
    `);


    await queryInterface.dropTable('markers');


    await queryInterface.renameTable('markers_temp', 'markers');
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.createTable('markers_old', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      coordinates: {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('intact', 'damaged', 'needs_inspection'),
        allowNull: false,
        defaultValue: 'intact'
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


    await queryInterface.sequelize.query(`
      INSERT INTO markers_old (id, coordinates, title, description, status, "createdAt", "updatedAt")
      SELECT id, string_to_array(coordinates, ',')::float[], title, description, status, "createdAt", "updatedAt"
      FROM markers;
    `);


    await queryInterface.dropTable('markers');

    await queryInterface.renameTable('markers_old', 'markers');
  }
}; 