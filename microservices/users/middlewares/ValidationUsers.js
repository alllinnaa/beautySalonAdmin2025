const validator = require('validator');

const validateUserData = (req, res, next) => {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    if (!/^[A-Za-zА-Яа-яЇїІіЄєҐґ]+$/.test(firstName)) {
        return res.status(400).json({ error: 'First name must contain only letters' });
    }

    if (!/^[A-Za-zА-Яа-яЇїІіЄєҐґ]+$/.test(lastName)) {
        return res.status(400).json({ error: 'Last name must contain only letters' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!/^\+380\d{9}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be in +380XXXXXXXXX format' });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long, contain at least one uppercase letter and one number'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    next();
};


module.exports = {
    validateUserData,
};
