'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class doctor_info extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            doctor_info.belongsTo(models.User, { foreignKey: 'doctorId' })

            doctor_info.belongsTo(models.allcodes, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceData' })
            doctor_info.belongsTo(models.allcodes, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentData' })
            doctor_info.belongsTo(models.allcodes, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceData' })

        }
    };
    doctor_info.init({
        doctorId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        nameClinic: DataTypes.STRING,
        addressClinic: DataTypes.STRING,
        note: DataTypes.STRING,
        count: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'doctor_info',
    });
    return doctor_info;
};