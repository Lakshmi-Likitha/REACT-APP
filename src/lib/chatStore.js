// import { create } from 'zustand'
// import { db } from './firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { useUserStore } from './userStore';

// export const useChatStore = create((set) => ({
//     chatId: null,
//     user: null,
//     isCurrentUserBlocked: false,
//     isReceiverBlocked: false,
//     isLoading: true,
//     changeChat: (chatId, user) => {
//         const currentUser = useUserStore.getState().currentUser

//         // CHECK IF CURRENT USER IS BLOCKED

//         if (user.blocked.includes(currentUser.id)) {
//             return set({
//                 chatId,
//                 user: null,
//                 isCurrentUserBlocked: true,
//                 isReceiverBlocked: false,
//             })
//         }
//         // CHECK IF CURRENT USER IS BLOCKED
//         else if (currentUser.blocked.includes(user.id)) {
//             return set({
//                 chatId,
//                 user: user,
//                 isCurrentUserBlocked: false,
//                 isReceiverBlocked: true,
//             });
//         }
//         else {
//             return set({
//                 chatId,
//                 user,
//                 isCurrentUserBlocked: false,
//                 isReceiverBlocked: true,
//             });
//         }
//     },
//     changeBlock: () => {
//         set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
//     }

// }));


import { create } from 'zustand';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    isLoading: true,
    setChatId: (id) => set({ chatId: id }),
    setUser: (user) => set({ user: user }),
    changeChat: async (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

        try {
            const currentUserDoc = await getDoc(doc(db, 'users', currentUser.id));
            const userDoc = await getDoc(doc(db, 'users', user.id));

            if (currentUserDoc.exists() && userDoc.exists()) {
                const currentUserData = currentUserDoc.data();
                const userData = userDoc.data();

                if (userData.blocked.includes(currentUser.id)) {
                    return set({
                        chatId,
                        user: null,
                        isCurrentUserBlocked: true,
                        isReceiverBlocked: false,
                    });
                } else if (currentUserData.blocked.includes(user.id)) {
                    return set({
                        chatId,
                        user: user,
                        isCurrentUserBlocked: false,
                        isReceiverBlocked: true,
                    });
                } else {
                    return set({
                        chatId,
                        user: user,
                        isCurrentUserBlocked: false,
                        isReceiverBlocked: false,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    },
    changeBlock: () => {
        set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
    }
}));
