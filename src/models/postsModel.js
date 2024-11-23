import 'dotenv/config';
import conectarAoBanco from "../config/dbConfig.js";
import { ObjectId } from "mongodb";
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function getAllPosts() {
    const db = conexao.db("imersao-dev")
    const colecao = db.collection("posts")
    return colecao.find().toArray()
}

export async function createPost(newPost) {
    const db = conexao.db("imersao-dev")
    const colecao = db.collection("posts")
    return colecao.insertOne(newPost)
}

export async function updatePost(id, newPost) {
    const db = conexao.db("imersao-dev")
    const colecao = db.collection("posts")
    const ObjId = ObjectId.createFromHexString(id)
    return colecao.updateOne({ _id: new ObjectId(ObjId) }, { $set: newPost })
}