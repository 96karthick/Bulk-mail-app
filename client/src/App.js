import "./App.css";
import { useState } from "react";

function App() {

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const sendEmail = async () => {

    if (!file) {
      alert("Please choose file");
      return;
    }

    const formData = new FormData();

    formData.append("text", text);
    formData.append("file", file);

    try {

      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      alert(data.message);

    } catch (error) {
      console.log(error);
      alert("Error sending emails");
    }
  };

  return (
    <div className="container">

      <div className="header">
        <h1>BulkMail</h1>

        <p>
          We can help your business with sending multiple email at once
        </p>
      </div>

      <div className="drag">
        Drag and Drop
      </div>

      <textarea
        placeholder="Enter your text...."
        onChange={(e) => setText(e.target.value)}
      />

      <div className="fileBox">

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

      </div>

      <p>
        Total Emails in the file: 0
      </p>

      <button onClick={sendEmail}>
        send
      </button>

    </div>
  );
}

export default App;