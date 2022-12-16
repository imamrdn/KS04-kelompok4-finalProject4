const router = require('express').Router()
const SocialMedia = require('../controllers/SocialMediaController')


router.post('/', SocialMedia.Create)
router.put('/:socialMediaId', SocialMedia.Update)
router.delete('/:socialMediaId', SocialMedia.Delete)
router.get('/', SocialMedia.Get)


module.exports = router