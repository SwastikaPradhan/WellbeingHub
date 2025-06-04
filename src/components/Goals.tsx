export default function Goals() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Goals</h2>
      <div className="space-y-3">
        <div className="p-4 border rounded-md flex items-center space-x-4 bg-gray-50">
          <span>✅</span>
          <div>
            <p className="font-semibold">Fitness Goal</p>
            <p className="text-sm text-gray-600">Complete 5 workouts this week</p>
          </div>
        </div>

        <div className="p-4 border rounded-md flex items-center space-x-4 bg-gray-50">
          <span>🍎</span>
          <div>
            <p className="font-semibold">Nutrition Goal</p>
            <p className="text-sm text-gray-600">Maintain a balanced diet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
