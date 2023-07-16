import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <>
            <Box
            // ={"center"}
                px={2}
                py={1}
                borderRadius={"lg"}
                m={1}
                mb={2}
                variant="solid"
                
                background="purple"
                cursor={"pointer"}
                onClick={handleFunction}
                color={'white'}
            >
                <span style={{fontSize: "12px", padding: "3px", margin: "5px", textTransform:"capitalize"}}>{user.name}</span>
                <CloseIcon 
                // marginTop={"15px"}
                />
            </Box>
        </>
    )
}

export default UserBadgeItem