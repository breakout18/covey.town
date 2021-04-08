import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import Video from '../../classes/Video/Video';

interface ChatInputProps {
  maxLength: number,
}

export default function ChatInput({ maxLength }: ChatInputProps): JSX.Element {
  const {apiClient, currentTownID, sessionToken } = useCoveyAppState();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const videoInstance = Video.instance();
  const toast = useToast();

  const sendCurrentMessage = async () => {
    setIsLoading(true);
    try {
      await apiClient.sendChat({coveyTownID: currentTownID, sessionToken, message})
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
                onFocus={videoInstance?.pauseListeners}
                onBlur={videoInstance?.unPauseListeners}
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
      </FormControl>
          {/* </Box>
        </Stack>
      </form> */}
    </>
  );
}
