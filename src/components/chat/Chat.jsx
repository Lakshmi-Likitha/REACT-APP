// // import { useEffect, useRef, useState } from "react";
// // import "./chat.css";
// // import EmojiPicker from "emoji-picker-react";
// // import { arrayUnion, doc, getDoc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
// // import { db } from "../../lib/firebase";
// // import { useChatStore } from "../../lib/chatStore";
// // import { useUserStore } from "../../lib/userStore";
// // import upload from "../../lib/upload";

// // const Chat = () => {
// //     const [chat, setChat] = useState();
// //     const [open, setOpen] = useState(false);
// //     const [text, setText] = useState("");
// //     const [img, setImg] = useState({
// //         file: null,
// //         url: ""
// //     });

// //     const { currentUser } = useUserStore();
// //     const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();

// //     const endRef = useRef(null);

// //     useEffect(() => {
// //         endRef.current?.scrollIntoView({ behavior: "smooth" });
// //     }, [chat?.messages]);

// //     useEffect(() => {
// //         if (!chatId) return;

// //         const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
// //             setChat(res.data());
// //         });

// //         return () => {
// //             unSub();
// //         };
// //     }, [chatId]);

// //     const handleEmoji = (e) => {
// //         setText((prev) => prev + e.emoji);
// //         setOpen(false);
// //     };

// //     const handleImg = (e) => {
// //         if (e.target.files[0]) {
// //             setImg({
// //                 file: e.target.files[0],
// //                 url: URL.createObjectURL(e.target.files[0])
// //             });
// //         }
// //     };

// //     const handleSend = async () => {
// //         if (text === "" && !img.file) return;
// //         if (isCurrentUserBlocked || isReceiverBlocked) return;

// //         let imgUrl = null;

// //         try {
// //             if (img.file) {
// //                 imgUrl = await upload(img.file);
// //             }

// //             const newMessage = {
// //                 id: Date.now().toString(), // Adding an id for each message
// //                 senderId: currentUser.id,
// //                 text,
// //                 createdAt: new Date(),
// //                 ...(imgUrl && { img: imgUrl }),
// //             };

// //             await updateDoc(doc(db, "chats", chatId), {
// //                 messages: arrayUnion(newMessage)
// //             });

// //             const userIDs = [currentUser.id, user.id];
// //             userIDs.forEach(async (id) => {
// //                 const userChatsRef = doc(db, "userchats", id);
// //                 const userChatsSnapShot = await getDoc(userChatsRef);

// //                 if (userChatsSnapShot.exists()) {
// //                     const userChatsData = userChatsSnapShot.data();

// //                     const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

// //                     userChatsData.chats[chatIndex].lastMessage = text;
// //                     userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
// //                     userChatsData.chats[chatIndex].isUpdated = Date.now();

// //                     await updateDoc(userChatsRef, {
// //                         chats: userChatsData.chats,
// //                     });
// //                 }
// //             });

// //             const userRef = doc(db, "users", currentUser.id);
// //             await updateDoc(userRef, {
// //                 sharedPhotos: arrayUnion({
// //                     chatId,
// //                     img: imgUrl,
// //                     createdAt: new Date(),
// //                 })
// //             });
// //         } catch (err) {
// //             console.log(err);
// //         }

// //         setImg({
// //             file: null,
// //             url: ""
// //         });

// //         setText("");
// //     };

// //     // const handleDeleteMessage = async (messageId) => {
// //     //     try {
// //     //         // Show confirmation dialog
// //     //         const confirmDelete = window.confirm("Are you sure you want to delete this message?");
// //     //         if (confirmDelete) {
// //     //             const newMessages = chat.messages.filter(message => message.id !== messageId);
// //     //             await updateDoc(doc(db, "chats", chatId), {
// //     //                 messages: newMessages
// //     //             });
// //     //         }
// //     //     } catch (err) {
// //     //         console.log(err);
// //     //     }
// //     // };

// //     const handleDeleteMessage = async (messageId) => {
// //         try {
// //             // Show confirmation dialog
// //             const confirmDelete = window.confirm("Are you sure you want to delete this message?");
// //             if (confirmDelete) {
// //                 const newMessages = chat.messages.filter(message => message.id !== messageId);
// //                 await updateDoc(doc(db, "chats", chatId), {
// //                     messages: newMessages
// //                 });

// //                 // Get the index of the deleted message
// //                 const deletedMessageIndex = chat.messages.findIndex(message => message.id === messageId);

// //                 // Get the message before the deleted message, if it exists
// //                 const newLastMessage = chat.messages[deletedMessageIndex - 1] || null;

// //                 // Update the last message in the chat list
// //                 await updateChatList(chatId, newLastMessage);
// //             }
// //         } catch (err) {
// //             console.log(err);
// //         }
// //     };


