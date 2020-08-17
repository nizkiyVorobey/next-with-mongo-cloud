import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import {
    Button,
    TextField,
    CardContent,
    Card,
    Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';


const baseUrl = "http://localhost:3000/api/";

export default function Home() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [requestStatus, setRequestStatus] = useState({
        sendDataStatus: null,
        getDataStatus: null,
        removeItemStatus: null,
        removeAllDataStatus: null
    })
    const [bdResponse, setBdResponse] = useState([]);
    const [findedNote, setFindedNote] = useState([]);
    const [searchParams, setSearchParams] = useState({
        title: '',
        message: '',
        rangeDate: {
            start: new Date(),
            end: new Date(),
        },
    });

    const [checkedId, setCheckedId] = useState(null);

    useEffect(() => {
        getData(0)
    }, [])

    const getData = (start, end) => {
        setRequestStatus({
            ...requestStatus,
            getDataStatus: 'loading'
        })
        fetch(`${baseUrl}notes/get-note?start=${start}?end=${end}`)
            .then(data => {
                return data.json()
            })
            .then(value => {
                setBdResponse(value.data);
                setRequestStatus({
                    ...requestStatus,
                    getDataStatus: true
                })
            })
            .catch((err) => {
                setRequestStatus({
                    ...requestStatus,
                    getDataStatus: false
                })
            })
    }

    const removeAllData = () => {
        setRequestStatus({
            ...requestStatus,
            removeAllDataStatus: 'loading'
        })
        fetch(`${baseUrl}notes/delete-all`)
            .then(data => {
                return data.json()
            })
            .then(value => {
                setBdResponse([])
                setRequestStatus({
                    ...requestStatus,
                    removeAllDataStatus: true
                })
            })
            .catch((err) => {
                console.log(err);
                setRequestStatus({
                    ...requestStatus,
                    removeAllDataStatus: false
                })
            })
    }

    const sendData = async () => {
        setRequestStatus({
            ...requestStatus,
            sendDataStatus: 'loading'
        })
        fetch(`${baseUrl}notes/add-new-note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                message: message
            })
        }).then(async data => {
            if (!data.ok) {
                throw data
            }

            const json = await data.json();
            return json
        }).then(value => {
            setBdResponse([...bdResponse, value.data])
            setMessage('')
            setTitle('')
            setRequestStatus({
                ...requestStatus,
                sendDataStatus: true
            })
        }).catch(async (err) => {
            const json = await err.json();
            console.log(json);
            setRequestStatus({
                ...requestStatus,
                sendDataStatus: false
            })
        })
    }

    const removeCheckedNote = (id) => {
        setRequestStatus({
            ...requestStatus,
            removeItemStatus: 'loading'
        })
        fetch(`${baseUrl}notes/delete-item?id=${id}`)
            .then(data => {
                return data.json()
            })
            .then(value => {
                setBdResponse(bdResponse.filter(item => item['_id'] != id))
                setFindedNote(findedNote.filter(item => item['_id'] != id))
                setRequestStatus({
                    ...requestStatus,
                    removeItemStatus: true
                })
            })
            .catch((err) => {
                console.log(err);
                setRequestStatus({
                    ...requestStatus,
                    removeItemStatus: false
                })
            })
    }


    const findNote = (title, message) => {
        const resultSearch = [...bdResponse.filter(note => {
            let matchParams = 0;

            const setMargParams = (name) => {
                if (note.matchFields) {
                    note.matchFields.push(name)
                } else {
                    note.matchFields = [];
                    note.matchFields.push(name)
                }
            }

            if (note.title.includes(searchParams.title) && searchParams.title.length) {
                matchParams++;
                setMargParams('title')
            }

            if (note.message.includes(searchParams.message) && searchParams.message.length) {
                matchParams++
                setMargParams('message')
            }

            if (note.date >= searchParams.rangeDate.start && note.date <= searchParams.rangeDate.end) {
                matchParams++
                setMargParams('date')
            }

            if (matchParams > 0) return true

        })]
        setFindedNote(resultSearch)
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

            <div className="container row-container">
                <TextField
                    id="outlined-basic"
                    label="title"
                    variant="outlined"
                    value={searchParams.title}
                    onChange={(event) => setSearchParams({ ...searchParams, title: event.target.value })}
                    className="field-item"
                />
                <TextField
                    id="outlined-basic"
                    label="message"
                    variant="outlined"
                    value={searchParams.message}
                    onChange={(event) => setSearchParams({ ...searchParams, title: event.target.value })}
                    className="field-item"
                />
                <Button variant="contained" color="primary" onClick={findNote}> Find </Button>
                <div className="row-container">
                    {
                        findedNote.map((note) => (
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
                            </Card>
                        ))
                    }
                </div>
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

                {
                    requestStatus.getDataStatus === 'loading'
                        ? (
                            <Button variant="contained" onClick={sendData} style={{ width: "130px", height: '40px' }} disabled>
                                <CircularProgress color="primary" />
                            </Button>
                        )
                        : (
                            <Button variant="contained" onClick={sendData} style={{ width: "130px", height: '40px' }} >
                                SENT DATA
                            </Button>
                        )

                }


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