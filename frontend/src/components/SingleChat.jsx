import './styles.css'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogic'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const toast = useToast()

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")

    const { user, selectedChat, setSelectedChat } = ChatState()


    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat

    }, [selectedChat])


    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })


    const fetchMessages = async () => {
        if (!selectedChat) return

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            setLoading(true)

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to send the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    }

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                setNewMessage("")
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config)

                console.log(data)

                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Error Occured",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })

            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
    }

    useEffect(() => {
        fetchMessages()

    }, [selectedChat])


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w={"100%"}
                        fontFamily={"Work sans"}
                        display={'flex'}
                        justifyContent={{ base: "space-between" }}
                        alignItems={"center"}
                    >

                        <IconButton

                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        >
                        </IconButton>
                        {!selectedChat.isGroupChat ? (
                            <>{getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)}></ProfileModal>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                }
                            </>
                        )}
                    </Text>

                    <Box
                        position={"relative"}
                        display={"flex"}
                        flexDirection={"column"}
                        p={3}
                        bg={"#E8E8E8"}
                        w={"100%"}
                        h={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                    >
                        {
                            loading ? (
                                <Spinner
                                    size={"2xl"}
                                    w={20}
                                    h={20}
                                    alignSelf={"center"}
                                    margin={"auto"}
                                    color='Teal'
                                />
                            ) : (
                                <>
                                    <div className='messages'>
                                        <ScrollableChat
                                        style={{width: "90%"}}
                                            messages={messages} />
                                    </div>
                                </>
                            )
                        }
                        <FormControl
                            style={{ position: "absolute", bottom: 4, left: 3}}
                            onKeyDown={sendMessage}
                            isRequired
                            mt={3}
                        >
                            <Input
                                // style={{ position: "absolute", bottom: 4, left: 3 }}
                                position={"bottom"}
                                width={"99%"}
                                variant={"filled"}
                                bg={"white"}
                                placeholder='Message'
                                onChange={typingHandler}
                                value={newMessage}
                                opacity={1}
                            />
                        </FormControl>

                    </Box>
                </>
            ) : (
                <Box display={"flex"}
                    h={"100%"}
                    alignItems={"center"}>
                    <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
                        Click on a user to start Chatting!
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat