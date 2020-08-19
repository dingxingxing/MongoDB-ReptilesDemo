
let axiso = require('axios')



// 设置insertManyPromise函数
function insertMany(collection, arr) {
  return new Promise((resolve, reject) => {
    MongoClinet = require('mongodb').MongoClient
    var url = 'mongodb://localhost:27017'
    MongoClinet.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      var dbo = db.db('xiaoyu')
      dbo.collection(collection).insertMany(arr, (err, res) => {
        if (err) throw err
        console.log('插入的文档数量为：' + res.insertedCount);
        db.close()
        resolve()
      })
    })
  })
}


// 设置insertOnePromise函数
function insertOne(collection, obj) {
  return new Promise((resolve, reject) => {
    MongoClinet = require('mongodb').MongoClient
    var url = 'mongodb://localhost:27017'
    MongoClinet.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err
      var dbo = db.db('xiaoyu')
      dbo.collection(collection).insertOne(obj, (err, res) => {
        if (err) throw err
        console.log('插入的文档成功');
        db.close()
        resolve()
      })
    })
  })
}

// 获取英雄列表
async function getHeroList() {
  let httpUrl = "https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js"
  let result = await axiso.get(httpUrl)
  console.log(result.data.hero);
  await insertMany('herolist', result.data.hero)
  return result.data.hero
}
// getHeroList()

// 获取英雄信息内容，并存入数据库
async function getHero(heroid) {
  let httpUrl = `https://game.gtimg.cn/images/lol/act/img/js/hero/${heroid}.js`
  let result = await axiso.get(httpUrl)
  await insertOne('heroinfo', result.data.hero)
  return result.data
}

// 定义主函数，先获取所有英雄列表，并循环英雄列表将所有英雄详情内容载入
async function run() {
  let herolist = await getHeroList()
  await herolist.reduce(async (prev, item, i) => {
    await prev
    return new Promise(async (resolve, reject) => {
      await getHero(item.heroId)
      resolve()
    })
  }, Promise.resolve())
}
run()
