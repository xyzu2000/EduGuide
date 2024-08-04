
export default function Input({ value, onChange, onEnter }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onEnter();
    }
  };

  return (
    <div className="flex h-15 bg-background-sideLight dark:bg-background-dark rounded-xl overflow-hidden">
      <input
        className="flex-1 border-none outline-none p-5 text-black dark:text-white text-lg bg-transparent"
        placeholder="Your prompt here..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="flex-none w-20 text-lg font-bold bg-indigo-400 hover:bg-indigo-700 cursor-pointer"
        onClick={onEnter}
      >
        Go
      </button>
    </div>
  );


}

