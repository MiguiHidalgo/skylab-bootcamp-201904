import models from '../data/models'
import argon2 from 'argon2'
import LogicError from './logic-error'

const { User, Note } = models

const logic = {
    registerUser(name, surname, email, password) {
        // TODO validate inputs


        // TODO implement logic
        return (async () => {
            const hash = await argon2.hash(password)

            // TODO end logic, other cases, flows, states... (user already exists check, etc)

            await User.create({ name, surname, email, password: hash })
        })()
    },

    authenticateUser(email, password) {
        // TODO validate inputs

        // TODO implement logic
        return (async () => {
            const user = await User.findOne({ email })

            if (await argon2.verify(user.password, password)) return user.id
            else throw new LogicError('wrong credentials')
        })()
    },

    retrieveUser(id) {
        // TODO validate inputs

        // TODO implement logic
        return (async () => {
            // 1

            // const user = await User.findById(id).lean()

            // user.id = user._id.toString()
            // delete user._id

            // delete user.password
            // delete user.notes
            // delete user.__v

            // return user

            // 2

            return  await User.findById(id).select('name surname email -_id').lean()

            // 3

            // const { name, surname, email } = await User.findById(id)

            // return { name, surname, email }
        })()
    },

    addPublicNote(userId, text) {
        // TODO validate inputs

        // TODO implement logic

        // return Note.create({ author: userId, text }).then(() => {})

        return (async () => {
            await Note.create({ author: userId, text })
        })()
    },

    removePublicNote(userId, notedId) {
        // TODO validate inputs

        // TODO implement logic
    },

    listPublicNotes(userId) {
        // TODO validate inputs

        // TODO implement logic
    },

    addPrivateNote(userId, text) {
        // TODO validate inputs

        // TODO implement logic
    },

    removePrivateNote(userId, noteId) {
        // TODO validate inputs

        // TODO implement logic
    },

    listPrivateNotes(userId) {
        // TODO validate inputs

        // TODO implement logic
    }
}

export default logic