'user strict'

var PosterItem = function(text) {
  if (text) {
    var obj = JSON.parse(text)
    this.title = obj.title
    this.content = obj.content
    this.author = obj.author
  }
}

PosterItem.prototype = {
  toString: function () {
    return JSON.stringify(this)
  }
}

var ThePoster = function () {
  LocalContractStorage.defineMapProperty(this, "data", {
    parse: function (text) {
      return new PosterItem(text)
    },
    stringify: function (obj) {
      return obj.toString()
    }
  })
}

ThePoster.prototype = {
  init: function () {},

  save: function (title, content) {
    if (!title || !content) {
      throw new Error("Empty title or content")
    }

    if (title.length > 20 || content.length > 500) {
      throw new Error("Title or content exceed limit length")
    }

    var from = Blockchain.transaction.from
    var posterItem = this.data.get(title)
    if (posterItem) {
      throw new Error("Poster has been occupied")
    }

    posterItem = new PosterItem()
    posterItem.author = from
    posterItem.title = title
    posterItem.content = content

    this.data.put(title, posterItem)
  },

  get: function (title) {
    if (!title) {
      throw new Error("Empty title")
    }
    return this.data.get(title)
  }
}

module.exports = ThePoster
