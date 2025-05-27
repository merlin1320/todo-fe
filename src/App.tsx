import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";

const baseURL = "https://gtnjqqxk-3050.usw2.devtunnels.ms";

type Todo = {
  id: number;
  description: string;
  completed: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo>({} as Todo);
  const [newTodo, setNewTodo] = useState<Todo>({} as Todo);

  useEffect(() => {
    axios
      .get(`${baseURL}/todos`)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTodo({} as Todo);
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleChange = (event) => {
    setNewTodo({...newTodo, description: event.target.value})
  }

  const handleAddTodo = async () => {
    console.log(newTodo.description);
    
    setAddModalOpen(true)
    try {
      await axios.post(`${baseURL}/todos`, {
        data: { description: newTodo.description },
      });
      setAddModalOpen(false);
      const res = await axios.get(baseURL + "/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error Adding: ", error);
    }
  };

  const handleDelete = async (todo: Todo) => {
    try {
      await axios.delete(`${baseURL}/todos`, { data: { id: todo.id } });
      const res = await axios.get(baseURL + "/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error deleting: ", error);
    }
  };

  const modalSave = async () => {
    if (!selectedTodo) return;
    try {
      console.log("Get above the patch");
      await axios.patch(`${baseURL}/todos`, { id: selectedTodo.id });
      setModalOpen(false);
      setSelectedTodo({} as Todo);
      const res = await axios.get(baseURL + "/todos");
      setTodos(res.data);
    } catch (error) {
      console.error("Error saving: ", error);
    }
  };

  return (
    <>
      <div style={{flex:1, justifyContent:'center', alignContent:'center'}}>
        <button onClick={() => setAddModalOpen(true)}>Add Todo</button>
        <table>
          <thead>
            <tr>
              <th>Edit Todo</th>
              <th>Todo Descirption</th>
              <th>Completed</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>
                  <button onClick={() => handleEdit(todo)}>Edit todo</button>
                </td>
                <td>{todo.description}</td>
                <td>{todo.completed}</td>
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
                  Name:
                  <input
                    name="name"
                    value={selectedTodo.description}
                    disabled
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "1px solid #444",
                      marginLeft: 8,
                    }}
                  />
                </label>
                <label style={{ color: "#fff" }}>
                  Completed:
                  <input
                    type="checkbox"
                    checked={selectedTodo.completed}
                    onChange={(e) =>
                      setSelectedTodo({
                        ...selectedTodo,
                        completed: e.target.checked,
                      })
                    }
                    style={{ marginLeft: 8 }}
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
                  Description:
                  <input
                    name="description"
                    type="text"
                    value={newTodo.description}
                    onChange={(e) => handleChange(e)}
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "1px solid #444",
                      marginLeft: 8,
                    }}
                  />
                </label>
                <label style={{ color: "#fff" }}>
                  Completed:
                  <input
                    type="checkbox"
                    checked={newTodo.completed}
                    onChange={(e) =>
                      setNewTodo({
                        ...newTodo,
                        completed: e.target.checked,
                      })
                    }
                    style={{ marginLeft: 8 }}
                  />
                </label>
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
