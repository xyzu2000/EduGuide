
export default function Clear({ onClick }) {
  return (
    <button
      className="w-full cursor-pointer hover:bg-indigo-700 p-5 h-15 bg-indigo-400 border-none rounded-2xl text-lg font-bold"
      onClick={onClick}
    >
      Clear
    </button>
  );


}
