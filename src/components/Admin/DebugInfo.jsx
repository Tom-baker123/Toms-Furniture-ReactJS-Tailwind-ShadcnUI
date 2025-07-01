// DebugInfo.jsx
const DebugInfo = ({ debugData }) => {
    return (
        <div className="rounded-md border bg-gray-50 p-4 lg:col-span-3">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Debug Information:</h3>
            <div className="space-y-1 text-xs text-gray-600">
                {Object.entries(debugData).map(([key, value]) => (
                    <p key={key}>
                        {key}: {value || "(not entered)"}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default DebugInfo;
