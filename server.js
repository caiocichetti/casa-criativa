// usei o express pra criar e configurar meu servidor
const express = require("express");
const server = express();

const db = require("./db");

// const ideas = [
//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
//         title: "Cursos de Programação",
//         category: "Estudo",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//         url: "http://rocketseat.com.br",
//     },
//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
//         title: "Exercícios",
//         category: "Saúde",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//         url: "http://rocketseat.com.br",
//     },
//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
//         title: "Meditação",
//         category: "Mentalidade",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//         url: "http://rocketseat.com.br",
//     },
//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729032.svg",
//         title: "Karaokê",
//         category: "Diversão em Família",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//         url: "http://rocketseat.com.br",
//     },
//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729038.svg",
//         title: "Pintura",
//         category: "Criatividade",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//         url: "http://rocketseat.com.br",
//     },
//     {
//         img: "https://image.flaticon.com/icons/svg/2729/2729048.svg",
//         title: "Recortes",
//         category: "Criatividade",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//         url: "http://rocketseat.com.br",
//     },
// ];

// configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"));

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }));

// configuração do nunjucks
const nunhucks = require("nunjucks");
nunhucks.configure("views", { 
    express: server,
    noCache: true, // bollean
});

// criei uma rota /
// e capturo o pedido do cliente para responder
server.get("/", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {

        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados!");
        }

        const reversedIdeas = [...rows].reverse();

        let lastIdeas = []
        for (let idea of reversedIdeas) {
            if(lastIdeas.length < 2) {
                lastIdeas.push(idea);
            }
        }
    
        return res.render("index.html", { ideas: lastIdeas });
    });
});

server.get("/ideias", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {

        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados!");
        }

        const reversedIdeas = [...rows].reverse();

        return res.render("ideias.html", { ideas: reversedIdeas });
    });
});

server.post("/", function(req, res) {
    // INSERIR DADO NA TABELA
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?, ?, ?, ?, ?); 
    `  
    const values = [   
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    db.run(query, values, function(err) {
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados!");
        }

        return res.redirect("/ideias");
    });
});

server.get('/delete/:id', function(req, res) {
    const { id }  = req.params

    console.log(id);

    // DELETAR UM DADO DA TABELA
    db.run(`DELETE FROM ideas WHERE id = ?`, [id], function(err) {
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados!");
        }
        return res.redirect('/ideias')
    });

});

// liguei meu servidor na porta 3000
server.listen(3000);
