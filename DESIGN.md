# Quick Chat Documentation
---

- [Architecture](#architecture)
  - [High level overview](#high-level-overview)
  - [In-depth, step-by-step flow](#in-depth-step-by-step-flow)
    - [The sender sends a request via the REST API.](#the-sender-sends-a-request-via-the-rest-api)
      - [HTTP](#http)
      - [cURL](#curl)
    - [The server recieves and parses the request.](#the-server-recieves-and-parses-the-request)
    - [The request handler interprets the request data and dispatches it to the town controller.](#the-request-handler-interprets-the-request-data-and-dispatches-it-to-the-town-controller)
      - [Errors](#errors)
    - [The message is validated by the controller.](#the-message-is-validated-by-the-controller)
      - [Errors](#errors-1)
    - [The message is stored in the controller and all the `CoveyTownListeners` subscribed to the town are alerted.](#the-message-is-stored-in-the-controller-and-all-the-coveytownlisteners-subscribed-to-the-town-are-alerted)
    - [The socket emits an event to the client.](#the-socket-emits-an-event-to-the-client)
    - [The client recieves the message and renders it on screen.](#the-client-recieves-the-message-and-renders-it-on-screen)
- [Error handling](#error-handling)
  - [Town with ID does not exist.](#town-with-id-does-not-exist)
  - [Session with sessionToken does not exist.](#session-with-sessiontoken-does-not-exist)
  - [Message breaks validation rules](#message-breaks-validation-rules)
- [Proposed changes to existing codebase](#proposed-changes-to-existing-codebase)
  - [Modify socket implementation to support `sendChat` event.](#modify-socket-implementation-to-support-sendchat-event)
  - [Add `ChatInput` component to `App`.](#add-chatinput-component-to-app)
  - [Modify `WorldMap` to support showing messages above avatars.](#modify-worldmap-to-support-showing-messages-above-avatars)
## Architecture


### High level overview

![architecture overview](architecture.svg "Architecture overview")

### In-depth, step-by-step flow
Consider a town with multiple connected players:
- the ID of the town is `1A08F7F2`
- the sender is connected to the town and their session token is `PbMc3xlssyAMAZrbeJ3mG`
- the sender wants to say `hello town!`

![flow diagram](flow_diagram.svg "Flow diagram")

#### The sender sends a request via the REST API.

> **Note:** The frontend UI is the intended interface that users will use to send messages. It will automatically generate the following requests *and* provide interactive feedback while the user is entering a message. See [FEATURE.md](FEATURE.md) for details about the frontend and our user stories.
> 
##### HTTP
```HTTP
POST /towns/1A08F7F2/chat HTTP/1.1
Host: covey-town.herokuapp.com
Content-Type: application/json

{
    "sessionToken": "PbMc3xlssyAMAZrbeJ3mG",
    "message": "hello town!"
}
```
##### cURL
```shell-session
curl --location --request POST 'https://covey-town.herokuapp.com/1A08F7F2/chat' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sessionToken": "PbMc3xlssyAMAZrbeJ3mG",
    "message": "hello town!"
}'
```

---
#### The server recieves and parses the request.

The request data is used to create a `TownChatSendRequest` object, which is passed to the `townChatSendHandler`:
```ts
{
    coveyTownID: '1A08F7F2',
    sessionToken: 'PbMc3xlssyAMAZrbeJ3mG',
    message: 'hello town!'
}
```

---
#### The request handler interprets the request data and dispatches it to the town controller.

The handler will clean the message of any preceeding/trailing white space and illegal characters. If the town ID is valid, the handler will query the associated controller for the `Player` object associated with the given session token. The handler will then generate a unique ID for the message and create a `ChatMessage` object to pass to the controller:

```ts
{
    id: 'ABCD1234',
    sender: { _id_: '...' , _userName: '...', ... },
    message: 'hello town!'
}
```

##### Errors
> - [Town with ID does not exist.](#town-with-id-does-not-exist)
> - [Session with sessionToken does not exist.](#session-with-sessiontoken-does-not-exist)

---
#### The message is validated by the controller.

> **Note:**  Currently, controllers only use the default set of rules defined by `ChatMessageRules`, but this can be customized.

The controller will check the string against all validation rules. Some of these rules use environment variables that can be customized when setting up.

##### Errors
> - [Message breaks validation rules.](#message-breaks-validation-rules)

---
#### The message is stored in the controller and all the `CoveyTownListeners` subscribed to the town are alerted.

When a message passes validation, it is stored in the controller's `_chatHistory` property and all subscribed listeners are dispatched. 

---
#### The socket emits an event to the client.

The socket emits a `sendChat` event and the `ChatMessage` object to each connected session.

---
#### The client recieves the message and renders it on screen.

When the frontend recieves the `sendChat` event, it will append the message to `chatHistory` property of the the global app state and render the message in the world using the Phaser API. Each client will see the message appear above the sender's avatar.

The toggleable chat history displays all the messages stored in the `chatHistory` property of the the global app state. `chatHistory` is a state variable of the `ChatInput` component, so the history view will update automatically whenever a new message is sent (no need to reload or requery the same messages).

---
## Error handling

All defined responses by the server are of the form:

> ```ts
> {
>     isOK: false,
>     response: {
>         message: "...",
>         offset: "...",
>     },
>     message: "Error processing request: ...",
> };
> ```

### Town with ID does not exist.
If the request provides a town ID which does not exist, the server will respond to the client by notifying them that the message was *not* sent.
```ts
{
    ...
    message: "Error processing request: Town with ID does not exist.",
};
```

### Session with sessionToken does not exist.
If the request provides a `sessionToken` which does not refer to a session connected to the given town, the server will respond to the client by notifying them that the message was *not* sent.
```ts
{
    ...
    message: "Error processing request: Session with sessionToken does not exist.",
};
```

### Message breaks validation rules
> **Note:** The descriptive rule error message is given by a rule's `responseOnFail` property.

If the message breaks any of the chat rules (e.g., it contains a word in `BANNED_WORDS`), the server will respond to the client by notifying them that the message was *not* sent and what rule was broken.
```ts
{
    ...
    message: "Error processing request: Message contains bad words.",
};
```

---
## Proposed changes to existing codebase

  
### Modify socket implementation to support `sendChat` event.
To be modified:
- `services/roomService/src/`
  - `CoveyTownListener.ts`
    - `CoveyTownListener`
  - `requestHandlers/CoveyTownRequestHandlers.ts`
    - `townSocketAdapter(...)`
- `frontend/src/`
  - `App.tsx`
    - `CoveyAppUpdate`
    - `defaultAppState()`
    - `appStateReducer(...)`
    - `GameController(...)`
  - `CoveyTypes.ts`
    - `CoveyAppState`

The signature of `CoveyTownListener` interface will be updated to include:
```ts
onMessageSent(message: ChatMessage): void;
```

`townSocketAdapter(...)` will be updated to include:
```ts
onMessageSent(message: ChatMessage) {
    socket.emit('messageSent', message);
}
```

The signatures of both `CoveyAppUpdate` and `CoveyAppState` should be modified to include:
```ts
{
    ...
    chatHistory: ChatMessage[],
    ...
}
```

`App.tsx` will need to include `sendChat` as an update action:
```tsx
  switch (update.action) {
      ...
      case 'messageSent': ...
      ...
  }
```

as will `GameController(...)`:
```tsx
async function GameController(initData: TownJoinResponse, dispatchAppUpdate: (update: CoveyAppUpdate) => void) {
...
  socket.on('messageSent', (message: ChatMessage) => {
      ...
  });
...
}
```


Additionally, `defaultAppState()` and `appStateReducer(...)` must be updated to reflect the updated signature and support storing and accessing messages in the `chatHistory` property.

This modification does not change any pre-existing behaviors. We are proposing this change because it is a logical way to ensure that:
- Clients only see the message history from when they joined the town.
- Clients are automatically notified whenever a new message is sent (and their chat histories are automatically updated).
- History is always kept in chronological order.
- Avoids a complicated message history REST API. There is no database being used, so there is no need to create an interface for users to query the chat history. Using the socket and storing messages locally differs from our original plan, but makes much more sense to us.
- Minimizes number of HTTP requests sent to server.
- Only has to alert each connected user once whenever a message is sent. Though technically a REST API implementation may in theory reduce bandiwdth on average (because messages would not be automatically sent to players), in practice, clients would never be requesting one message at a time. Besides having to send more messages per request, there would be many duplicate messages sent to the same client.
- Reduces the server's responsibility to just provide the message to the client, and the client's to just update the UI with the message. If using a REST API, there would be much more server-side computing to handle each individual request (e.g., query the controller's chat history, ensure it is in chronological order, slice it based on the offset and limit provided by the client, etc.) and much more client-side computing as well (e.g., ensure no duplicates, order the messages, calculate the new offset, etc.).

### Add `ChatInput` component to `App`.
To be modified:
- `frontend/src/App.tsx`

Our `ChatInput` component, which handles UI for both sending messages and viewing message history, will need to be rendered in the app.

```tsx
function App(props: { setOnDisconnect: Dispatch<SetStateAction<Callback | undefined>> }) {
  ...
  return (
      <div>
        <WorldMap />
        <ChatInput maxLength={140} />
        <VideoOverlay preferredMode="fullwidth" />
      </div>
    );
    ...
}
```

Without doing this, the user will have no way of seeing chatHistory or sending messages via the app UI.

### Modify `WorldMap` to support showing messages above avatars.
To be modified:
- `frontend/src/components/world/WorldMap.tsx`
  - `CoveyGameScene`
    - `updatePlayersLocations(...)`
    - `updatePlayerLocation(...)`
    - `update()`
    - `create()`
  - `WorldMap()`