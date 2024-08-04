import React, { useEffect, useState } from 'react';
import Button from '../../components/basics/Button';
import InputField from '../../components/basics/InputField';

export default function FlashcardForm({ selectedFlashcard, onSave, onCancel, cancelEdit, setCancelEdit }) {
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        if (selectedFlashcard) {
            setTerm(selectedFlashcard.term);
            setDefinition(selectedFlashcard.definition);
            setIsPublic(selectedFlashcard.isPublic || false);
        } else {
            setTerm('');
            setDefinition('');
            setIsPublic(false);
        }
    }, [selectedFlashcard]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ term, definition, isPublic });
        setTerm('');
        setDefinition('');
        setIsPublic(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 bg-background-sideLight dark:bg-background-sideDark p-6 rounded-lg">
                    <InputField
                        id="term"
                        type="text"
                        value={term}
                        label="Term"
                        required
                        placeholder="Enter flashcard term"
                        onChange={(e) => setTerm(e.target.value)}
                    />
                    <InputField
                        id="definition"
                        type="text"
                        value={definition}
                        label="Definition"
                        required
                        placeholder="Enter flashcard definition"
                        onChange={(e) => setDefinition(e.target.value)}
                    />
                    <InputField
                        id="isPublic"
                        type="checkbox"
                        label="Make this flashcard public"
                        checked={isPublic}
                        className="max-w-4"
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <div className="mt-4">
                        <Button type="submit" className="mr-2">
                            Save
                        </Button>
                        {cancelEdit && <Button onClick={onCancel}>
                            Cancel
                        </Button>}
                    </div>
                </div>
            </form>
        </>
    );
}
