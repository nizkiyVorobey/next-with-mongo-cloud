import { useState, useRef } from 'react';
import Head from 'next/head';
import {
  Button, TextField, CardContent,
  Card, Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

export default function Home() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [bdResponse, setBdResponse] = useState([]);
  const [checkedId, setCheckedId] = useState(null)

  const getData = () => {
    fetch('http://localhost:3000/api/request')
      .then(data => {
        return data.json()
      })
      .then(value => {
        setBdResponse(value.data);
      })
  }

  const removeAllData = () => {
    fetch('http://localhost:3000/api/request?porpose=delete-all')
      .then(data => {
        return data.json()
      })
      .then(value => {
        setBdResponse([])
      })
  }

  const sendData = () => {
    fetch('http://localhost:3000/api/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        title: title,
        message: message
      })
    })
      .then(data => {
        return data.json()
      })
      .then(value => {
        setBdResponse([...bdResponse, value.data])
        setMessage('')
        setTitle('')
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const removeCheckedNote = (id) => {
    fetch(`http://localhost:3000/api/request?porpose=delete-id&id=${id}`)
    .then(data => {
      return data.json()
    })
    .then(value => {
      setBdResponse(bdResponse.filter(item => item['_id'] != id ))
      console.log(value);
    })
  }

  return (
    <div className="wrapper">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container header-button">
        <Button className="header-button__item" variant="contained" onClick={getData}>Get data</Button>
        <Button className="header-button__item" variant="contained" onClick={removeAllData}>remove all data</Button>
      </div>

      <hr />

      <div className="container row-container">
        <TextField
          id="outlined-basic"
          label="title"
          variant="outlined"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="field-item"
        />

        <TextField
          id="outlined-multiline-static"
          label="message"
          multiline
          rows={4}
          variant="outlined"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="field-item"
        />
      </div>
      <div className="container">
        <Button variant="contained" onClick={sendData}>Sent Data</Button>
      </div>

      <div className="row-container">
        {
          bdResponse.map((note) => (
            <Card
              variant="outlined"
              key={note['_id']}
              className="note-item__card"
            >
              <CardContent>
                <Typography variant="h5" component="h2">
                  {note.title}
                </Typography>
                <Typography color="textSecondary">
                  {note.message}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                className="note-item__delete-btn"
                onClick={() => {
                  setCheckedId(note['_id'])
                  removeCheckedNote(note['_id'])
                }}
              >
                Delete
              </Button>
            </Card>
          ))
        }
      </div>
    </div>
  )
}
