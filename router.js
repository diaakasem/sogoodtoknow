import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import TwitterClass from './node/twitter.js'
import Manager from './node/youwiki.js'

const Twitter = new TwitterClass()


function deleteFolderRecursive(pathToDelete) {
    if (!fs.existsSync(pathToDelete)) {
        return;
    }
    const files = fs.readdirSync(pathToDelete)
    _.each(files, (file) => {
        const curPath = path.join(pathToDelete, file)
        if (fs.statSync(curPath).isDirectory()) { // recurse
            return deleteFolderRecursive(curPath)
        }
        fs.unlinkSync(curPath)
    })
    fs.rmdirSync(pathToDelete)
}

export default async function router(app) {

    const ProjectModel = mongoose.model('Project')
    const m = new Manager()

    app.post('/build/url/', async function (req, res) {
        const { url } = req.body
        try {
            const result = await m.run(url)
            result.status = 'created'
            await ProjectModel.create(result)
            return res.json({ result: 'done' })
        } catch (err) {
            console.error(err);
            return res.json({ result: 'error' })
        }
    })

    app.post('/build/random/', async (req, res) => {
        try {
            const result = await m.run('random')
            result.status = 'created'
            await ProjectModel.create(result)
            return res.json({ result: 'done' })
        } catch (err) {
            console.error(err);
            return res.json({ result: 'error' })
        }
    })

    app.post('/build/today/', async (req, res) => {
        try {
            const result = await m.run(null)
            result.status = 'created'
            await ProjectModel.create(result)
            return res.json({ result: 'done' })
        } catch (err) {
            console.error(err);
            return res.json({ result: 'error' })
        }
    })

    app.post('/project/', async (req, res) => {
        const { status } = req.body
        const list = await ProjectModel.find({ status })
        return res.status(200).send(list)
    })

    app.delete('/project/:id', async (req, res) => {
        const { id } = req.params
        const { name } = await ProjectModel.findOne({ _id: id })
        await ProjectModel.remove({ _id: id })
        deleteFolderRecursive(path.join('app', 'projects', name))
        return res.json({})
    })

    app.post('/project/:id', async (req, res) => {
        const { status } = req.body
        const project = await ProjectModel.update({
            _id: req.params.id
        }, { status })
        return res.json(project)
    })

    app.get('/project/:id', async (req, res) => {
        const { id } = req.params
        const project = await ProjectModel.findOne({ _id: id })
        return res.json(project)
    })

    app.get('/trends/:name', async (req, res) => {
        const { name } = req.params
        try {
            const obj = await Twitter.placeTrends(name)
            console.log(obj)
            return res.send(obj)
        } catch (err) {
            console.error(err)
        }
    })
};
