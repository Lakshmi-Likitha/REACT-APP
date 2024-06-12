// Initial Code
// import "./userInfo.css"
// import {useUserStore} from "../../../lib/userStore";

// const Userinfo = () => {

//     const {currentUser} = useUserStore();
//     return(
//         <div className = 'userInfo'>
//             <div className="user">
//                 <img src={currentUser.avatar || "./avatar.png"} alt="" />
//                 <h2>{currentUser.username}</h2>
//             </div>
//             <div className="icons">
//                 <img src="./more.png" alt="" />
//                 <img src="./video.png" alt="" />
//                 <img src="./edit.png" alt="" />
//             </div>
//         </div>
//     )
// }

// export default Userinfo

// CODE 2
// import "./userInfo.css";
// import { useState } from "react";
// import { useUserStore } from "../../../lib/userStore";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../../../lib/firebase";
// import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

// const Userinfo = () => {
//     const { currentUser, setCurrentUser } = useUserStore();
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//     const [newDescription, setNewDescription] = useState(currentUser.description || "");

//     const handleEditClick = () => {
//         setIsDialogOpen(true);
//     };

//     const handleSaveClick = async () => {
//         const userDocRef = doc(db, "users", currentUser.id);

//         try {
//             await updateDoc(userDocRef, {
//                 description: newDescription,
//             });

//             setCurrentUser((prevUser) => ({
//                 ...prevUser,
//                 description: newDescription,
//             }));

//             setIsDialogOpen(false); // Close the dialog box after saving
//         } catch (err) {
//             console.error("Error updating description: ", err);
//         }
//     };

//     return (
//         <div className="userInfo">
//             <div className="user">
//                 <img src={currentUser.avatar || "./avatar.png"} alt="" />
//                 <h2>{currentUser.username}</h2>
//             </div>
//             <div className="icons">
//                 <img src="./more.png" alt="" />
//                 <img src="./edit.png" alt="" onClick={handleEditClick} />
//             </div>
//             <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
//                 <DialogTitle>Edit Description</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Enter a new description for your profile.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Description"
//                         type="text"
//                         fullWidth
//                         value={newDescription}
//                         onChange={(e) => setNewDescription(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setIsDialogOpen(false)} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSaveClick} color="primary">
//                         Save
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default Userinfo;




// Code after updating avatar feature
import "./userInfo.css";
import { useState } from "react";
import { useUserStore } from "../../../lib/userStore";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../lib/firebase";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, IconButton } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Userinfo = () => {
    const { currentUser, setCurrentUser } = useUserStore();
    const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
    const [newDescription, setNewDescription] = useState(currentUser.description || "");

    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
    const [newAvatar, setNewAvatar] = useState(null);
    const [avatarURL, setAvatarURL] = useState(currentUser.avatar || "");

    const handleEditDescriptionClick = () => {
        setIsDescriptionDialogOpen(true);
    };

    const handleSaveDescriptionClick = async () => {
        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                description: newDescription,
            });

            setCurrentUser((prevUser) => ({
                ...prevUser,
                description: newDescription,
            }));

            setIsDescriptionDialogOpen(false); // Close the dialog box after saving
        } catch (err) {
            console.error("Error updating description: ", err);
        }
    };

    const handleMoreClick = () => {
        setIsAvatarDialogOpen(true);
    };

    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            setNewAvatar(e.target.files[0]);
            setAvatarURL(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSaveAvatarClick = async () => {
        if (!newAvatar) return;

        const storageRef = ref(storage, `avatars/${currentUser.id}/${newAvatar.name}`);
        const uploadTask = uploadBytesResumable(storageRef, newAvatar);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress monitoring can be added here if needed
            },
            (error) => {
                console.error("Error uploading avatar: ", error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const userDocRef = doc(db, "users", currentUser.id);

                    await updateDoc(userDocRef, {
                        avatar: downloadURL,
                    });

                    setCurrentUser((prevUser) => ({
                        ...prevUser,
                        avatar: downloadURL,
                    }));

                    setIsAvatarDialogOpen(false); // Close the dialog box after saving
                    setNewAvatar(null); // Reset the avatar state
                } catch (err) {
                    console.error("Error saving avatar URL: ", err);
                }
            }
        );
    };

    return (
        <div className="userInfo">
            <div className="user">
                <img src={avatarURL || "./avatar.png"} alt="" />
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="" onClick={handleMoreClick} />
                <img src="./edit.png" alt="" onClick={handleEditDescriptionClick} />
            </div>
            <Dialog open={isDescriptionDialogOpen} onClose={() => setIsDescriptionDialogOpen(false)}>
                <DialogTitle>Edit Description</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a new description for your profile.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDescriptionDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveDescriptionClick} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isAvatarDialogOpen} onClose={() => setIsAvatarDialogOpen(false)}>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select a new profile picture.
                    </DialogContentText>
                    <input
                        accept="image/*"
                        type="file"
                        onChange={handleAvatarChange}
                        style={{ display: "none" }}
                        id="avatar-upload"
                    />
                    <label htmlFor="avatar-upload">
                        <IconButton color="primary" component="span">
                            Upload Picture
                        </IconButton>
                    </label>
                    {avatarURL && <img src={avatarURL} alt="Avatar Preview" style={{ width: "100%", marginTop: "10px" }} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAvatarDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveAvatarClick} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Userinfo;
