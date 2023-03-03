const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

// <!-- <div class="form-group">
//   <label for="title">Title</label>
//   <input required value="<%= article.title %>" type="text" name="title" id="title" class="form-control">
// </div>
// <div class="form-group">
//   <label for="description">Description</label>
//   <textarea name="description" id="description" class="form-control"><%= article.description %></textarea>
// </div>
// <div class="form-group">
//   <label for="markdown">Markdown</label>
//   <textarea required name="markdown" id="markdown" class="form-control"><%= article.markdown %></textarea>
// </div>

// <a href="/" class="btn btn-secondary">Cancel</a>
// <button type="submit" class="btn btn-primary">Save</button> -->


articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  next()
})

// <!-- <div class="form-group">
//   <label for="title">Title</label>
//   <input required value="<%= article.title %>" type="text" name="title" id="title" class="form-control">
// </div>
// <div class="form-group">
//   <label for="description">Description</label>
//   <textarea name="description" id="description" class="form-control"><%= article.description %></textarea>
// </div>
// <div class="form-group">
//   <label for="markdown">Markdown</label>
//   <textarea required name="markdown" id="markdown" class="form-control"><%= article.markdown %></textarea>
// </div>

// <a href="/" class="btn btn-secondary">Cancel</a>
// <button type="submit" class="btn btn-primary">Save</button> -->


module.exports = mongoose.model('Article', articleSchema)