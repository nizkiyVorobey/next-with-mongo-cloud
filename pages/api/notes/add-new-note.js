import dbConnect from '../../../utils/dbConnect';
import Note from '../../../models/Note';

dbConnect()

export default async(req, res) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            try {
                const newNote = await Note.create({
                    ...req.body,
                    date: new Date(),
                });
                res.status(200).json({ success: true, data: newNote })
            } catch (err) {
                res.status(400).json({ success: false, err: err })
            }
            break
        default:
            return false
    }
}