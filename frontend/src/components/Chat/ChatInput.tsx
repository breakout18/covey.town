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
} from '@chakra-ui/react';
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

  const sendCurrentMessage = async () => {
    setIsLoading(true);
    try {
      await apiClient.sendChat({coveyTownID: currentTownID, sessionToken, message});
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
                    <Tr key={msg.id}><Td role='cell'>{msg.timestamp}</Td><Td
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

  return (
    <>
      {/* <form>
        <Stack>
          <Box p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="span" size="sm">Chat</Heading> */}
      <FormControl id="chatBox">
        <FormLabel htmlFor="chatMessage">Send message</FormLabel>
        <Input name="chatMessage" placeholder="Enter message..."
                value={message}
                isInvalid={message.length > maxLength}
                focusBorderColor={message.length > maxLength ? 'red.500' : 'blue.500'}
                onFocus={videoInstance?.pauseGame}
                onBlur={videoInstance?.unPauseGame}
                onChange={event => setMessage(event.target.value)}
        />
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
          {/* </Box>
        </Stack>
      </form> */}
    </>
  );
}
