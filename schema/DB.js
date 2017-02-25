const Users = {
  'a': {
    id: 'a',
    name: 'alice',
  },
  'b': {
    id: 'b',
    name: 'bob',
  },
}

const Authors = {
  'Authors001': {
    ID: 'Authors001',
    FirstName: 'Guzman',
    LastName: 'Monne',
    Posts: [
      'Posts001',
      'Posts003',
    ],
  }, 
  'Authors002': {
    ID: 'Authors002',
    FirstName: 'Miguel',
    LastName: 'Monne',
    Posts: [
      'Posts002',
    ],
  }
}

const Posts = {
  'Posts001': {
    ID: 'Posts001',
    Title: 'Title001',
    Author: 'Authors001',
    Votes: 5,
  }, 
  'Posts002': {
    ID: 'Posts002',
    Title: 'Title002',
    Author: 'Authors002',
    Votes: 15,
  }, 
  'Posts003': {
    ID: 'Posts003',
    Title: 'Title003',
    Author: 'Authors001',
    Votes: 15,
  }
}

const Model = function(Table, methods) {
  return Object.assign({}, {
    add: (model) => (
      model.id 
        ? (Table[model.id] = model) && model
        : new Error('The ID is not defined.')
    ),
    remove: (id) => (
      Table[id]
        ? (delete Table[id]) && id
        : new Error('The model is not defined.')
    ),
    update: (id, data) => (
      id && Table[id]
        ? (Table[id] = Object.assign({}, Table[id], data)) && Table[id]
        : new Error('The ID or Table is not defined') 
    ),
    get: (id) => (
      id && Table[id]
        ? Table[id]
        : new Error('The ID or Table is not defined')
    ),
    list: () => (
      Table
        ? Object.keys(Table).map(key => Table[key])
        : new Error(`The table ${Table} is not defined.`)
    ),
  }, methods)
}

exports = module.exports = {
  Authors: Model(Authors, {
    posts: (author) => (
      author.ID
        ? Object.keys(Posts)
          .filter(ID => Posts[ID].Author === author.ID)
          .map(ID => Posts[ID])
        : new Error('The author ID is not defined.')
    )
  }),
  Posts: Model(Posts, {
    upvote: (id) => (
      id && Posts[id]
        ? (Posts[id].Votes = (Posts[id].Votes || 0) + 1) && Posts[id]
        : new Error('The id or the post is not defined.')
    ),
    author: (post) => (
      post.Author && Authors[post.Author]
        ? Authors[post.Author]
        : new Error('The post author is not defined.')
    )
  }),
  Users: Model(Users)
}
