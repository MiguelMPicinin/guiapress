const express = require("express");
const router = express.Router();
const Articles = require("./Articles");
const slugify = require("slugify");

// Rota para formulário de nova artigo
router.get("/admin/articles/new", (req, res) => {
    res.render("admin/articles/new");
});

// Rota para salvar artigo
router.post("/articles/save", (req, res) => {
    const title = req.body.title;
    console.log("Título recebido:", title);
    const body = req.body.body

    if (title != undefined && title.trim() !== "") {
        Articles.create({
            title: title,
            slug: slugify(title),
            body: body
        }).then(Articles => {
            console.log("artigo salva:", Articles);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao salvar artigo:", err);
            res.redirect("/admin/articles/new");
        });
    } else {
        res.redirect("/admin/articles/new");
    }
});

// Rota para listagem de artigos
router.get("/admin/articles", (req, res) => {
    Articles.findAll().then(articles => {
        console.log("artigos encontradas:", articles);
        res.render("admin/articles/index", { articles });
    }).catch(err => {
        console.error("Erro ao buscar artigos:", err);
        res.redirect("/");
    });
});

// Rota para deletar uma artigo
router.post("/articles/delete", (req, res) => {
    const id = req.body.id;

    if (id != undefined && !isNaN(id)) {
        Articles.destroy({
            where: { id: id }
        }).then(() => {
            console.log("artigo deletado, ID:", id);
            res.redirect("/admin/articles");
        }).catch(err => {
            console.error("Erro ao deletar artigo:", err);
            res.redirect("/admin/articles");
        });
    } else {
        res.redirect("/admin/articles");
    }
});

module.exports = router;
