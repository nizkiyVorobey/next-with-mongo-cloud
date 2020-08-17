import dbConnect from '../../../utils/dbConnect';
import Note from '../../../models/Note';

dbConnect()

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const deletedItem = await Note.deleteOne({ _id: req.query.id });
                res.status(200).json({ success: true, data: deletedItem })
            } catch (err) {
                res.status(400).json({ success: false, err: err })
            }
            break
        default:
            return false
    }
}