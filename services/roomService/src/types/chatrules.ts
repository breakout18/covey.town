import Player from './Player';

export interface ChatMessage { id: string; sender: Player; message: string; timestamp: number;}
export interface ChatRule { name: string, check(msg: string): boolean, responseOnFail: string }

const MAX_MSG_LENGTH = 140;

const BAD_WORDS = ['dang'];

export const isMessageOverMaxLength: ChatRule = {
  name: 'isMessageOverMaxLength',
  check: (msg: string) => msg.length > MAX_MSG_LENGTH,
  responseOnFail: `Message is over ${MAX_MSG_LENGTH} characters.`,
};

export const isMessageProfane: ChatRule = {
  name: 'isMessageProfane',
  check: (msg: string) => BAD_WORDS.includes(msg),
  responseOnFail: 'Message contains bad words.',
};

export const ChatMessageRules = [isMessageOverMaxLength, isMessageProfane];