import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const access = localStorage.getItem("access");

  useEffect(() => {
    if (!access) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    fetch("http://127.0.0.1:8000/api/tasks/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  }, [access, navigate]);

  const handleAddOrUpdateTask = (e) => {
    e.preventDefault();
    const url = editingTaskId
      ? `http://127.0.0.1:8000/api/tasks/${editingTaskId}/`
      : "http://127.0.0.1:8000/api/tasks/";
    const method = editingTaskId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editingTaskId) {
          setTasks(tasks.map((task) => (task.id === data.id ? data : task)));
          setEditingTaskId(null);
        } else {
          setTasks([...tasks, data]);
        }
        setTitle("");
      });
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setEditingTaskId(task.id);
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out!");
    navigate("/");
  };

  return (
    <div className="container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h2>📝 My ToDo Dashboard</h2>

      <form onSubmit={handleAddOrUpdateTask}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="add-btn" type="submit">
          {editingTaskId ? "Update" : "Add"}
        </button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.title}</span>
            <div>
              <button className="edit-btn" onClick={() => handleEdit(task)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
