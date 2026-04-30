import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

export default function ProjectBoard() {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do'); // NEW: Let user choose initial column

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/tasks/${projectId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };
    if (user) fetchTasks();
  }, [projectId, user]);

  // Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/tasks',
        { title, description, projectId, status }, // Send chosen status to backend
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTasks([...tasks, data]);
      setTitle('');
      setDescription('');
      setStatus('To Do'); // Reset to default
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  // Change Task Status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTasks(tasks.map(t => t._id === taskId ? data : t));
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  // Render Columns
  const renderColumn = (statusName) => {
    const columnTasks = tasks.filter(task => task.status === statusName);
    
    return (
      <div className="flex-1 bg-gray-200 p-4 rounded-lg min-h-[600px] shadow-inner border border-gray-300">
        <h3 className="font-bold text-gray-700 text-xl mb-4 pb-2 border-b-2 border-gray-300">
          {statusName} <span className="bg-gray-300 text-gray-700 rounded-full px-2 py-1 text-sm ml-2">{columnTasks.length}</span>
        </h3>
        
        {columnTasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            handleStatusChange={handleStatusChange} 
            handleDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6">
          <Link to="/dashboard" className="text-blue-600 hover:underline flex items-center gap-1 mb-2 font-medium">
            &larr; Back to Dashboard
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-800">Project Board</h2>
        </div>
        
        {/* Create Task Form */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
          <h4 className="text-lg font-bold text-gray-700 mb-3">Create a New Task</h4>
          <form onSubmit={handleCreateTask} className="flex flex-wrap gap-4 items-center">
            <input type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[200px]" />
            <input type="text" placeholder="Description (Optional)" value={description} onChange={e => setDescription(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[200px]" />
            
            {/* NEW: Dropdown to choose starting column */}
            <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50 font-medium text-gray-700">
              <option value="To Do">Start in: To Do</option>
              <option value="In Progress">Start in: In Progress</option>
              <option value="Done">Start in: Done</option>
            </select>

            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold transition shadow">Add Task</button>
          </form>
        </div>

        {/* The 3 Columns */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {renderColumn('To Do')}
          {renderColumn('In Progress')}
          {renderColumn('Done')}
        </div>
        
      </div>
    </div>
  );
}