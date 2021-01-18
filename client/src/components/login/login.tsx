import React, { useState } from 'react'
import './login.scss' 
import axios from 'axios'

interface Info {
  account: string
  password: string
}

const Login = () => {
  const [info, setInfo] = useState<Info>({
    account: '',
    password: ''
  })
  const login = async () => {
    const res = await axios.post('http://localhost:2333/api/user/login',{
      account: info.account,
      password: info.password
    })
    if(res.data.code == 200 && res.data.msg == 'success'){
      // this.$alert('登录成功','提示',{
      //     confirmButtonText: '确定',
      //     callback: ()=>{

      //     }
      // })
      console.log('登录成功')
      setInfo({
        account: '',
        password: ''
      })
    }else{
      console.log(res.data.msg)
        // this.$alert(res.data.msg,'提示',{
        //     confirmButtonText: '确定',
        // })
    }
  }
  const signUp = () => {

  }
  return (
    <div className='container'>
      <div className='main'>
        <div className='info'>
            <input  placeholder="请输入账号" type="text" style={{marginTop: 30 }} onChange={(e) => {
              info.account = e.target.value
              setInfo({...info})
            }}>
            </input>
            <input placeholder="请输入密码" style={{ marginTop:20 }} type="password" onChange={(e) => {
              info.password = e.target.value
              setInfo({...info})
            }}>
            </input>
            <div style={{margin: '20px auto'}}>
                <button className='login-btn' onClick={login}>Sign In</button>
                <button className='signup-btn' onClick={signUp}>Sign Up</button>
            </div>
        </div>
      </div>
    </div>
  )
} 

export default Login