import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import PageTitle from '../../components/basics/PageTitle';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import Flashcard from './Flashcard';
import FlashcardForm from './FlashcardForm';

export default function FlashcardList() {
    const { currentUser } = useContext(AuthContext);
    const [flashcards, setFlashcards] = useState([]);
    const [publicFlashcards, setPublicFlashcards] = useState([]);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const [cancelEdit, setCancelEdit] = useState(false);
    const [showPublic, setShowPublic] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const userFlashcardsRef = doc(db, "userFlashcards", currentUser.uid);
            const publicFlashcardsRef = collection(db, "publicFlashcards");

            // Fetch user's flashcards
            const fetchUserFlashcards = async () => {
                const docSnap = await getDoc(userFlashcardsRef);
                if (docSnap.exists()) {
                    setFlashcards(docSnap.data().flashcards || []);
                }
            };

            // Fetch public flashcards
            const fetchPublicFlashcards = async () => {
                const q = query(publicFlashcardsRef, where("isPublic", "==", true));
                const querySnapshot = await getDocs(q);
                const publicCards = [];
                querySnapshot.forEach((doc) => {
                    publicCards.push(doc.data());
                });
                setPublicFlashcards(publicCards);
            };

            // Real-time updates
            const unsubscribeUserFlashcards = onSnapshot(userFlashcardsRef, (doc) => {
                setFlashcards(doc.data()?.flashcards || []);
            });

            const unsubscribePublicFlashcards = onSnapshot(query(publicFlashcardsRef, where("isPublic", "==", true)), (snapshot) => {
                const publicCards = [];
                snapshot.forEach((doc) => {
                    publicCards.push(doc.data());
                });
                setPublicFlashcards(publicCards);
            });

            fetchUserFlashcards();
            fetchPublicFlashcards();

            return () => {
                unsubscribeUserFlashcards();
                unsubscribePublicFlashcards();
            };
        }
    }, [currentUser]);

    const handleAddOrEditFlashcard = async (flashcard) => {
        if (!currentUser) return;

        const flashcardWithCreator = {
            ...flashcard,
            creator: currentUser.displayName,
            creatorUID: currentUser.uid
        };

        const flashcardId = selectedFlashcard ? selectedFlashcard.id : Date.now().toString();

        const updatedFlashcards = selectedFlashcard
            ? flashcards.map(f => f.id === selectedFlashcard.id ? { ...flashcardWithCreator, id: selectedFlashcard.id } : f)
            : [...flashcards, { id: flashcardId, ...flashcardWithCreator }];

        setFlashcards(updatedFlashcards);

        // Save to user's flashcards
        const userFlashcardsRef = doc(db, "userFlashcards", currentUser.uid);
        await setDoc(userFlashcardsRef, { flashcards: updatedFlashcards }, { merge: true });

        // Save to publicFlashcards if isPublic is true
        if (flashcard.isPublic) {
            const publicFlashcardsRef = doc(db, "publicFlashcards", flashcardId);
            await setDoc(publicFlashcardsRef, flashcardWithCreator); // Save flashcard to publicFlashcards
        } else {
            // Remove from publicFlashcards if the flashcard is no longer public
            const publicFlashcardsRef = doc(db, "publicFlashcards", flashcardId);
            await deleteDoc(publicFlashcardsRef); // Delete flashcard from publicFlashcards
        }

        setSelectedFlashcard(null);
        setCancelEdit(false);
    };

    const handleDeleteFlashcard = async (id) => {
        if (!id) return;  // Ensure ID is not empty

        const updatedFlashcards = flashcards.filter(f => f.id !== id);
        setFlashcards(updatedFlashcards);

        if (currentUser) {
            const userFlashcardsRef = doc(db, "userFlashcards", currentUser.uid);
            await setDoc(userFlashcardsRef, { flashcards: updatedFlashcards }, { merge: true });

            // Remove from publicFlashcards if the user is the creator
            const publicFlashcardsRef = doc(db, "publicFlashcards", id);
            const publicFlashcardSnap = await getDoc(publicFlashcardsRef);
            if (publicFlashcardSnap.exists() && publicFlashcardSnap.data().creatorUID === currentUser.uid) {
                await deleteDoc(publicFlashcardsRef);
            }
        }
    };

    return (
        <>
            <PageTitle title="Flashcards" />
            <div className="mb-6">
                <h2 className="text-xl font-bold dark:text-white">My Flashcards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flashcards.map(flashcard => (
                        <Flashcard
                            key={flashcard.id}
                            term={flashcard.term}
                            definition={flashcard.definition}
                            creator={flashcard.creator}
                            onEdit={() => {
                                if (!selectedFlashcard || selectedFlashcard.id === flashcard.id) {
                                    setSelectedFlashcard(flashcard);
                                    setCancelEdit(true);
                                }
                            }}
                            onDelete={() => handleDeleteFlashcard(flashcard.id)}
                        />
                    ))}
                </div>
            </div>
            <h2 className="flex items-center gap-2">
                <p className='text-xl font-bold dark:text-white'>Public Flashcards</p>
                <img src={showPublic ? "./minus.png" : "./plus.png"} className='cursor-pointer w-6' onClick={(e) => setShowPublic(prev => !prev)} />
            </h2>
            {showPublic && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  mb-6">
                    {publicFlashcards.map(flashcard => (
                        <Flashcard
                            key={flashcard.id}
                            term={flashcard.term}
                            definition={flashcard.definition}
                            creator={flashcard.creator}
                        // No edit or delete for public flashcards
                        />
                    ))}
                </div>
            )}
            <FlashcardForm
                selectedFlashcard={selectedFlashcard}
                onSave={handleAddOrEditFlashcard}
                onCancel={() => {
                    setSelectedFlashcard(null);
                    setCancelEdit(prev => !prev);
                }}
                cancelEdit={cancelEdit}
                setCancelEdit={setCancelEdit}
            />
        </>
    );
}
