import { useEffect, useState } from "react";
import { getToken, removeToken } from "../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SharedFile {
  id: string;
  filename: string;
  owner: string;
}

interface MyFile {
  id: string;
  name: string;
}

function Dashboard() {
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [myFiles, setMyFiles] = useState<MyFile[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [toEmail, setToEmail] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      removeToken();
      navigate("/");
      return;
    }

    // Fetch shared files
    axios
      .get("http://localhost:3000/files/shared", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSharedFiles(res.data.sharedFiles))
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          removeToken();
          navigate("/");
        }
      });

    // Fetch user's own files
    axios
      .get("http://localhost:3000/files/myfiles", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMyFiles(res.data.files);
        if (res.data.files.length > 0) {
          setSelectedFileId(res.data.files[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user's files", err);
      });
  }, [navigate]);

  const handleUpload = () => {
    const token = getToken();
    if (!token) {
      alert("No token found, please login again.");
      removeToken();
      navigate("/");
      return;
    }
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:3000/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("File uploaded!");
        setFile(null);
        // Optionally refresh user's files list after upload
        axios
          .get("http://localhost:3000/files/myfiles", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setMyFiles(res.data.files);
            if (res.data.files.length > 0) {
              setSelectedFileId(res.data.files[0].id);
            }
          });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          removeToken();
          navigate("/");
        } else {
          alert("Failed to upload file.");
        }
      });
  };

  const handleGrantAccess = () => {
    const token = getToken();
    if (!token) {
      alert("No token found, please login again.");
      removeToken();
      navigate("/");
      return;
    }
    if (!toEmail.trim()) {
      alert("Please enter an email address.");
      return;
    }
    if (!selectedFileId) {
      alert("Please select a file to share.");
      return;
    }

    axios
      .post(
        "http://localhost:3000/files/grant",
        { fileId: selectedFileId, toEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Access granted!");
        setToEmail("");
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          removeToken();
          navigate("/");
        } else if (err.response?.data?.error) {
          alert(`Failed to grant access: ${err.response.data.error}`);
        } else {
          alert("Failed to grant access.");
        }
      });
  };

  const handleDownload = (fileId: string) => {
    const token = getToken();
    if (!token) {
      alert("Please login again.");
      removeToken();
      navigate("/");
      return;
    }
    axios
      .get(`http://localhost:3000/files/download/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const url = res.data.url;
        window.open(url, "_blank"); // Opens in new tab
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          alert("You do not have access to this file.");
        } else {
          alert("Failed to download file.");
        }
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>ConsentChain Dashboard</h2>

      <div>
        <h3>Upload File</h3>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Grant Access</h3>
        <select
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          {myFiles.map((file) => (
            <option key={file.id} value={file.id}>
              {file.name}
            </option>
          ))}
        </select>
        <input
          type="email"
          placeholder="Email to share with"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
        />
        <button onClick={handleGrantAccess}>Grant Access</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>My Files</h3>
        <ul>
          {myFiles.length > 0 ? (
            myFiles.map((file) => (
              <li key={file.id}>
                {file.name}
                <button
                  onClick={() => handleDownload(file.id)}
                  style={{ marginLeft: 10 }}
                >
                  Download
                </button>
                <button
                  onClick={() => navigate(`/logs/${file.id}`)}
                  style={{ marginLeft: 10 }}
                >
                  View Logs
                </button>
              </li>
            ))
          ) : (
            <li>No files uploaded yet.</li>
          )}
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Shared With You</h3>
        <ul>
          {sharedFiles.length > 0 ? (
            sharedFiles.map((file, index) => (
              <li key={index}>
                {file.filename} (shared by {file.owner}){" "}
                <button
                  onClick={() => {
                    const token = getToken();
                    window.open(
                      `http://localhost:3000/files/download/${file.id}?token=${token}`,
                      "_blank"
                    );
                  }}
                >
                  Download
                </button>
              </li>
            ))
          ) : (
            <li>No files shared with you yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
