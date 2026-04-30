import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects', error);
      }
    };
    if (user) fetchProjects();
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/projects',
        { name, description },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProjects([...projects, data]);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  // NEW: Delete Project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setProjects(projects.filter(p => p._id !== projectId)); // Remove from UI
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, <strong>{user?.name}</strong></span>
            <button 
              onClick={() => { logout(); navigate('/'); }} 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Create Project Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Create New Project</h3>
          <form onSubmit={handleCreateProject} className="flex gap-4">
            <input 
              type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} required 
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input 
              type="text" placeholder="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} 
              className="flex-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none w-1/2"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium transition">
              Create
            </button>
          </form>
        </div>

        {/* Projects Grid */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && <p className="text-gray-500">No projects yet. Create one above!</p>}
          
          {projects.map((project) => (
            <div key={project._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition relative">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h4>
              <p className="text-gray-600 text-sm mb-6 h-10 overflow-hidden">{project.description}</p>
              
              <div className="flex justify-between items-center mt-auto">
                <Link to={`/board/${project._id}`} className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1">
                  Open Board <span>&rarr;</span>
                </Link>
                
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteProject(project._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}