// Get all posts with all their likes
export const listPosts = `
  query {
    listPosts{
      items {
        id
        postOwnerUsername
        postContent
        postOwnerId
        likes {
          items {
            id
            numberLikes
            likeOwnerUsername
            likeOwnerId
          }
        }
      }
    }
  }
`

// Get a single post and its likes
export const getPost = `query($id:ID!) {
  getPost(id:$id) {
    id
    postOwnerUsername
    postContent
    postOwnerId
    likes {
      items {
        id
        numberLikes
        likeOwnerUsername
        likeOwnerId
      }
    }
  }
}`

// Delete a post
export const deletePost = `
  mutation($id:ID!) {
    deletePost(input:{
      id: $id,
    }) {
      id
    }
  }
`

// Create a post
export const createPost = `
  mutation(
    $postContent: String!, 
    $postOwnerId: String!, 
    $postOwnerUsername: String!
    ) {
    createPost(input:{
      postOwnerUsername: $postOwnerUsername,
      postOwnerId: $postOwnerId,
      postContent: $postContent
    }) {
      id
    }
  }
`

// create a like for a post 
export const createLike = `
  mutation (
    $id:ID!,
    $numberLikes: Int!, 
    $likeOwnerUsername: String!, 
    $likeOwnerId: String!
    ) {
    createLike(input:{
      likePostId: $id,
      numberLikes:$numberLikes, 
      likeOwnerId: $likeOwnerId,
      likeOwnerUsername: $likeOwnerUsername
    }) {
      id
      numberLikes
      post {
        id      
        postContent
      }
    }
  }
`

// Delete a like
export const deleteLike = `
  mutation($id:ID!) {
    deleteLike(input:{
      id: $id,
    }) {
      id
    }
  }
`

// Get the list of all winners
export const listWinners = `
  query {
    listWinners{
      items {
        id
        postOwnerId
        postOwnerUsername
        postContent
        reputation
        maxlikes
      }
    }
  }
`