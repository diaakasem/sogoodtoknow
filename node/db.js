'use strict'

import mongoose from 'mongoose'

export const projectSchema = new mongoose.Schema({
  name: { type: String, index: true },
  title: String,
  text: String,
  description: String,
  keywords: String,
  images: [],
  status: String,
  youtube: String,
  wikipedia: String,
  audio: {
    voice: String,
    file: String
  }
})

export async function config (app) {
  mongoose.model('Project', projectSchema)
  const connectionUrl = app.get('db connect string')
  // console.info('Connection URL', connectionUrl)
  try {
      return await mongoose.connect(connectionUrl + '?useNewUrlParser=true', {
          useNewUrlParser: true
      })
  } catch (e) {
      console.error(e)
      throw e
  }
}
