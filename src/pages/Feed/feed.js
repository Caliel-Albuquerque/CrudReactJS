import React, { useState, useEffect } from 'react'
import API from '../../api';
import Table from 'react-bootstrap/Table';
import Stack from 'react-bootstrap/Stack';
import Pagination from 'react-bootstrap/Pagination';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaEye } from 'react-icons/fa';


import './feed.css'


import HeaderMain from '../../components/HeaderMain/HeaderMain'
import DateTimeTable from '../../components/DateTimeTable/DateTimeTable';



function Feed() {


    //State para vizualizar o post
    const [indiviudalPost, setindiviudalPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [numPosts, setNumPosts] = useState(0)
    //State para armazenar as paginas
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    //State para armazenar o titulo que será filtrado
    const [titleFilter, setTitleFilter] = useState('');
    //State para armazenar o objeto retornado de um id especifico
    const [editingPost, setEditingPost] = useState(null);
    const [deletingPost, setDeletingPost] = useState(null);
    const [isLoading, setLoadingModal] = useState(false);

    //State para mostrar o modal ou não
    const [showPostModal, setShowPostModal] = useState(false);






    //Chamando a API
    useEffect(() => {

        const apiUrl = `${API.url}/posts?paginated=true&page=${currentPage}&title=${titleFilter}`;
        const apiAuthorization = `${API.apiAuthorization}`;
        const authorization = `${API.authorization}`;
        const headers = {
            'Api-Authorization': apiAuthorization,
            'Authorization': authorization,
        };

        fetch(apiUrl, {
            method: 'GET',
            headers: headers,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na solicitação');
                }
                return response.json();
            })
            .then((data) => {
                // Verificando se o campo "data" existe no objeto
                if (data && data.data && Array.isArray(data.data.data)) {
                    // Acessando o array de postagens e definindo usando setPosts
                    setPosts(data.data.data);
                    setCurrentPage(data.data.meta.current_page)
                    setTotalPages(data.data.meta.last_page)
                    setNumPosts(data.data.meta.total)
                } else {
                    console.error("Formato de dados inválido ou ausência de dados de postagem");
                }

                setLoading(false); // Marcando o carregamento como concluído

            })
            .catch((error) => {
                console.error("Erro:", error);
                setLoading(false); // Marcando o carregamento como concluído
            });
    }, [currentPage, titleFilter]);



    //console.log(posts)
    //console.log(currentPage)


    const handlePageChange = (page) => {
        setCurrentPage(page); // Atualizando o valor de currentPage

        //a página sobe toda vez que a pagina é trocada
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Fazendo a solicitação para atualizar a postagem no backend
    const handleSaveEdit = (editedPost) => {
        setLoadingModal(true);
        // Fazendo a solicitação para atualizar a postagem no backend
        const apiUrl = `${API.url}/posts/${editedPost.id}`;

        // Realizando uma solicitação PUT para atualizar a postagem
        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Api-Authorization': `${API.apiAuthorization}`,
                'Authorization': `${API.authorization}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedPost), // Enviando os dados da postagem editada
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a postagem');
                }
                // Atualizando o estado das postagens com a postagem editada
                setPosts((prevPosts) =>
                    prevPosts.map((post) => (post.id === editedPost.id ? editedPost : post))
                );
                // Limpando o estado de edição
                setEditingPost(null);
                setLoadingModal(true);
            })
            .catch((error) => {
                console.error('Erro ao atualizar a postagem:', error);

            });

    };

    //Reseta o modal de edição
    useEffect(() => {
        if (editingPost !== null) {
            setLoadingModal(false); // Redefindo isSaving como false quando o modal de edição for exibido
        }
    }, [editingPost]);



    // Função para confirmar a exclusão de uma postagem
    const handleConfirmDelete = (post) => {
        setLoadingModal(true);
        // Solicitação para excluir a postagem no backend
        const apiUrl = `${API.url}/posts/${post.id}`;

        // Realizando uma solicitação DELETE para excluir a postagem
        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Api-Authorization': `${API.apiAuthorization}`,
                'Authorization': `${API.authorization}`,

            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir a postagem');
                }
                // Atualizando o estado das postagens removendo a postagem excluída
                setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
                // Limpando o estado de exclusão
                setDeletingPost(null);

            })
            .catch((error) => {
                console.error('Erro ao excluir a postagem:', error);

            });

    };

    useEffect(() => {
        if (deletingPost !== null) {
            setLoadingModal(false); // Redefindo isSaving como false quando o modal de edição for exibido
        }
    }, [deletingPost]);

    const openPostModal = (post) => {
        setindiviudalPost(post);
        setShowPostModal(true);
    };

    // Função para fechar o modal
    const closePostModal = () => {
        setindiviudalPost(null);
        setShowPostModal(false);
    };

    return (

        <div>
            {/* CHAMANDO O HEADER */}
            <HeaderMain />



            <input
                type="text"
                placeholder="Filtrar por título"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                className='filterText'
            />

            {/* CENTRALIZANDO A TABLE */}
            <Stack gap={1} className="col-md-10 mx-auto">
                <div className="table-responsive">


                    {/* VERIFICANDO O ESTADO DO SPINNER */}
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p className='text-white'>Carregando dados...</p>
                        </div>
                    ) : (
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th className='dataText'>Título do conteúdo</th>
                                    <th className='dataText'>Tag</th>
                                    <th className='dataText'>Publicação</th>
                                    <th className='dataText'>Atualização</th>
                                    <th className='dataText'>Acesso</th>
                                    <th style={{ textAlign: "center" }}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id}>
                                        <td className='dataText'>{post.title}</td>
                                        <td className='dataText'>{post.tags ? post.tags : '---'}</td>
                                        <td className='dataText'><DateTimeTable date={post.published_at} /></td>
                                        <td className='dataText'><DateTimeTable date={post.updated_at} /></td>
                                        <td></td>
                                        <td className="button-container dataText">
                                            <Button
                                                variant="primary"
                                                onClick={() => setEditingPost(post)}>
                                                Editar

                                            </Button>

                                            <Button
                                                variant="danger"
                                                onClick={() => setDeletingPost(post)}>
                                                Excluir

                                            </Button>

                                            <Button
                                                variant="success"
                                                onClick={() => openPostModal(post)}
                                            >
                                                <FaEye />
                                            </Button>

                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </Table>
                    )}



                </div>

                <Container fluid>
                    <Row className='justify-content-between'>
                        <Col lg="2" md="4" sm="6" xs="2">
                            <Pagination size="sm" className='paginationContainer'>
                                <Pagination.Prev
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <Pagination.Item
                                        key={index}
                                        active={index + 1 === currentPage}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>

                        </Col>
                        
                        <Col lg="2" md="4" sm="6" xs="2">
                            <div>
                                <span className=' totalpagesText text-white'>{numPosts} posts</span>
                            </div>
                        </Col>
                    </Row>
                </Container>











            </Stack>

            {/* Modal de Edição */}
            <Modal show={editingPost !== null} onHide={() => setEditingPost(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Postagem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingPost && ( // Verificando se editingPost não é nulo
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label text-dark">
                                    Título:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    value={editingPost.title}
                                    onChange={(e) => {
                                        const updatedPost = { ...editingPost, title: e.target.value };
                                        setEditingPost(updatedPost);
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tags" className="form-label text-dark">
                                    Tags:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tags"
                                    value={editingPost.tags}
                                    onChange={(e) => {
                                        const updatedPost = { ...editingPost, tags: e.target.value };
                                        setEditingPost(updatedPost);
                                    }}
                                />
                            </div>

                        </form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditingPost(null)}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={() => handleSaveEdit(editingPost)}>

                        {isLoading ? 'Salvando…' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* Modal de Exclusão */}
            <Modal show={deletingPost !== null} onHide={() => setDeletingPost(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza de que deseja excluir esta postagem?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeletingPost(null)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleConfirmDelete(deletingPost)}
                    >

                        {isLoading ? 'Deletando…' : 'Confirmar'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Visualização de Postagem */}
            <Modal show={showPostModal} onHide={closePostModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalhes da Postagem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Renderizando as informações da postagem*/}
                    {indiviudalPost && (
                        <div>
                            <h3>{indiviudalPost.title}</h3>
                            <p>Tags: {indiviudalPost.tags ? indiviudalPost.tags : '---'}</p>
                            <p>Publicado em: <DateTimeTable date={indiviudalPost.published_at} /></p>
                            <p>Atualizado em: <DateTimeTable date={indiviudalPost.updated_at} /></p>

                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closePostModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Feed