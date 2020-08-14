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


        if (req.query.porpose === 'delete-all') {
          const notes = await Note.deleteMany({});
          res.status(200).json({ success: true, data: notes })
        } else if (req.query.porpose === 'delete-id') {
          const rrrr = await Note.deleteOne({ _id: req.query.id }, (err) => {
            if (err) return handleError(err);
          });
          const noteList = await Note.find({});
          res.status(200).json({ success: true, data: noteList })
        } else {
          const notes = await Note.find({});
          res.status(200).json({ success: true, data: notes })
        }

      } catch (err) {
        res.status(400).json({ success: false, err: err })
      }
      break;

    case 'POST':
      try {
        const dbAnswer = await Note.create(req.body);

        res.status(201).json({ success: true, data: dbAnswer })
      } catch (err) {
        res.status(400).json({ success: false, err: err })
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }

}
