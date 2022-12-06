const router = require('express').Router()
const CommentsController = require('../controllers/CommentsController')

router.post('/', CommentsController.Create)
router.get('/', CommentsController.Get)
router.put('/:commentId', CommentsController.Update)
router.delete('/:commentId', CommentsController.Delete)

module.exports = router