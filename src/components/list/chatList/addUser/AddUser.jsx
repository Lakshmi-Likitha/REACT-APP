// import { useState } from "react";
// import { db } from "../../../../lib/firebase";
// import "./addUser.css"
// import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
// import { useUserStore } from "../../../../lib/userStore";

// const AddUser = () => {
//     const [user, setUser] = useState(null);
//     const { currentUser } = useUserStore();

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const username = formData.get("username");

//         try {
//             const userRef = collection(db, "users");
//             const q = query(userRef, where("username", "==", username));

//             const querySnapShot = await getDocs(q)
//             if (!querySnapShot.empty) {
//                 setUser(querySnapShot.docs[0].data())
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     // const handleAdd = async () => {
//     //     if (!user) return;

//     //     try {
//     //         // Check if the user is already in the chat list
//     //         const userChatsRef = doc(db, "userchats", currentUser.id);
//     //         const userChatsSnap = await getDoc(userChatsRef);
//     //         const userChatsData = userChatsSnap.data();

//     //         if (userChatsData.chats.some(chat => chat.receiverId === user.id)) {
//     //             // User is already in the chat list
//     //             console.log("User is already in the chat list");
//     //         } else {
//     //             // User is not in the chat list, add them
//     //             const chatRef = collection(db, "chats");

//     //             const newChatRef = doc(chatRef);
//     //             await setDoc(newChatRef, {
//     //                 createdAt: serverTimestamp(),
//     //                 messages: [],
//     //             });

//     //             const userChatData = {
//     //                 chatId: newChatRef.id,
//     //                 lastMessage: "",
//     //                 receiverId: currentUser.id,
//     //                 updatedAt: Date.now(),
//     //             };

//     //             await updateDoc(userChatsRef, {
//     //                 chats: arrayUnion(userChatData),
//     //             });
//     //             await updateDoc(doc(userChatsRef, user.id), {
//     //                 chats: arrayUnion(userChatData),
//     //             });

//     //             console.log("User added to the chat list");
//     //         }

//     //         setUser(null); // Clear the user after adding
//     //     } catch (err) {
//     //         console.log(err);
//     //     }
//     // };

//         const handleAdd = async () => {
//             if (!user) return;

//             const chatRef = collection(db, "chats");
//             const userChatsRef = collection(db, "userchats");

//             try {
//                 // Create a new chat document with an auto-generated ID
//                 const newChatRef = doc(chatRef);

//                 // Use the new document reference to set initial data
//                 await setDoc(newChatRef, {
//                     createdAt: serverTimestamp(),
//                     messages: [],
//                 });

//                 // Log the new document ID
//                 // console.log("New chat document ID:", newChatRef.id);

//                 const userChatData = {
//                     chatId: newChatRef.id,
//                     lastMessage: "",
//                     receiverId: currentUser.id,
//                     updatedAt: Date.now(),
//                 };

//                 // Update userChats collection with the new chat info for both users
//                 await updateDoc(doc(userChatsRef, user.id), {
//                     chats: arrayUnion(userChatData),
//                 });

//                 await updateDoc(doc(userChatsRef, currentUser.id), {
//                     chats: arrayUnion({
//                         ...userChatData,
//                         receiverId: user.id,
//                     }),
//                 });

//                 setUser(null); // Clear the user after adding
//             } catch (err) {
//                 console.log(err);
//                 setError("Failed to add user");
//             }
//         };

//     return (
//         <div className="addUser">
//             <form onSubmit={handleSearch}>
//                 <input type="text" placeholder="Username" name="username" />
//                 <button>Search</button>
//             </form>
//             {user && (
//                 <div className="user">
//                     <div className="detail">
//                         <img src={user.avatar || "./avatar.png"} alt="" />
//                         <span>{user.username}</span>
//                     </div>
//                     <button onClick={handleAdd}>Add User</button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default AddUser;





import { useState } from "react";
import { db } from "../../../../lib/firebase";
import "./addUser.css";
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));

            const querySnapShot = await getDocs(q);
            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAdd = async () => {
        if (!user) return;

        // Check if the user is trying to add themselves
        if (user.id === currentUser.id) {
            console.log("Cannot add yourself to the chat list.");
            return;
        }

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            // Check if the user is already in the chat list
            const userChatsSnap = await getDoc(userChatsRef);
            const userChatsData = userChatsSnap.data();

            if (userChatsData && userChatsData.chats.some((chat) => chat.receiverId === user.id)) {
                console.log("User is already in the chat list");
                return;
            }

            const chatRef = collection(db, "chats");
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            const userChatData = {
                chatId: newChatRef.id,
                lastMessage: "",
                receiverId: user.id,
                updatedAt: Date.now(),
            };

            await updateDoc(userChatsRef, {
                chats: arrayUnion(userChatData),
            });

            const otherUserChatsRef = doc(db, "userchats", user.id);
            await updateDoc(otherUserChatsRef, {
                chats: arrayUnion({
                    ...userChatData,
                    receiverId: currentUser.id,
                }),
            });

            setUser(null);
            console.log("User added to the chat list");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {user && (
                <div className="user">
                    <div className="detail">
                        <img src={user.avatar || "./avatar.png"} alt="" />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAdd}>Add User</button>
                </div>
            )}
        </div>
    );
};

export default AddUser;
