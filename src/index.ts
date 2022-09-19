// const escpos = require('escpos')
import escpos, { USB } from 'escpos'
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb')
// Select the adapter based on your printer type
const printerList: any = escpos.USB.findPrinter()
const { idVendor, idProduct } = printerList[0].deviceDescriptor
const device = new escpos.USB(idVendor, idProduct)

// const device  = new escpos.Network('localhost')
// const device  = new escpos.Serial('/dev/usb/lp0')

const options = { encoding: 'UTF-8' /* default */ }
// encoding is optional

const printer = new escpos.Printer(device, options)

function print(title: string, author: string, url: string, created_at: string) {
  device.open((error: any) => {
    printer
      .font('B')
      .size(2, 2)
      .align('CT')
      .style('BU')
      .text('PR Review')
      .size(1, 1)
      .align('LT')
      .style('NORMAL')
      .text('')
      .text(`url: ${url}`)
      .text(`author: ${author}`)
      .text(`created_at: ${created_at}`)
      .text('')
      .text(`title: ${title}`)
      .text('')
      .text('')
      .cut()
      .close()
  })
}

import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()

const app: Express = express()
app.use(bodyParser.json())

const port = process.env.PORT || 3333

app.post('/github', (req: Request, res: Response) => {
  const { action } = req.body

  switch (action) {
    case 'review_requested':
      const {
        pull_request: {
          title,
          url,
          user: { login: author },
          created_at,
        },
        requested_reviewer: { login: reviewer },
      } = req.body
      if (reviewer === 'cesarvargas00') {
        console.log(title)
        print(title, author, url, created_at)
      }
  }
  res.send('ok')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})
