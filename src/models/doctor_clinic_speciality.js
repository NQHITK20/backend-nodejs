'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class doctor_clinic_speciality extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    doctor_clinic_speciality.init({
        doctorId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
        specialityId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'doctor_clinic_speciality',
    });
    return doctor_clinic_speciality;
};