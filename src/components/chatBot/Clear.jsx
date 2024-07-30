
export default function Clear({ onClick }) {
  return (
    <button
      className="w-full cursor-pointer hover:bg-orange-400 p-5 h-15 bg-[#ff9d84] border-none rounded-2xl text-lg font-bold"
      onClick={onClick}
    >
      Clear
    </button>
  );


}
