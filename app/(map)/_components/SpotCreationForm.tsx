interface SpotCreationFormProps {
  position: [number, number];
  onCancel: () => void;
  onSubmit: (spotData: SpotData) => void;
}

function SpotCreationForm({ position, onCancel, onSubmit }: SpotCreationFormProps) {
  // ... existing code

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Create New Spot</h2>
      <form onSubmit={handleSubmit}>
        {/* ... form fields */}
        <div className="flex justify-between mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Spot</Button>
        </div>
      </form>
    </div>
  );
}