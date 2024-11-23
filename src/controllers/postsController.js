import { getAllPosts, createPost, updatePost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js";
import fs from 'fs'

export async function listarPosts(req, res) {
    const posts = await getAllPosts();
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body
    try {
        const postCriado = await createPost(novoPost)
        res.status(200).json(postCriado)
    } catch (err) {
        console.error("Ocorreu um erro ao criar um novo post:", err.message)
        res.status(500).json({ "Erro": "Falha na requisição." })
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    }

    try {
        const postCriado = await createPost(novoPost)
        const imgAtualizada = `uploads/${postCriado.insertedId}.png`
        fs.renameSync(req.file.path, imgAtualizada)
        res.status(200).json(postCriado)
    } catch (err) {
        console.error("Ocorreu um erro ao criar um novo post:", err.message)
        res.status(500).json({ "Erro": "Falha na requisição." })
    }
}

export async function atualizarPost(req, res) {
    const id = req.params.id
    const urlImagem = `http://localhost:3000/${id}.png`
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await updatePost(id, post)
        res.status(200).json(postCriado)
    } catch (err) {
        console.error("Ocorreu um erro ao criar um novo post:", err.message)
        res.status(500).json({ "Erro": "Falha na requisição." })
    }
}
