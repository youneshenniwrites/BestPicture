// Select winners
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient(
	{ region: 'eu-west-1' }
)

exports.handler = (event, context, callback) => {
	// Get posts ids with max likes
	let paramsLikes = {
		TableName: "Like",
	}
	docClient.scan(paramsLikes, (err, data) => {
		if (err) {
			callback(err, null)
		} else {
			// Run the following block
			let postsLiked = data.Items.map((post) => {
				return post.likePostId
			})

			// Construct posts with their likes
			let postsAndTheirLikes = {}
			postsLiked.map((likeCount) => {
				if (typeof postsAndTheirLikes[likeCount] === "undefined") {
					postsAndTheirLikes[likeCount] = 1
				} else {
					postsAndTheirLikes[likeCount]++
				}
			}
			)
			// Get post ids with max likes count strictly bigger than 1
			let keys = Object.keys(postsAndTheirLikes)
			let values = Object.values(postsAndTheirLikes)

			const postsIdsWithMaxLikes = posts => {
				return keys.filter(likeCount => {
					const max = Math.max(...values)
					const winnersCount = (max > 1) ? max : 0
					return posts[likeCount] === winnersCount
				})
			}
			postsIdsWithMaxLikes(postsAndTheirLikes).map(item => {
				let paramsPosts = {
					TableName: "Post",
					Key: {
						"id": item,
					},
				}
				docClient.get(paramsPosts, (err2, data2) => {
					if (err2) {
						callback(err2, null)
					} else {
						data2.Item["maxlikes"] = postsAndTheirLikes[item]
						data2.Item["reputation"] = 10
						// callback(null, data2)

						// Put them in the winners table
						let paramsBestPosts = {
							TableName: "Winner",
							Item: data2.Item
						}
						docClient.put(paramsBestPosts, (err3, data3) => {
							if (err3) {
								callback(err3, null)
							} else {
								callback(null, data3)
							}
						})
					}
				})
			})
			// callback(null, data)
		}
	})
}

