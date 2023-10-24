import React from 'react';

function DeletePost({ post, onDelete, onCancel }) {
  return (
    <div>
      <h2>Confirmação de Exclusão</h2>
      <p>Tem certeza de que deseja excluir a postagem "{post.title}"?</p>
      <button onClick={() => onDelete(post)}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
}

export default DeletePost;
