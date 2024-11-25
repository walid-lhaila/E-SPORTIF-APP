import organizerDb from "../model/organizerModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


class AuthService {

    async createOrganizer(organizerData) {
        const {firstName, lastName, phone, email, password} = organizerData;

        const hashedPassword = await bcrypt.hash(password, 10);

        const organizer = new organizerDb({
            firstName, 
            lastName,
            phone,
            email,
            password : hashedPassword
        });
        return await organizer.save();
    }

    async login (email, password) {
        try {
            const organizer = await organizerDb.findOne({email});
            if(!organizer) throw new Error ('Organizer Not Found');

            const isMatch = await bcrypt.compare(password, organizer.password);
            if(!isMatch) throw new Error ("Invalid Credentials!");

            const token = jwt.sign({id: organizer._id, firstName: organizer.firstName, lastName: organizer.lastName, phone: organizer.phone}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            return { token };
        } catch (error) {
            console.error('Error during login:', error.message );
            throw new Error('Authentication Failed !');
        }
    }


}

export default new AuthService();