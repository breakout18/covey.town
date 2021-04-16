# Use Cases for Covey.Town

## Use Case 1: Send Messages

**User Story:** “As a Covey.Town user, I want to be able to send messages via public text chat so that I can say something to other Covey.Town users from a distance.”

**Conditions of Satisfaction:**

- Being able to send messages to users who aren't nearby
- Being able to use text of emojis in my messages
- Being able to see my messages as text boxes above my avatar

| Use Case Field     | Description                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Use Case 1         | Send Messages                                                                                                                                                                                                                                                                                                                                                                              |
| Actor              | A Town member (message sender)                                                                                                                                                                                                                                                                                                                                                             |
| Use Case Overview  | A user joins a Covey Town and wishes to send a text-message to another user <br> who is visible but may not be within video call distance. They select the send <br> message input area, type in their message, and click `Submit` to send it. <br> The sent message appears above their head as a text box. To return to the <br> Covey Town "game", the user must click on the game map. |
| Trigger            | A user wants to send a text-message                                                                                                                                                                                                                                                                                                                                                        |
| Precondition 1     | The sender is (or can walk to) within visible distance of the intendeded recipient(s)                                                                                                                                                                                                                                                                                                      |
| Precondition 2     | The sender and intended recipient(s) are in the same Covey Town.                                                                                                                                                                                                                                                                                                                           |
| Alternative Flow 1 | If the user wants to send emojis in the message, they hit the `search` button <br>and select an emoji to add to the message`                                                                                                                                                                                                                                                               |
| Alternative Flow 2 | If the user tries to send a message over the predetermined character limit <br> or if the message contains blacklisted content, the message will not send                                                                                                                                                                                                                                  |

## Use Case 2: View Messages

**User Story:** “As a Covey.Town user, I want to view public messages so I can see what other users are saying without interrupting what I am already doing.”

**Conditions of Satisfaction:**

- Being able to see messages sent by users anywhere within visible distance
- Being able to see messages without leaving a call / conversation
- Being able to see messages as text boxes above the other user's avatar

| Use Case Field    | Description                                                                                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use Case 1        | View Messages                                                                                                                                                                                                         |
| Actor             | A Town member (message recipient)                                                                                                                                                                                     |
| Use Case Overview | A user joins a Covey Town and wishes to see a text-message sent by another user. <br> The user navigates within viewing distance of the sender and can see that the<br> message is visible above the sender's avatar. |
| Precondition 1    | The user who wishes to view the message is (or can walk to) within visible <br>distance of the sender                                                                                                                 |
| Precondition 2    | The user and the sender are in the same Covey Town.                                                                                                                                                                   |

## Use Case 3: View Message History

**User Story:** “As a Covey.Town user, I want to be able to see the history of messages sent in my room so that I can read any messages that I missed or want to reread.”

**Conditions of Satisfaction:**

- Being shown all messages sent in the town after I joined
- Being able to toggle visibility of the message history
- Being able to see when a message was sent and who sent it

| Use Case Field     | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use Case 1         | View Message History                                                                                                                                                                                                                                                                                                                                                                          |
| Actor              | A Covey Town user                                                                                                                                                                                                                                                                                                                                                                             |
| Use Case Overview  | A user joins a Covey Town and wishes to see messages that have been sent <br> in that town since they joined. They select the `Message History` button, and a <br> panel appears with a list of messages that have been sent since they joined. <br> The user can see message details include the timestamp, content, and sender. <br>The user can close the panel by hitting the `X` button. |
| Alternative Flow 1 | If there are more messages in the history than will appear on the screen at once, <br> the user scrolls to see more messages.                                                                                                                                                                                                                                                                 |
| Alternative Flow 2 | If the user has left and rejoined (new session) they will only see messages sent <br> since they rejoined.                                                                                                                                                                                                                                                                                    |
