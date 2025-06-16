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
    <div className="w-screen h-screen flex flex-col items-center justify-start pt-20 bg-transparent">
      {/* Centered Glassy Container */}
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-10 py-12">
        <h1 className="text-3xl font-clash font-medium mb-8 tracking-wide text-center">
          Download Logs
        </h1>
        {logs.length === 0 ? (
          <p className="text-gray-400 text-center">No download activity yet.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log, index) => (
              <li
                key={index}
                className="p-5 rounded-2xl border border-gray-700 bg-gradient-to-br from-[#101010] to-[#1a1a1a] shadow-md"
              >
                <div className="font-mono text-sm">
                  <span className="text-gray-400 mr-1">User:</span>
                  {log.downloadedBy}
                </div>
                <div className="font-mono text-sm mt-1">
                  <span className="text-gray-400 mr-1">Time:</span>
                  {new Date(log.downloadedAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileLogs;
