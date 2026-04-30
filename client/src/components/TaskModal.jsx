import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function TaskModal({ task, onClose }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch comments when the modal opens
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
    fetchComments();
  }, [task._id, user]);

  // Handle submitting a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/comments',
        { text: newComment, taskId: task._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComments([...comments, data]); // Add to UI immediately
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  // Basic styles for a simple popup modal
  const modalStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };

  const contentStyles = {
    backgroundColor: 'white', padding: '30px', borderRadius: '8px',
    width: '500px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto',
    position: 'relative'
  };

  return (
    <div style={modalStyles} onClick={onClose}>
      {/* Click inside content shouldn't close the modal */}
      <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '20px' }}>&times;</button>
        
        <h2>{task.title}</h2>
        <p style={{ color: '#555' }}>Status: <strong>{task.status}</strong></p>
        <p>{task.description || 'No description provided.'}</p>
        
        <hr style={{ margin: '20px 0' }} />
        
        <h3>Comments</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
          {comments.length === 0 ? <p style={{ fontSize: '14px', color: '#888' }}>No comments yet. Start the conversation!</p> : null}
          {comments.map(c => (
            <div key={c._id} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{c.user?.name}</div>
              <div style={{ fontSize: '15px' }}>{c.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Write a comment..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 15px', cursor: 'pointer', background: '#0052cc', color: 'white', border: 'none', borderRadius: '4px' }}>Post</button>
        </form>
      </div>
    </div>
  );
}