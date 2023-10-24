import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import API from '../../api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Header from '../../components/Header/Header';

import "./../Post/post.css"

function PostForm() {
    const [post, setPost] = useState({
        title: '',
        tags: '',
        published_at: new Date(),
        featured_until: new Date(),
        youtube_link: '',
        primary_text: '',
        secondary_text: '',
        seo_title: '',
        seo_tags: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [titleError, setTitleError] = useState(''); // Adicionando o estado para rastrear erros de título
    const [isLoading, setLoadingModal] = useState(false);

    const handleAddPost = () => {
        setLoadingModal(true);
        if (!post.title) {
            setTitleError('O campo título é obrigatório.');
            return; // Impedir a submissão se o campo "Título" estiver em branco
        }
        const newPost = {
            title: post.title,
            tags: post.tags,
            published_at: post.published_at.toISOString(),
            featured_until: post.featured_until.toISOString(),
            youtube_link: post.youtube_link,
            primary_text: post.primary_text,
            secondary_text: post.secondary_text,
            seo_title: post.seo_title,
            seo_tags: post.seo_tags,
        };

        fetch(`${API.url}/posts`, {
            method: 'POST',
            headers: {
                'Api-Authorization': `${API.apiAuthorization}`,
                'Authorization': `${API.authorization}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na solicitação.');
                }
                return response.json();
            })
            .then((data) => {
                setShowModal(true); // Exibindo o modal de sucesso
                setPost({
                    title: '',
                    tags: '',
                    published_at: new Date(),
                    featured_until: new Date(),
                    youtube_link: '',
                    primary_text: '',
                    secondary_text: '',
                    seo_title: '',
                    seo_tags: '',
                });

                
            })
            .catch((error) => {
                console.error('Erro:', error);
            })
            .finally(()=>{
                setLoadingModal(false);
            })
    };

    return (
        <div>
            <Header />
            <div className='formContainer'>
                <Stack gap={1} className="col-md-3 mx-auto">
                    <h2 className='text-white'>Cadastro de Postagens</h2>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className='text-white'>Título</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Título"
                                value={post.title}
                                onChange={(e) => {
                                    setPost({ ...post, title: e.target.value });
                                    setTitleError(''); // Limpando o erro ao digitar
                                }}
                            />
                            {titleError && <p className="text-danger">{titleError}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-white'>Tags</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tags"
                                value={post.tags}
                                onChange={(e) => setPost({ ...post, tags: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 formGroupAddPost">
                            <Form.Label className='text-white'>Data de Publicação:</Form.Label>
                            <DatePicker
                                selected={post.published_at}
                                onChange={(date) => setPost({ ...post, published_at: date })}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 formGroupAddPost">
                            <Form.Label className='text-white'>Data de Destaque:</Form.Label>
                            <DatePicker
                                selected={post.featured_until}
                                onChange={(date) => setPost({ ...post, featured_until: date })}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 ">
                            <Form.Label className='text-white'>Link do YouTube</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Link do YouTube"
                                value={post.youtube_link}
                                onChange={(e) => setPost({ ...post, youtube_link: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-white'>Texto Primário</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Texto Primário"
                                value={post.primary_text}
                                onChange={(e) => setPost({ ...post, primary_text: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-white'>Texto Secundário</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Texto Secundário"
                                value={post.secondary_text}
                                onChange={(e) => setPost({ ...post, secondary_text: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-white'>Título SEO</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Título SEO"
                                value={post.seo_title}
                                onChange={(e) => setPost({ ...post, seo_title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-white'>Tags SEO</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tags SEO"
                                value={post.seo_tags}
                                onChange={(e) => setPost({ ...post, seo_tags: e.target.value })}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleAddPost}>
                            {isLoading ? 'Cadastrando…' : 'Cadastrar'}
                        </Button>
                    </Form>
                </Stack>
            </div>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Post Cadastrado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    O post foi cadastrado com sucesso!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PostForm;
