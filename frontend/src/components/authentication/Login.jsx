import React, { useState } from 'react'
import { FormControl, useToast, InputGroup, FormLabel, Input, VStack, InputRightElement, Button } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()


    // const postDetails = (pic) => {

    // }

    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
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
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",

                },
            }

            const { data } = await axios.post("/api/user/login",
                { email, password },
                config
            );
            toast({
                title: "Login Sucessfull",
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

                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder='Enter Your Email'
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        value={email}
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
                            value={password}
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
                <Button
                    colorScheme='blue'
                    width={"100%"}
                    style={{ marginTop: 15 }}
                    onClick={submitHandler}
                    isLoading={loading}
                >
                    Log In
                </Button>

                <Button
                    variant={"solid"}
                    colorScheme="red"
                    width={"100%"}
                    onClick={() => {
                        setEmail("guest@example.com")
                        setPassword("Guest@TALKATIVE")
                    }}
                >                    Get User Credential
                </Button>

            </VStack>
        </>
    )
}

export default Login