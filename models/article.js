const mongoose = require('mongoose')
const { marked } = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  markdown: {
    type: String,
    required: true
  },

  publishDate: {
    type: Date,
    default: Date.now()
  },

  xxx: {
    type: String
  }

})

articleSchema.pre('validate', function(next) {
  if (this.markdown) {
    this.xxx = dompurify.sanitize(marked.parse(this.markdown))
  }
  next();
})


module.exports = mongoose.model('Article', articleSchema)