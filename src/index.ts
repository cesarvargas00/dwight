import escpos, { USB } from 'escpos'
escpos.USB = require('escpos-usb')
const printerList: any = escpos.USB.findPrinter()
const { idVendor, idProduct } = printerList[0].deviceDescriptor
const device = new escpos.USB(idVendor, idProduct)

const options = { encoding: 'UTF-8' /* default */ }

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
        // console.log(title)
        print(title, author, url, created_at)
      }
  }
  res.send('ok')
})
const crypto = require('crypto')
const secret =
  'A5TVC5XWV0PBGQ5ZI47LHRTKDDETAQTQC2IFP7BSZUZO3TDUH6CJPY60GZHKOKVD'
app.post('/clickup', (req: Request, res: Response) => {
  const { event, history_items } = req.body
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
  const signature = hash.digest('hex')
  if (req.get('x-signature') !== signature) return res.sendStatus(500)
  switch (event) {
    case 'taskStatusUpdated': {
      if (history_items[0].before.status === 'qa') {
        console.log(req.body)
        // print('taskStatusUpdated', 'cesarvargas00', 'https://app.clickup.com/1234567', '2020-01-01')
      }
    }
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})
