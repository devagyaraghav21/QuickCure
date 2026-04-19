// import multer from 'multer'
// import fs from 'fs'

// if (!fs.existsSync('upload')) {
//     fs.mkdirSync('upload')
// }


// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, 'upload/')
//     },
//     filename: function (req, file, callback) {
//         callback(null, Date.now() + '-' + file.originalname) // 🔥 IMPORTANT
//     }
// })

// const upload = multer({ storage })

// export default upload
import multer from 'multer'

const upload = multer()

export default upload
