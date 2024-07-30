
export default function History({ question, onClick }) {
  return (
    <div
      className="p-5 mb-2.5 bg-slate-500 rounded-xl cursor-pointer hover:bg-slate-700"
      onClick={onClick}
    >
      <p>{question.substring(0, 30)}...</p>
    </div>
  );


}
