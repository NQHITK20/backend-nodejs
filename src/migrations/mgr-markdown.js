'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('markdown', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            // contentHTML: DataTypes.TEXT('long'),
            // contentMarkdown: DataTypes.TEXT('long'),
            // description: DataTypes.TEXT('long'),
            // doctorId: DataTypes.INTEGER,
            // specialtyId: DataTypes.INTEGER,
            // clinicId: DataTypes.INTEGER
            contentHTML: {
                type: Sequelize.TEXT('long'),
                allowNull: false
            },
            contentMarkdown: {
                type: Sequelize.TEXT('long'),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT('long'),
                allowNull: true
            },
            doctorId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            specialtyId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            clinicId: {
                type: Sequelize.INTEGER,
                allowNull: true
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
        await queryInterface.dropTable('markdown');
    }
};