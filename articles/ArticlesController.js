const express = require("express");
const router = express.Router();
const Category = require("../categories/Category")
const Articles = require("./Articles");
const slugify = require("slugify");

// Rota para formulário de nova artigo (corrigido)
router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories });
    }).catch(err => {
        console.error("Erro ao carregar categorias:", err);
        res.redirect("/admin/articles")
    })
});

// Rota para salvar artigo (corrigido)
router.post("/articles/save", (req, res) => {
    const { title, body, category } = req.body;

    console.log("Dados Recebidos: ", title, body, category);

    if (title && body && category) {
        Articles.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then(() => {
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
    Articles.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", { articles });
    }).catch(err => {
        console.error("Erro ao buscar artigos:", err);
        res.redirect("/");
    });
});

// Rota para deletar uma artigo (corrigido)
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
