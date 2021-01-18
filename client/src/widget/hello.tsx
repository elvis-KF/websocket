import React,{Component} from 'react'

export interface ChildProps {
  amout: number,
  name: string
}
export default class Hello extends Component<ChildProps, {}> {
  constructor(props:any){
    super(props);
    this.state={}
  }

  render(){
    return (
      <div>{this.props.amout}{this.props.name}</div>
    )
  }
}