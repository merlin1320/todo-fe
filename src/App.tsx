import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";

const baseURL = "https://gtnjqqxk-3050.usw2.devtunnels.ms";

type Todo = {
  id: number;
  title: string;
  author: string;
  description: string;
  completed: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo>({} as Todo);
  const [newTodo, setNewTodo] = useState({
    title: "",
    author: "",
    description: "",
  });

  useEffect(() => {fetchTodos()}, []);

  const fetchTodos = async () => {
    axios
      .get(`${baseURL}/todos`)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditClcik = (todo: Todo) => {
    setSelectedTodo(todo);
    setNewTodo({
      title: todo.title,
      description: todo.description,
      author: todo.author,
    })
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTodo({} as Todo);
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTodo = async () => {
    const newTodos = { ...newTodo };

    setAddModalOpen(true);
    try {
      await axios.post(`${baseURL}/todos`, newTodos).then((response) => {
        console.log("todo added:", response.data);
        setNewTodo({
          title: "",
          author: "",
          description: "",
        });
      });
      setAddModalOpen(false);
      const res = await axios.get(baseURL + "/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error Adding: ", error);
    }
  };

  const modalSave = async () => {
    if (!selectedTodo) return;
    try {
      await axios.patch(`${baseURL}/todos/${selectedTodo.id}`, newTodo);
      setModalOpen(false);
      setSelectedTodo({} as Todo);
      const res = await axios.get(baseURL + "/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error saving: ", error);
    }
  };

  const handleDelete = async (todo: Todo) => {
    console.log("Todo ID: ", todo.id);
    try {
      await axios.delete(`${baseURL}/todos/${todo.id}`).then((response) => {
        console.log("Todo deleted", response.data);
      });
      const res = await axios.get(baseURL + "/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error deleting: ", error);
    }
  };

  const toggleComplete = async (todo: Todo) => {
    await axios.patch(`${baseURL}/todos/${todo.id}`).then(() => {
      console.log(
        todo.completed ? "Todo marked Completed " : "Todo marked Incomplete"
      );
    });
    const res = await axios.get(baseURL + "/todos");
    setTodos(res.data);
  };

  return (
    <>
      <div style={{ flex: 1, justifyItems: "center", alignContent: "center" }}>
        <button onClick={() => setAddModalOpen(true)}>Add Todo</button>
        <table>
          <thead>
            <tr>
              <th>Edit Todo</th>
              <th>Todo Title</th>
              <th>Todo Descirption</th>
              <th>Todo Author</th>
              <th>Completed</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>
                  <button onClick={() => handleEditClcik(todo)}>Edit todo</button>
                </td>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.author}</td>
                <td>
                  {todo.completed ? (
                    <button onClick={() => toggleComplete(todo)}>
                      Mark as Incomplete
                    </button>
                  ) : (
                    <button onClick={() => toggleComplete(todo)}>
                      Mark as Complete
                    </button>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(todo)}>
                    Delete Todo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {modalOpen && selectedTodo && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#181818",
                color: "#fff",
                padding: 32,
                borderRadius: 12,
                minWidth: 350,
                maxWidth: 90,
                width: "100%",
                boxShadow: "0 4px 32px rgba(0,0,0,0.8)",
                border: "1px solid #333",
                boxSizing: "border-box",
              }}
            >
              <h2 style={{ color: "#fff", marginBottom: 20 }}>Edit Todo</h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <label style={{ color: "#fff" }}>
                  Title:
                  <input
                    name="title"
                    type="text"
                    value={newTodo.title}
                    onChange={handleInputChange}
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "1px solid #444",
                      marginLeft: 8,
                    }}
                  />
                </label>
                <label style={{ color: "#fff" }}>
                  Description:
                  <input
                    name="description"
                    type="text"
                    value={newTodo.description}
                    onChange={handleInputChange}
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "1px solid #444",
                      marginLeft: 8,
                    }}
                  />
                </label>
                <label style={{ color: "#fff" }}>
                  Author:
                  <input
                    name="author"
                    type="text"
                    value={newTodo.author}
                    onChange={handleInputChange}
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "1px solid #444",
                      marginLeft: 8,
                    }}
                  />
                </label>
                <div>
                  <button
                    onClick={handleModalClose}
                    style={{
                      background: "#333",
                      color: "#fff",
                      border: "1px solid #444",
                      marginRight: 8,
                      padding: "6px 16px",
                      borderRadius: 4,
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={modalSave}
                    style={{
                      background: "#0078d4",
                      color: "#fff",
                      border: "none",
                      padding: "6px 16px",
                      borderRadius: 4,
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {addModalOpen && newTodo && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#181818",
                color: "#fff",
                padding: 32,
                borderRadius: 12,
                minWidth: 350,
                maxWidth: 90,
                width: "100%",
                boxShadow: "0 4px 32px rgba(0,0,0,0.8)",
                border: "1px solid #333",
                boxSizing: "border-box",
              }}
            >
              <h2 style={{ color: "#fff", marginBottom: 20 }}>Add Todo</h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <label style={{ color: "#fff" }}>
                  Title:
                  <input
                    name="title"
                    type="text"
                    value={newTodo.title}
                    onChange={handleInputChange}
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "1px solid #444",
                      marginLeft: 8,
                    }}
                  />
                </label>
                <label style={{ color: "#fff" }}>
                  Description:
                  <input
                    name="description"
                    type="text"
                    value={newTodo.description}
                    onChange={handleInputChange}
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "1px solid #444",
                      marginLeft: 8,
                    }}
                  />
                </label>
                <label style={{ color: "#fff" }}>
                  Author:
                  <input
                    name="author"
                    type="text"
                    value={newTodo.author}
                    onChange={handleInputChange}
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "1px solid #444",
                      marginLeft: 8,
                    }}
                  />
                </label>
                {/* <label style={{ color: "#fff" }}>
                  Completed:
                  <input
                    type="checkbox"
                    checked={newTodo.completed}
                    onChange={handleInputChange}
                    style={{ marginLeft: 8 }}
                  />
                </label> */}
                <div>
                  <button
                    onClick={handleAddModalClose}
                    style={{
                      background: "#333",
                      color: "#fff",
                      border: "1px solid #444",
                      marginRight: 8,
                      padding: "6px 16px",
                      borderRadius: 4,
                    }}
                  >
                    Close
                  </button>
                  <button
                    onClick={handleAddTodo}
                    style={{
                      background: "#0078d4",
                      color: "#fff",
                      border: "none",
                      padding: "6px 16px",
                      borderRadius: 4,
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