// //     return (
// //         <div className='chat'>
// //             <div className="top">
// //                 <div className="user">
// //                     <img src={user?.avatar || "./avatar.png"} alt="" />
// //                     <div className="texts">
// //                         <span>{user?.username}</span>
// //                         <p>{user?.description || "No description available."}</p>
// //                     </div>
// //                 </div>
// //                 <div className="icons">
// //                     <img src="./info.png" alt="" />
// //                 </div>
// //             </div>
// //             <div className="center">
// //                 {chat?.messages?.map((message) => (
// //                     <div
// //                         className={message.senderId === currentUser?.id ? "message own" : "message"}
// //                         key={message?.id}
// //                         onContextMenu={(e) => {
// //                             e.preventDefault();
// //                             handleDeleteMessage(message.id);
// //                         }}
// //                     >
// //                         <div className="texts">
// //                             {message.img && <img src={message.img} alt="" />}
// //                             <p>{message.text}</p>
// //                             <span className="timestamp">{new Date(message.createdAt.toDate()).toLocaleTimeString()}</span>
// //                         </div>
// //                     </div>
// //                 ))}
// //                 {img.url && (
// //                     <div className="message own">
// //                         <div className="texts">
// //                             <img src={img.url} alt="" />
// //                         </div>
// //                     </div>
// //                 )}
// //                 <div ref={endRef}></div>
// //             </div>
// //             <div className="bottom">
// //                 <div className="icons">
// //                     <label htmlFor="file">
// //                         <img src="./img.png" alt="" />
// //                     </label>
// //                     <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
// //                 </div>
// //                 <input
// //                     type="text"
// //                     placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."}
// //                     value={text}
// //                     onChange={e => setText(e.target.value)}
// //                     disabled={isCurrentUserBlocked || isReceiverBlocked}
// //                 />
// //                 <div className="emoji">
// //                     <img src="./emoji.png"
// //                         alt=""
// //                         onClick={() => setOpen(prev => !prev)}
// //                     />
// //                     <div className="picker">
// //                         <EmojiPicker open={open} onEmojiClick={handleEmoji} />
// //                     </div>
// //                 </div>
// //                 <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
// //             </div>
// //         </div>
// //     );
// // }

// // export default Chat;




import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
    const [chat, setChat] = useState(null);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: ""
    });
    
    const [lastDisplayedDate, setLastDisplayedDate] = useState(null); // State to track last displayed date
    const [showInfoMessage, setShowInfoMessage] = useState(false); // State to toggle info message

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();

    const endRef = useRef(null);

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat?.messages]);

    useEffect(() => {
        if (!chatId) return;

        const chatRef = doc(db, "chats", chatId);
        const unSub = onSnapshot(chatRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setChat(docSnapshot.data());
            } else {
                setChat(null);
            }
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };

    const handleSend = async () => {
        if (text === "" && !img.file) return;
        if (isCurrentUserBlocked || isReceiverBlocked) return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            const newMessage = {
                id: Date.now().toString(),
                senderId: currentUser.id,
                text,
                createdAt: new Date(),
                ...(imgUrl && { img: imgUrl }),
            };

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion(newMessage)
            });

            const userIDs = [currentUser.id, user.id];
            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapShot = await getDoc(userChatsRef);

                if (userChatsSnapShot.exists()) {
                    const userChatsData = userChatsSnapShot.data();
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = text;
                        userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
                        userChatsData.chats[chatIndex].updatedAt = new Date();

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    }
                }
            });

            await updateDoc(doc(db, "users", currentUser.id), {
                sharedPhotos: arrayUnion({
                    chatId,
                    img: imgUrl,
                    createdAt: new Date(),
                })
            });
        } catch (err) {
            console.log(err);
        }

        setImg({
            file: null,
            url: ""
        });

        setText("");
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this message?");
            if (confirmDelete) {
                const newMessages = chat.messages.filter(message => message.id !== messageId);
                await updateDoc(doc(db, "chats", chatId), {
                    messages: newMessages
                });

                const deletedMessageIndex = chat.messages.findIndex(message => message.id === messageId);
                const newLastMessage = chat.messages[deletedMessageIndex - 1] || null;

                await updateChatList(chatId, newLastMessage);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const updateChatList = async (chatId, lastMessage) => {
        const userIDs = [currentUser.id, user.id];
        userIDs.forEach(async (id) => {
            const userChatsRef = doc(db, "userchats", id);
            const userChatsSnapShot = await getDoc(userChatsRef);

            if (userChatsSnapShot.exists()) {
                const userChatsData = userChatsSnapShot.data();
                const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                if (chatIndex !== -1) {
                    userChatsData.chats[chatIndex].lastMessage = lastMessage?.text || '';
                    userChatsData.chats[chatIndex].updatedAt = new Date();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            }
        });
    };

    const renderMessageDate = (message, index) => {
        const messageDate = message.createdAt.toDate(); // Convert Firestore Timestamp to JavaScript Date
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if it's the first message or a new day
        if (index === 0 || messageDate.toDateString() !== chat?.messages[index - 1].createdAt.toDate().toDateString()) {
            return (
                <div className="date">
                    {getDisplayDate(messageDate, today, yesterday)}
                </div>
            );
        }

        return null;
    };

    const getDisplayDate = (messageDate, today, yesterday) => {
        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString(); // Display full date for older messages
        }
    };

    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>{user?.description || "No description available."}</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./info.png" alt="" onClick={() => setShowInfoMessage(true)} />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message, index) => (
                    <div
                        key={message?.id}
                        className={message.senderId === currentUser?.id ? "message own" : "message"}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            handleDeleteMessage(message.id);
                        }}
                    >
                        <div className="texts">
                            {renderMessageDate(message, index)}
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                            <span className="timestamp">{new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                    </div>
                ))}
                {img.url && (
                    <div className="message own">
                        <div className="texts">
                            <img src={img.url} alt="" />
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
                </div>
                <input
                    type="text"
                    placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className="emoji">
                    <img src="./emoji.png"
                        alt=""
                        onClick={() => setOpen(prev => !prev)}
                    />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                {showInfoMessage && (
                    <div className="info-message">
                        You are in {user?.username}'s chat box.
                    </div>
                )}
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    );
}

export default Chat;

