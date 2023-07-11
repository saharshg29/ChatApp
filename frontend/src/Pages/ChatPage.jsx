import React, { useEffect, useState } from 'react'
import axios from "axios"
const ChatPage = () => {

    const [chats, setChats] = useState([])

    const fetchChats = () => {
        axios.get("http://localhost:5000/api/chat/")
            .then(data => {
                let packet = data.data
                setChats(packet)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // const fetchChats = async () => {

    //     const response = await fetch('http://localhost:5000/api/chat/', {
    //         method: 'GET',
    //         mode: 'cors',
    //         // headers: {
    //         //     Authorization: `Bearer: ${token}`,
    //         //     'Content-Type': 'application/json',
    //         // },
    //         // body: JSON.stringify(data),
    //     })
    //     console.log(response.json())
    // }


    useEffect(() => {
        fetchChats()
    }, [])

    return (
        <div>
            {

                chats.map((chat) => {
                    return <div key={chat._id}>
                        {
                            chat.chatName
                        }
                    </div>
                })
            }
        </div>
    )
}

export default ChatPage