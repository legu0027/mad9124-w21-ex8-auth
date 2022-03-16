import express from 'express'
import bcrypt from 'bcrypt'
import createDebug from 'debug'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import User from '../../models/User.js'
const router = express.Router()
const debug = createDebug('mad9124-w22-ex8-auth:auth')
const saltRounds = 14

// Register a new user
router.post('/users', sanitizeBody, async (req, res) => {
  const newUser = new User(req.sanitizedBody)
  const itExists = Boolean(await User.countDocuments({ email: newUser.email }))
  if (itExists) {
    return res.status(400).send({
      errors: [
        {
          status: '400',
          title: 'Validation Error',
          detail: `Email address '${newUser.email}' is already registered.`,
          source: { pointer: '/data/attributes/email' }
        }
      ]
    })
  }
  newUser.password = await bcrypt.hash(newUser.password, saltRounds)
  try {
    await newUser.save()
    res.status(201).json({ data: newUser })
  } catch (err) {
    debug(err)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving document to the database.',
        },
      ],
    })
  }
})

// Login a user and return an authentication token.
router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody
  const user = await User.findOne({ email: email })

const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
const hashedPassword = user ? user.password : badHash
const passwordDidMatch = await bcrypt.compare(password, hashedPassword)

if (!user || !passwordDidMatch) {
  return res.status(401).send({ errors: ['we will build this later'] })
}

const token = 'iamatoken'
res.status(201).send({ data: { token } })
})

export default router