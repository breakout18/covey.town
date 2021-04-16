import React, { useState} from 'react';
import { useDisclosure } from "react-use-disclosure";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Td,
  Tbody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Th,
  Thead,
  Tr,
  FormHelperText,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Collapse,
  Box,
} from '@chakra-ui/react';
import Picker, { IEmojiData } from 'emoji-picker-react';
import { Search2Icon } from '@chakra-ui/icons';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import Video from '../../classes/Video/Video';

interface ChatInputProps {
  maxLength: number,
}

export default function ChatInput({ maxLength }: ChatInputProps): JSX.Element {
  const {apiClient, chatHistory, currentTownID, sessionToken } = useCoveyAppState();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  

  const videoInstance = Video.instance();
  const toast = useToast();

  const onEmojiClick = (emojiObject: IEmojiData) => {
    setMessage(`${message}${emojiObject.emoji}`)
  };

  const sendCurrentMessage = async () => {
    setIsLoading(true);
    try {
      await apiClient.sendChat({coveyTownID: currentTownID, sessionToken, message});
      setMessage('');
    }
    catch (err) {
      toast({
        title: 'Unable to send message',
        description: err.toString(),
        status: 'error'
      })
    }
    finally {
      setIsLoading(false);
    }
  }

  function getDate(timestamp: number) {
    const d = new Date(timestamp);
    return `${d.getMonth()+1   }-${  d.getDate()  }-${  d.getFullYear()  } ${ 
    d.getHours()  }:${  d.getMinutes()}`;
  }

  function DisplayHistory() {
    const { isOpen, open, close } = useDisclosure();

    return (
      <>
        <Button onClick={open}>Message History</Button>
  
        <Modal scrollBehavior="inside" blockScrollOnMount={false} onClose={close} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Message History</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table>
                  <Thead><Tr><Th>timestamp</Th>
                  <Th>message</Th>
                  <Th>user</Th>
                  </Tr></Thead>
                  <Tbody>
                    {chatHistory.map((msg) => (
                    <Tr key={msg.id}><Td role='cell'>{getDate(msg.timestamp)}</Td><Td
                      role='cell'>{msg.message}</Td>
                      <Td role='cell'>{msg.sender._userName}</Td></Tr>))}
                </Tbody>
                </Table>
            </ModalBody>
            <ModalFooter>
              <Button onClick={close}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  function DisplayChatInput() {
    const { isOpen, toggle } = useDisclosure();

    return (
      <>
        <FormControl id="chatBox" style={{width: '50%'}}>
          <FormLabel htmlFor="chatMessage">Send message</FormLabel>
          <InputGroup>
            <Input name="chatMessage" placeholder="Enter message..."
                    value={message}
                    isInvalid={message.length > maxLength}
                    focusBorderColor={message.length > maxLength ? 'red.500' : 'blue.500'}
                    onFocus={videoInstance?.pauseGame}
                    onBlur={videoInstance?.unPauseGame}
                    onChange={event => setMessage(event.target.value)}
            />
            <InputRightElement>
              <IconButton aria-label="Search emojis" icon={<Search2Icon />} onClick={toggle} />
            </InputRightElement>
          </InputGroup>
          <Collapse in={isOpen} animateOpacity>
          <Box onFocus={videoInstance?.pauseGame} onBlur={videoInstance?.unPauseGame}>
            <Picker onEmojiClick={(_event, data) => onEmojiClick(data)} disableAutoFocus preload native/>
          </Box>
          </Collapse>
          <FormHelperText style={{'color': message.length > maxLength ? 'red' : ''}}>{`${message.length} / ${maxLength}`}</FormHelperText>
          <Button
              mt={4}
              colorScheme="teal"
              isLoading={isLoading}
              isDisabled={message.length > maxLength}
              type="submit"
              onClick={sendCurrentMessage}
            >
              Submit
            </Button>
            {DisplayHistory()}
        </FormControl>
      </>
    );
  }

  return DisplayChatInput();
}
