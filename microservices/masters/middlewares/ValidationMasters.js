const validator = require('validator');

const validateMasterData = (req, res, next) => {
    const { firstName, lastName, email, phone, services } = req.body;
    const errors = [];

    if (!firstName || !/^[A-Za-zА-Яа-яЇїІіЄєҐґ'\- ]+$/.test(firstName)) {
        errors.push('First name must contain only letters and hyphens');
    }

    if (!lastName || !/^[A-Za-zА-Яа-яЇїІіЄєҐґ'\- ]+$/.test(lastName)) {
        errors.push('Last name must contain only letters and hyphens');
    }

    if (!email || !validator.isEmail(email)) {
        errors.push('Invalid email format');
    }

    if (!phone || !/^\+380\d{9}$/.test(phone)) {
        errors.push('Phone number must be in +380XXXXXXXXX format');
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
        errors.push('At least one service must be selected');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = {
    validateMasterData
};