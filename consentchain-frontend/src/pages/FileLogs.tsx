import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import { useParams } from "react-router-dom";

type LogEntry = {
  downloadedBy: string;
  downloadedAt: string;
};

const FileLogs = () => {
  const { fileId } = useParams();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `http://localhost:3000/files/logs/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLogs(response.data.logs);
      } catch (err) {
        setError("Failed to fetch logs or access denied");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [fileId]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Download Logs</h1>
      {logs.length === 0 ? (
        <p>No download activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log, index) => (
            <li key={index} className="bg-white p-3 rounded shadow">
              <div>
                <strong>User:</strong> {log.downloadedBy}
              </div>
              <div>
                <strong>Time:</strong>{" "}
                {new Date(log.downloadedAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileLogs;
