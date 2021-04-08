import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import Video from '../../classes/Video/Video';

export default function ChatInput(): JSX.Element {
  const {apiClient, currentTownID, sessionToken } = useCoveyAppState();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const videoInstance = Video.instance();

  const sendCurrentMessage = async () => {
    setIsLoading(true);
    try {
      await apiClient.sendChat({coveyTownID: currentTownID, sessionToken, message})
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
                onFocus={videoInstance?.pauseListeners}
                onBlur={videoInstance?.unPauseListeners}
                onChange={event => setMessage(event.target.value)}
        />
        <FormHelperText>{`${message.length} / 140`}</FormHelperText>
        <Button
            mt={4}
            colorScheme="teal"
            isLoading={isLoading}
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
