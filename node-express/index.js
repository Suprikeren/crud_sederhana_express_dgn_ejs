const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

//  Browser umumnya hanya mendukung metode HTTP GET dan POST dalam formulir HTML.
const methodOverride = require('method-override') // untuk mendukung htto yang berbeda sehinga bisa mengunakan method put, patch dan delete
// npm install method-override //install method override untuk menjalankan methodOverridenya
const path = require('path')
const mongoose = require('mongoose')

// models
const Product = require('./models/product')

// connect ke mongodb
mongoose.connect('mongodb://127.0.0.1:27017/belajar',)
.then((result) => {
    console.log('berhasil connect ke mongo db')
}).catch((error)=> {
    console.log(error)
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true })) //middleware untuk mengurai/reques data formulir yang dikirimkan
app.use(methodOverride('_method')) //


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/products', async (req, res) => {
// filter data produk berdasarkan kategori //tapi selesaikan duu crudnya baru beri kode di bawah ini
const { category } = req.query
if(category) {
  const products = await Product.find({ category })
  res.render('products/index', { products, category})
} else {
  const products = await Product.find({})
  res.render('products/index', {products, category: 'All'})
}
// 
// ini adalah kode awal sebelum memfilter data
//  const products = await Product.find({})
// //  console.log(products)
//  res.render('products/index', {products})
})

app.get('/products/create', (req, res) => {
  res.render('products/create')
})


app.post('/products/post',async (req, res) => {
  const product = new Product(req.body)
  await product.save()
  res.redirect(`/products/${product._id}`);
})

app.get('/products/:id', async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)
  res.render('products/show', {product})
})

app.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id) //mengambil semua id
  res.render('products/edit', {product})
})

app.put('/products/:id', async (req, res)=> {
  const { id } = req.params //untuk mendapatkan paramaeter idnya
  const product = await Product.findByIdAndUpdate(id, req.body) //findByIdAndUpdate untuk mencari data berdasarkan id, jika ketemu lakukan update
  res.redirect(`/products/${id}`)
})

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params
  await Product.findByIdAndDelete(id) ////findByIdAndDelete untuk mencari data berdasarkan id, jika ketemu lakukan Delete
  res.redirect('/products')
})

app.listen(port, () => {
  console.log(`aplikasi berjalan ${port}`)
})
