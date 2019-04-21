import app from './app'
import db from './models'

const Sync = async () => {
    await db.sequelize.sync()
    app.listen(process.env.PORT || 3000, () => {
        console.log('🚀 Listening on port 3000')     
    })
}
Sync()

  