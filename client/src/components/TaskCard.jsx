import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function TaskCard({ task, handleStatusChange, handleDeleteTask }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch comments for this specific task
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/comments/${task._id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments', error);
      }
    };
    if (user) fetchComments();
  }, [task._id, user]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/comments',
        { text: newComment, taskId: task._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComments([...comments, data]); // Instantly update UI with new comment
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  return (
    <div className="bg-white p-4 mb-4 rounded-md shadow border border-gray-200">
      
      {/* Title & Delete Button */}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
        <button 
          onClick={() => handleDeleteTask(task._id)}
          className="text-gray-400 hover:text-red-600 transition text-2xl leading-none font-bold"
          title="Delete Task"
        >
          &times;
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{task.description}</p>
      
      {/* Status Dropdown (Moves task between columns) */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-500 uppercase">Move to:</label>
        <select 
          value={task.status} 
          onChange={(e) => handleStatusChange(task._id, e.target.value)}
          className="w-full mt-1 p-2 text-sm bg-gray-50 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Inline Comments Section */}
      <div className="border-t border-gray-200 pt-3 mt-2 bg-gray-50 -mx-4 -mb-4 p-4 rounded-b-md">
        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Comments ({comments.length})
        </h5>
        
        {/* Render existing comments */}
        <div className="max-h-32 overflow-y-auto mb-3 space-y-2">
          {comments.map(c => (
            <div key={c._id} className="bg-white p-2 rounded border border-gray-100 text-xs text-gray-700 shadow-sm">
              <span className="font-bold text-blue-600">{c.user?.name}:</span> {c.text}
            </div>
          ))}
        </div>

        {/* Form to add a new comment */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input 
            type="text" placeholder="Type a reply..." value={newComment} onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded hover:bg-blue-600 transition">
            Reply
          </button>
        </form>
      </div>
    </div>
  );
}