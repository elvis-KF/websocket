let mysql = require('mysql')
let db = require('../configs/db')
let pool = mysql.createPool(db)

module.exports = {
  /** 连接数据库执行操作
   * sql: sql语句
   * val: 值
   * cb: 执行函数
   */
  connPool(sql, cb){
    return new Promise((reslove, reject) => {
      //先连接，再查询，最后释放
      pool.getConnection((err, conn) => {
        if(err) {
          // log失败
          console.log(err)
        } else {
          // 查询
          const q = conn.query(sql, (err, rows) => {
           if(err) {
             console.log(err)
           }
           
           conn.release()
           
           reslove({err, rows})
           // cb(err, rows)
 
          }) 
        }
      })
    })
  },
  // 转成json
  writeJson(res, code = 200, msg = 'success', data = null) {
    let obj = {
      code,
      msg,
      data
    }
    if(!data) {
      delete obj.data
    }
    res.send(obj)
  }
}