// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '../../utils/dbConnect';
import Note from '../../models/Note';

dbConnect()

export default async (req, res) => {
  // res.statusCode = 200
  // res.json({ name: 'John Doe' })
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const notes = await Note.find({});
        res.status(200).json({ success: true, data: notes })
      } catch (err) {
        res.status(400).json({ success: false, err: err })
      }
      break;

    case 'POST':
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }

}
