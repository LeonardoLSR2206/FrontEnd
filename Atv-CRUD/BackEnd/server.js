// Inserir bibliotecas
const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors')

// Configuração do servidor
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// Criação do sqlite3
const db = new sqlite3.Database('./Database.db')

db.run(`CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    autor TEXT,
    ano TEXT,
    genero TEXT,
    idioma TEXT,
    preco REAL
    )
`)

// Cadastrar livro
app.post('/livros', async (req, res) => {
    let titulo = req.body.titulo;
    let autor = req.body.autor;
    let ano = req.body.ano;
    let genero = req.body.genero;
    let idioma = req.body.idioma;
    let preco = req.body.preco;

    db.run(`INSERT INTO livros (titulo, autor, ano, genero, idioma, preco) VALUES (?, ?, ?, ?, ?, ?)`,
        [titulo, autor, ano, genero, idioma, preco],
        function() {
            res.json({
                id: this.lastID,
                titulo,
                autor,
                ano,
                genero,
                idioma,
                preco
            })
        }
    )
});

// Listar livros
app.get('/livros', (req, res) => {
    let idLivro = req.params.id;

    db.all(`SELECT id, titulo, autor, ano, genero, idioma, preco FROM livros`, [], (err, rows) => {
        res.json(rows)
    })
})

// Selecionar um livro
app.get('/livros/:id', (req, res) => {
    let idLivro = req.params.id;

    db.get(`SELECT id, titulo, autor, ano, genero, idioma, preco FROM livros
    WHERE id = ?`
    [idLivro], (err, result) => {
        if(result){
            res.json(result)
        } else {
            res.status(404).json({
                "message" : "Livro não encontrado."
            })
        }
    })
})

// Deletar um livro
app.delete('/livros/:id', (req, res) => {
    let idLivro = req.params.id

    db.run(`DELETE FROM livros WHERE id = ?`,
    [idLivro], function() {
        // Verifica
        if(this.changes === 0){
            return res.status(404).json({
                "message" : "Livro não encontrado."
            })
        } else {
            res.json({
                "message" : "Livro deletado."
            })
        }
    })
})

// Editar livro
app.put("/livros/:id", async (req, res) => {
    let idLivro = req.params.id;

    let titulo = req.body.titulo
    let autor = req.body.autor
    let ano = req.body.ano
    let genero = req.body.genero
    let idioma = req.body.idioma
    let preco = req.body.preco

    db.run(`UPDATE livros SET titulo = ?, autor = ?, ano = ?, genero = ?, idioma = ?, preco = ?
        WHERE id = ?`, [titulo, autor, ano, genero, idioma, preco, idLivro],
        function() {
            res.json({
                "message" : "Livro atualizado com sucesso."
            })
        })
})

// Iniciar o servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))