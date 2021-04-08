export type ChatMessage = { id: string; sessionToken: string; message: string; timestamp: number;};
export type ChatRule = { name: string, check: (msg: string) => boolean, responseOnFail: string };

const MAX_MSG_LENGTH = 140;

const BAD_WORDS = ['dang'];

const isMessageOverMaxLength: ChatRule = {
  name: 'isMessageOverMaxLength',
  check: (msg: string) => msg.length > MAX_MSG_LENGTH,
  responseOnFail: 'Message is over 140 characters.',
};

const isMessageProfane: ChatRule = {
  name: 'isMessageProfane',
  check: (msg: string) => BAD_WORDS.includes(msg),
  responseOnFail: 'Message contains bad words.',
};

export const ChatMessageRules = [isMessageOverMaxLength, isMessageProfane];