import { firebaseAuth, firebaseFirestore } from "../../utils/firebase";
import { USER_FIREBASE_COLLECTION } from "../../shared/constants/user-firebase-collection.constant";

class UserService {
    async findOne(id: string) {
        const userSnapshot = await firebaseFirestore.collection(USER_FIREBASE_COLLECTION)
            .doc(id)
            .get();

        if (!userSnapshot.exists) {
            return null;
        }

        return {
            id: userSnapshot.id,
            ...userSnapshot.data()
        };
    }

    async findOneByEmail(email: string) {
        const userSnapshot = await firebaseFirestore.collection(USER_FIREBASE_COLLECTION)
            .where('email', '==', email)
            .get();

        if (userSnapshot.empty) {
            return null;
        }

        const userDoc = userSnapshot.docs[0];
        return {
            id: userDoc.id,
            ...userDoc.data()
        };
    }
}

export default new UserService();
