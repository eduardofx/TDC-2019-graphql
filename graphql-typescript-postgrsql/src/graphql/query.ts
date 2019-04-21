import { userQueries } from './resources/user/user.schema'
import { postQueries } from './resources/post/post.schema'
import { commentQueries } from './resources/comment/coment.schema'
const Query = `

    type Query {
        ${userQueries}
        ${postQueries}
        ${commentQueries}
    }

`

export {
    Query
}