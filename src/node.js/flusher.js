// Delete likes and posts after selecting winners
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient(
	{ region: 'eu-west-1' }
)

exports.handler = (event, context, callback) => {
	// Delete all posts
	let paramsPosts = {
		TableName: "Post",
	}
	docClient.scan(paramsPosts, (err1, data1) => {
		if (err1) {
			callback(err1, null)
		} else {
			// callback(null, data1)
			data1.Items.map((post) => {
				let paramsPost = {
					TableName: "Post",
					Key: {
						"id": post.id
					}
				}
				docClient.delete(paramsPost, (err2, data2) => {
					if (err2) {
						callback(err2, null)
					} else {
						callback(null, data2)
					}
				})
			})
		}
	})
	// Delete all likes
	let paramsLikes = {
		TableName: "Like",
	}
	docClient.scan(paramsLikes, (err3, data3) => {
		if (err3) {
			callback(err3, null)
		} else {
			// callback(null, data3)
			data3.Items.map((like) => {
				let paramsLike = {
					TableName: "Like",
					Key: {
						"id": like.id
					}
				}
				docClient.delete(paramsLike, (err4, data4) => {
					if (err4) {
						callback(err4, null)
					} else {
						callback(null, data4)
					}
				})
			})
		}
	})
}



