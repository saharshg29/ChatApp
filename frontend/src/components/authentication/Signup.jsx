import { FormControl, useToast, InputGroup, FormLabel, Input, VStack, InputRightElement, Button } from '@chakra-ui/react'
import axios from "axios"
import {useNavigate} from "react-router-dom"

import React, { useState } from 'react'

const Signup = () => {
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmpassword] = useState("")
    const [pic, setPic] = useState("")
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()


    const postDetails = (pic) => {
        setLoading(true)
        if (pic === undefined) {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData()
            data.append("file", pic)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dama33gzp")
            fetch("https://api.cloudinary.com/v1_1/dama33gzp/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then((data) => {
                    setPic(data.url.toString())
                    console.log(pic)
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        } else {
            toast({
                title: "Please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return
        }
        if (password !== confirmpassword) {
            toast({
                title: "Password do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",

                },
            }

            const { data } = await axios.post("/api/user",
                { name, email, password, pic },
                config
            );
            toast({
                title: "Signup Sucessfull",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })

            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false)
            navigate('/chats')
        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }


    return (
        <>
            <VStack spacing={"5px"}>
                <FormControl id='first-name' isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        placeholder='Enter Your Name'
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                </FormControl>
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder='Enter Your Email'
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </FormControl>
                <FormControl id='password' isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : "password"}
                            placeholder='Enter Password'
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                        <InputRightElement width={"4.5rem"}>
                            <Button
                                onClick={() => {
                                    setShow(!show)
                                }}
                                h={"1.75rem"} size={"sm"}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl id='confirm-password' isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show2 ? 'text' : "password"}
                            placeholder='Confirm Password'
                            onChange={(e) => {
                                setConfirmpassword(e.target.value)
                            }}
                        />
                        <InputRightElement width={"4.5rem"}>
                            <Button
                                onClick={() => {
                                    setShow2(!show2)
                                }}
                                h={"1.75rem"} size={"sm"}>
                                {show2 ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <FormControl id='pic'>
                    <FormLabel>Upload your picture</FormLabel>
                    <Input
                        type='file'
                        p={1.5}
                        accept='image/*'
                        onChange={(e) => {
                            postDetails(e.target.files[0])
                        }}
                    />
                </FormControl>

                <Button
                    colorScheme='blue'
                    width={"100%"}
                    style={{ marginTop: 15 }}
                    onClick={submitHandler}
                    isLoading={loading}
                >
                    Sign Up
                </Button>

            </VStack>
        </>
    )
}

export default Signup