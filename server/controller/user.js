const sql = require('../sql/sql')
const dayjs = require('dayjs')
const func = require('../sql/func');

const formatData = (rows) => {
  return rows.map(row=>{
    //处理每一行数据
    let date = dayjs(row.create_time).format('YYYY-MM-DD');
    let obj = {};
    switch(row){
        case 1:
            obj.role = '普通用户';
            break;
        case 10: 
            obj.role = '管理员';
            break;
        case 100:
            obj.role = '超级管理员';
            break;
    }

    delete row.password;  //删除数据的密码

    return Object.assign({}, row, {
        create_time: date
    }, obj); //重新拼接成obj
  });
}

module.exports = {

  fetchAll(req, res){
      let cur_page = req.body.cur_page;
      let sql, arr, endLimit, startLimit;

          endLimit = cur_page*10;
          startLimit = endLimit-10;

          sql = 'select * from user limit ?, ?';
          arr = [startLimit, endLimit];

          func.connPool(sql, arr, (err, rows)=>{
              rows = formatData(rows);
              res.json({ //响应拼接成json
                  code: 200,
                  msg: 'ok',
                  resultList: rows
              })
          });
  },

  //添加用户
  addUser(req, res){
      let name = req.body.account;
      let pass = req.body.password;
      // let role = req.body.role;

      let sql = `INSERT INTO user(account, password)VALUES('${name}','${pass}')`;

      func.connPool(sql, (err,rows)=>{
          res.json({
              code: 200,
              msg: 'success'
          })
      });
  },

  //删除用户
  deleteUser(req,res){
      let id = req.body.id;
      let sql = 'DELETE  from user WHERE id =' + id;

      let arr = [id];
      func.connPool(sql, arr, (err,rows)=>{
          res.json({
              code: 200,
              msg: 'done'
          })
      })
  },

  //批量删除
  deleteMulti(req,res){
      let id = req.body.id;
      let sql = 'DELETE FROM user WHERE id in ?';
      let arr = [[id]];

      func.connPool(sql,arr,(err,rows)=>{
          res.json({
              code: 200,
              msg: 'done'
          })
      })
  },

  //登录
  async login(ctx){
      const { request, response } = ctx
      let user_name = request.body.account;
      let password = request.body.password;

      // console.log('user_name', user_name);
      let sql = `SELECT * FROM user WHERE account='${user_name}'`;

      const { err, rows } = await func.connPool(sql)
      if(!rows.length){
        response.body = {
            code: 400,
            msg: '用户名不存在'
        };
        return ;
      }
      let pass = rows[0].password;
      if(password == pass){
        let user = {
            user_id: rows[0].id,
            user_name: rows[0].account,
        };
        // request.session.login = user;
        ctx.body = {
            code: 200,
            msg: 'success',
        }
        console.log(response)
      }else{
        ctx.body = {
            code: 200,
            msg: '密码错误',
        }
        return;
      }
  },

  //自动登录
  autoLogin(req,res){
      let user = req.session.login;
      if(user){
          res.json({
              code: 200,
              msg: '自动登录',
              user: user
          });
      }else{
          res.json({
              code: 400,
              msg: 'not found'
          })
      }
  },
  // 注销
  logout(req, res) {
    req.session.login = null;

    res.json({
    code: 200,
    msg: '注销'
    });
  },

  // 权限控制
  controlVisit(req, res, next) {
    if (req.session.login.role && req.session.login.role < 10) {
    res.json({
      code: 400,
      msg: '权限不够'
    });
    return;
    }

    next();
  },

  // 权限变更
  changeRole(req, res) {
    let role = req.session.login.role;
    let change_role = req.body.change_role;

    if (role !== 100 && change_role === 100) {
      res.json({
        code: 400,
        msg: '权限不够'
      });
      return;
    }

    let user_id = req.body.id;	

    let sql = 'UPDATE user SET role= ? WHERE id =?';
    let arr = [change_role,user_id];

    func.connPool(sql, arr, (err, rows) => {
    if (rows.affectedRows) {
        res.json({
          code: 200,
          msg: 'done'
        });
      }
    });
  },

  addDpt(req, res){
    let dptName = req.body.dptName;
    let peopleNum  = parseInt(req.body.peopleNum);
    
    let sql = `INSERT INTO department(dpt_name,people_num)VALUES('${dptName}',${peopleNum})`;

    func.connPool(sql, (err,rows)=>{
        if(err){
            throw err;
        }else{
            res.json({
                code: 200,
                msg: 'success'
            })
        }
    });
    // console.log(res);
  },

  getAccount(req, res){
    let account = req.body.account;

    let sql = `SELECT account FROM user`;

    func.connPool(sql, (err, rows)=>{
        if(err){
            throw err;
        }else{
            let nums = rows.map((item, index, arr)=>{
                return item.account;
            });
            res.json({
                code: 200,
                msg: 'success',
                accounts: nums
            })
        }
    });
  }
}