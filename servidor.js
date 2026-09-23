// ============================================================
// API do Diario de Treinos
// Back-End I - CEEP Pedro Boaretto Neto
// ============================================================
// Este arquivo esta quase vazio DE PROPOSITO.
// Hoje voce vai escrever as rotas, uma de cada vez, conferindo
// no testes.http se cada uma responde o status certo.
// O que cada rota deve fazer esta no README.md.
// ============================================================

const express = require('express');
const {DatabaseSync} = require('node:sqlite');

const app = express();
app.use(express.json());

const db = new DatabaseSync('treinos.db')

const treinos = [];
let proximoId = 1;

db.exec(`
    CREATE TABLE IF NOT EXISTS treinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        duracao INTEGER NOT NULL
    )
`);

function validarTreino(corpo) {
    if (typeof corpo.nome !== 'string' || corpo.nome.trim() === '') {
        return 'O campo nome e obrigatorio e deve ser um texto .';
    }
    if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
        return 'O campo duracao e obrigatorio e deve ser um numero maior que zero .';
    }
    return null;
}

app.get('/treinos', (req, res) => {
    const treinos = db.prepare('SELECT * FROM treinos').all();
    res.status(200).json(treinos);
});

app.get('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);
    const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
        if(treino === undefined){
            return res.status(404).json({ erro:'Treino não encontrado.' });
        }

    res.status(200).json(treino);
});

app.post('/treinos', (req , res) => {
    const erro = validarTreino(req.body);
        if (erro !== null ){
            return res.status(400).json({ erro: erro });
    }

const resultado = db
    .prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
    .run(req.body.nome, req.body.duracao);

const novo = db
    .prepare('SELECT * FROM treinos WHERE id = ?')
    .get(resultado.lastInsertRowid);

    res.status(201).json(novo);

});

app.put('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);

    const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    if(treino === undefined){
        return res.status(404).json({ erro: 'Treino não encontrado.'});
    }

    const erro = validarTreino(req.body);
    if(erro !== null){
        return res.status(400).json({ erro: erro});
    }

    db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
      .run(req.body.nome, req.body.duracao, id);
    
    const atualizado = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    res.status(200).json(treino);
});

app.delete('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);

    const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    if(treino === undefined){
        return res.status(404).json({erro: 'Treino não encontrado.'});
    }

    db.prepare('DELETE FROM treinos WHERE id = ?').run(id);

    res.status(204).end();
});

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
