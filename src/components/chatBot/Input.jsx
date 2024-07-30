
export default function Input({ value, onChange, onEnter }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onEnter();
    }
  };

  return (
    <div className="flex h-15 bg-slate-800 rounded-xl overflow-hidden">
      <input
        className="flex-1 border-none outline-none p-5 text-white text-lg bg-transparent"
        placeholder="Your prompt here..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="flex-none w-20 text-lg font-bold bg-violet-700 hover:bg-violet-950 cursor-pointer"
        onClick={onEnter}
      >
        Go
      </button>
    </div>
  );


}

