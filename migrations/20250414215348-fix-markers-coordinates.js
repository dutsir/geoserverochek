'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create a temporary table with the correct structure
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

    // Copy data from old table to new table
    await queryInterface.sequelize.query(`
      INSERT INTO markers_temp (id, coordinates, title, description, status, "createdAt", "updatedAt")
      SELECT id, coordinates::text, title, description, status, "createdAt", "updatedAt"
      FROM markers;
    `);

    // Drop old table
    await queryInterface.dropTable('markers');

    // Rename new table to original name
    await queryInterface.renameTable('markers_temp', 'markers');
  },

  async down(queryInterface, Sequelize) {
    // Create a temporary table with the old structure
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

    // Copy data back
    await queryInterface.sequelize.query(`
      INSERT INTO markers_old (id, coordinates, title, description, status, "createdAt", "updatedAt")
      SELECT id, string_to_array(coordinates, ',')::float[], title, description, status, "createdAt", "updatedAt"
      FROM markers;
    `);

    // Drop new table
    await queryInterface.dropTable('markers');

    // Rename old table back to original name
    await queryInterface.renameTable('markers_old', 'markers');
  }
}; 