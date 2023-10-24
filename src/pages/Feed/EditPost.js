import React, { useState } from 'react';

function EditPost({ post, onSave, onCancel }) {
  const [editedPost, setEditedPost] = useState(post);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost({
      ...editedPost,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(editedPost);
  };

  return (
    <div>
      <h2>Editar Postagem</h2>
      <form>
        <label>Título:</label>
        <input
          type="text"
          name="title"
          value={editedPost.title}
          onChange={handleInputChange}
        />
     
        <button onClick={handleSave}>Salvar</button>
        <button onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
}

export default EditPost;
