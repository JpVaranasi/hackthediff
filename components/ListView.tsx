export default function ListView() {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Clubs</h2>
      <ul className="space-y-2">
        <li className="p-2 border rounded text-white">Club 1</li>
        <li className="p-2 border rounded">Club 2</li>
        <li className="p-2 border rounded">Club 3</li>
      </ul>
    </div>
  );
}