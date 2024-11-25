import authService from '../services/authService.js';



const register = async (req, res) => {
    try {
        const savedOrganizer = await authService.createOrganizer(req.body);
        res.status(201).json({ message: 'Organizer Created Sucessfully', organizer: savedOrganizer});
    } catch(err) {
        res.status(500).json({ message: err.message || 'Some Error Occurred while Creating A Client'});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'Email And Password Are Required'});
        }

        const {token} = await authService.login(email, password);

        const message = 'Logged In Successfully';
        return res.status(200).json({message, token})
    } catch (err) {
        console.error('Error During Login:', err.message);
        res.status(401).json({ message: 'Invalid Email Or Password'});
    }
};



export default {register, login};