import dbConnect from '../../../utils/dbConnect';
import Note from '../../../models/Note';

dbConnect()

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const deletedList = await Note.deleteMany({});
                res.status(200).json({ success: true, data: {message: "we deleted all list"} })
            } catch (err) {
                res.status(400).json({ success: false, err: err })
            }
            break
        default:
            return false
    }
}