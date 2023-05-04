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


router.post('/new', authCheck, async (req, res, next) => {
    
    try {
        const {title, description, markdown} = req.body;
        const article = new Article({
            title: title,
            description: description,
            markdown: markdown,
            author: req.user._id
        })
        await article.save()

        req.flash('success', 'Article created!')
        res.redirect('/')
    } catch (error) {
        console.log(error)
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

router.delete('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!article) {
            req.flash('error', 'Article not found')
            res.redirect('/')
        }

        if (article.author.toString() !== req.user._id.toString()) {
            req.flash('error', 'You are not authorized to delete this article.');
            return res.redirect('/');
        }

        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (error) {
        req.flash('error', 'Server error')
        res.redirect('/')

    }

    
})



function authCheck(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    req.flash('error', 'Please log in to access this page.');
    res.redirect('/users/login');
}




module.exports = router