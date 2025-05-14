const User = require('../models/User');
const UserRepository = require('../repositories/UserRepository');

class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    async createUser(userData) {
        const existingUser = await this.repository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const user = new User(userData);
        return await this.repository.create(user);
    }

    async getUserById(id) {
        return await this.repository.findById(id);
    }

    async getUserByPhone(phone) {
        return await this.repository.model.findOne({ phone });
    }

    async getAllUsers({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        return await this.repository.model.find()
            .skip(skip)
            .limit(limit);
    }

    async updateUser(id, data) {
        const updated = await this.repository.model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        return updated;
    }

    async deleteUser(id) {
        const deleted = await this.repository.model.findByIdAndDelete(id);
        return deleted !== null;
    }

    async getUserWithAppointments(userId) {
        return await this.repository.model.findById(userId)
            .populate({
                path: 'appointments',
                select: 'appointmentDate serviceId status',
                populate: {
                    path: 'serviceId',
                    select: 'name duration price'
                }
            });
    }

}

module.exports = UserService;