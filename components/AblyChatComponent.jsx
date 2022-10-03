import React, { useEffect, useState } from 'react';
import { useChatChannels } from "./AblyReactEffectExtra";
import styles from './AblyChatComponent.module.css';

const AblyChatComponent = () => {

  let inputBox = null;
  let messageEnd = null;
 
  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setMessages] = useState([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [PublishChannel, channel, ably, userID] = useChatChannels("chat-demo", (message) => {
    const history = receivedMessages.slice(-199);
    let msg_array = JSON.parse(message.data)

    setMessages(history.concat(msg_array));
    // msg_array.array.forEach(msg => {  
    //   console.log(msg); 
    //   setMessages([...history, msg]);
    // });
   
  });


  
  const sendChatMessage = (messageText) => {
  //  channel.publish({ name: "chat-message", data: messageText });
    PublishChannel.publish({ name: "chat-message", data: {"user":userID , "txt": messageText }});
    setMessageText("");
    inputBox.focus();
  }

  const handleFormSubmission = (event) => {
    event.preventDefault();
    sendChatMessage(messageText);
  }

  const handleKeyPress = (event) => {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    sendChatMessage(messageText);
    event.preventDefault();
  }

  const messages = receivedMessages.map((message, index) => {
   
    let author = message.user == userID ? "me" : "other";

    // const author = message.connectionId === ably.connection.id ? "me" : "other";
    return <span key={index} className={styles.message} data-author={author}>{message.txt}</span>;
  });

  useEffect(() => {
    messageEnd.scrollIntoView({ behaviour: "smooth" });
  });

  return (
    <div className={styles.chatHolder}>
      <div className={styles.chatText}>
        {messages}
        <div ref={(element) => { messageEnd = element; }}></div>
      </div>
      <form onSubmit={handleFormSubmission} className={styles.form}>
        <textarea
          ref={(element) => { inputBox = element; }}
          value={messageText}
          placeholder="Type a message..."
          onChange={e => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.textarea}
        ></textarea>
        <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>Send</button>
      </form>
    </div>
  )
}

export default AblyChatComponent;