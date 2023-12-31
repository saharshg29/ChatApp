import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../context/ChatProvider'
import { useNavigate } from 'react-router-dom'
import ProfileModal from './ProfileModal'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogic'

const SideDrawer = () => {
  const { user, setSelectedChat, selectedChat, chats, setChats, notification, setNotification } = ChatState()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast()
  const logOut = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const handleSearch = async () => {
    console.log(search)
    if (!search) {
      toast({
        title: "Search field cant be empty",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return
    }
    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`/api/user?search=${search}`, config)
      setLoading(false)
      setSearchResult(data)
      console.log(data)
    }
    catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.post("/api/chat", { userId }, config)
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {
      toast({
        title: "Error Fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search User to chat" hasArrow placement='bottom-end'>
          <Button onClick={onOpen} variant={"ghost"}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip >

        <Text fontSize={"2xl"} fontFamily="Work sans">
          Talk-a-Tive
        </Text>

        <div>
          <Menu>
            {notification.length === 0 ? (
              <><MenuButton
                // backgroundColor={"teal"}
                minHeight={"50px"}
                p={1}>
                <BellIcon fontSize={"2xl"} m={1}>
                </BellIcon>
              </MenuButton></>
            ) : (
              <>

                <MenuButton
                marginRight={4}
                backgroundColor={"teal"}
                width={"40px"}
                height={"8vh"}
                borderRadius={20}
                >{notification.length}</MenuButton>


                {/* <Avatar name={2}/> */}
                {/* <span
                  style={{ fontSize: "20px", borderRadius: "20px", backgroundColor: "red", marginRight: "40px", fontWeight: "bolder" }}
                >{notification.length}</span> */}

              </>
            )}

            <MenuList>
              <span
                style={{ paddingLeft: "5px" }}
              > {!notification.length && "No new Messages....."} </span>
              {notification.map(notify => (
                <MenuItem
                  onClick={() => {
                    setSelectedChat(notify.chat)
                    setNotification(notification.filter((n) => n !== notify))
                  }}
                  key={notify._id}>
                  {notify.chat.isGroupChat
                    ? `New Message in ${notify.chat.chatName}`
                    : `New Message from ${getSender(user, notify.chat.users)}`
                  }
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={"sm"}
                src={user.pic}
                cursor={"pointer"}
                name={user.name}></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOut}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {
              loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)} />
                ))
              )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer