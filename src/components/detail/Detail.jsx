import { useEffect, useState } from "react";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const Detail = () => {
    const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();
    const [sharedPhotos, setSharedPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [showDescription, setShowDescription] = useState(false);
    const [showSharedPhotos, setShowSharedPhotos] = useState(false);

    useEffect(() => {
        const fetchSharedPhotos = async () => {
            if (!user) return;
            const userDocRef = doc(db, "users", user.id);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setSharedPhotos(userData.sharedPhotos || []);
                setDescription(userData.description || "No description available.");
            }
        };

        fetchSharedPhotos();
    }, [user]);

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            if (isReceiverBlocked) {
                await updateDoc(userDocRef, {
                    blocked: arrayRemove(user.id)
                });
            } else {
                await updateDoc(userDocRef, {
                    blocked: arrayUnion(user.id)
                });
            }
            changeBlock();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>{description}</p>
            </div>
            <div className="info">
                <div className="option" onClick={() => setShowDescription(!showDescription)}>
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src={showDescription ? "./arrowDown.png" : "./arrowUp.png"} alt="" className={showDescription ? "rotate" : ""} />
                    </div>
                    {showDescription && (
                        <div className="description">
                            {/* Display description related to privacy and help */}
                            {/* Example: */}
                            <p>Privacy Section :
                                Your profile information, including avatar and description, is protected and used to enhance your user experience. You can update these details anytime, ensuring your privacy preferences are always respected.
                            <br></br>
                            <br></br>
                                Help Section :
                                Easily update your avatar and description by clicking the 'More' icon in your profile. For further assistance, contact support at naidulikki@gmail.com.</p>
                        </div>
                    )}
                </div>
                <div className="option" onClick={() => setShowSharedPhotos(!showSharedPhotos)}>
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src={showSharedPhotos ? "./arrowDown.png" : "./arrowUp.png"} alt="" className={showSharedPhotos ? "rotate" : ""} />
                    </div>
                    {showSharedPhotos && (
                        <div className="photos">
                            {/* Display shared photos
                        {sharedPhotos.map((photo, index) => (
                            <div className="photoItem" key={index}>
                                <div className="photoDetail">
                                    <img src={photo.img} alt="" />
                                    <span>{`photo_${photo.createdAt.toDate().toLocaleDateString()}.png`}</span>
                                </div>
                                <img src="./download.png" alt="" className="icon" />
                            </div>
                        ))} */}
                            <p>This section is still under developement. Once the photos transferring is handled perfectly then will update this section also...</p>
                        </div>
                    )}
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked
                        ? "You are Blocked!"
                        : isReceiverBlocked
                            ? "Unblock User"
                            : "Block User"}
                </button>
                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
            </div>
        </div>
    );
};

export default Detail;
