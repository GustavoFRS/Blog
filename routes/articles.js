const express = require('express')
const Article = require('./../models/article')
const passport = require('passport')
router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})


router.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/show', { article: article })
})


router.post('/', authCheck, async (req, res, next) => {
    
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try {
        article = await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch (err) {
        res.render('articles/new', {article: article})
    }
})

router.put('/:id', authCheck, async (req, res, next) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try {
        article = await article.save()
        res.redirect(`/articles/${article.id}`)
    } catch (err) {
        res.render(`articles/edit`, {article: article})
    }
})

router.delete('/:id', authCheck, async (req, res) => {
    const article = await Article.findById(req.params.id)
    if (!article) {
        res.redirect('/')
    }

    
    res.redirect('/')
})



function authCheck(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/')
}






module.exports = router