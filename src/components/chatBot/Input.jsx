import styles from "../../assets/css/Input.module.css";

export default function Input({ value, onChange, onEnter }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onEnter(); // Wywołaj funkcję przekazaną jako prop onEnter po naciśnięciu "Enter"
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.text}
        placeholder="Your prompt here..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown} // Dodane: Obsługa zdarzenia onKeyDown
      />
      <button className={styles.btn} onClick={onEnter}>
        Go
      </button>
    </div>
  );
}

