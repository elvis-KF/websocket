import React,{ChangeEvent, useEffect, useRef, useState} from 'react'
import './index.scss'
import userPic from '../../images/user.png'
import axios from 'axios'

interface MsgItem {
  // 类型
  type?: number
  // 用户
  user?: string
  // 消息
  msg?: string
  // 头像
  avater?: string
}
interface UserItem {
  // 用户名
  username?: string
  // 头像
  avater?: string
}

const App = () => {
  const textareaRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [msgList, setMsgList] = useState<MsgItem[]>([
    {type: 1, user: 'elvis', msg: '发消息'}
  ])
  const [userList, setUserList] = useState<UserItem[]>([
    {username: 'elvis', avater: '//downhdlogo.yy.com/hdlogo/6060/60/60/67/1529676741/u1529676741ze_z3me.jpg'}
  ])
  console.log(document.cookie)
  const [msg, setMsg] = useState<string>('')
  const [wss, setWss] = useState<WebSocket>()
  const [img, setImg] = useState<File>()
  const fileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    if (/(.*)\.(jpg|png|jpeg|JPG|PNG|JPEG|)$/.test(url) === false) {
      alert('仅支持jpg/jpeg/png/bmp格式的图片，请重新选择')
      e.target.value = ''
    } else {
      if(e.target.files) {
        const file = e.target.files[0]
        setImg(file)
        wss?.send(file)
      }
    }
    e.target.value = ''
  }
  const getUserInfo = async () => {
    const { data } = await axios.get('//localhost:2333/api/user/getUserInfo')
    console.log(data)
  }
  useEffect(() => {
    getUserInfo()
  }, [])
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:2333')
    ws.onopen = (res) => {
      console.log('连接生效')
    }
    ws.onmessage = (res: MessageEvent<any>) => {
      console.log(res)
      const { data } = res
      if(data) {
        msgList.push(data)
        setMsgList([...msgList])
      }
    }
    setWss(ws)
  }, [])
  return (
    <div className='wrapper'>
      <div className='info-wrapper'>
        <h3>Getting start with Websocket</h3>
        <p>To Learn React, Nodejs, Websocket, Koa2, Redis, Webpack</p>
      </div>
      <div className='content'>
        <div className='chatroom-wrapper'>
          <div className='chatroom-header'>
            <span className='icon icon-room'></span>
            <p>聊天室</p>
          </div>
          <div className='chatroom-content'>
          {msgList.length > 0 && 
            <ul className='chatroom-msg-list'>
              {msgList.length > 0 && msgList.map((item: MsgItem, idx: number) => {
                return (
                  <li className='chatroom-msg-item' key={item.msg ? item.msg + idx : idx}>
                    <img src={userPic} />
                    <div className='chatroom-msg-item-user'>
                      <p>{item.user}</p>
                      <p>{item.msg}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          }
          </div>
          <div className='chatroom-footer'>
            <div className='chatroom-function'>
              <i className='pic-select' title='选择图片' onClick={() => {
                if(inputRef && inputRef.current){
                   inputRef.current.click()
                }
              }}></i>
            </div>
            <div className='chatroom-input'>
              <input ref={textareaRef} value={msg}  onChange={(e) => {
                const value = e.target.value
                setMsg(value)
              }}></input>
            </div>
            <div className='chatroom-sendBtn'>
              <button onClick={() => {
                wss?.send(msg)
                setMsg('')
              }}>发送</button>
            </div>
          </div>
        </div>
        <div className='user-wrapper'>
          <div className='user-header'>
            <span className='icon icon-user'></span>
            <p>用户列表</p>
          </div>
          {
            userList.length > 0 ? 
            <ul className='user-list'>
              {userList.map((item: UserItem, idx: number) => {
                return (
                  <li className='user-list-item' key={item.username ? item.username + idx : idx}>
                    <img src={item.avater} />
                    <span>{item.username}</span>
                  </li>
                )
              })}
            </ul>
            : <p>暂无用户</p>
          }
        </div>
      </div>
      <input type="file" ref={inputRef} style={{ display: 'none' }} onChange={(e: ChangeEvent<HTMLInputElement>) => {
        fileSelect(e)
      }} />
    </div>
  )
}

export default App