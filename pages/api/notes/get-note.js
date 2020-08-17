import dbConnect from '../../../utils/dbConnect';
import Note from '../../../models/Note';

dbConnect()

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const noteList = await Note.find({})
                res.status(200).json({ success: true, data: noteList.slice(req.query.start, req.query.end) })
            } catch (err) {
                res.status(400).json({ success: false, err: err })
            }
            break;
        default:
            return false
    }
}