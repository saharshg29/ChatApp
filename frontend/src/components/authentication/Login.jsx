import React, { useState } from 'react'
import { FormControl, InputGroup, FormLabel, Input, VStack, InputRightElement, Button } from '@chakra-ui/react'


const Login = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const postDetails = (pic) => {

    }

    const submitHandler = () => {

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